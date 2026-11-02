import { NextResponse } from "next/server";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const UPSTREAM_TIMEOUT_MS = 10_000;

const GENERIC_UPSTREAM_ERROR =
  "Could not deliver the message. Please try again or email me directly.";
const GENERIC_CONFIG_ERROR =
  "The contact form is temporarily unavailable. Please email me directly.";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
};

type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

type ContactField = "name" | "email" | "message";
type FieldErrors = Partial<Record<ContactField, string>>;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type ErrorOptions = {
  errors?: string[];
  fieldErrors?: FieldErrors;
  headers?: HeadersInit;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function errorResponse(
  status: number,
  error: string,
  options: ErrorOptions = {},
) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(options.errors ? { errors: options.errors } : {}),
      ...(options.fieldErrors ? { fieldErrors: options.fieldErrors } : {}),
    },
    { status, headers: options.headers },
  );
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();

  if (rateLimitStore.size > 1000) {
    for (const [key, entry] of rateLimitStore) {
      if (entry.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }

  const existing = rateLimitStore.get(ip);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;

  return { allowed: true, retryAfter: 0 };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return errorResponse(
      429,
      "Too many requests. Please wait a few minutes and try again.",
      { headers: { "Retry-After": String(rateLimit.retryAfter) } },
    );
  }

  let body: ContactBody;

  try {
    const parsed = (await request.json()) as unknown;

    if (!parsed || typeof parsed !== "object") {
      return errorResponse(400, "Invalid JSON body.");
    }

    body = parsed as ContactBody;
  } catch {
    return errorResponse(400, "Invalid JSON body.");
  }

  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (website !== "") {
    return NextResponse.json({
      success: true,
      message: "Thanks, your message has been received.",
    });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const fieldErrors: FieldErrors = {};

  if (!name) {
    fieldErrors.name = "Name is required.";
  } else if (name.length > MAX_NAME_LENGTH) {
    fieldErrors.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  if (!email) {
    fieldErrors.email = "Email is required.";
  } else if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    fieldErrors.email = "A valid email address is required.";
  }

  if (!message) {
    fieldErrors.message = "Message is required.";
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    fieldErrors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  }

  const errors = Object.values(fieldErrors).filter(
    (value): value is string => Boolean(value),
  );

  if (errors.length > 0) {
    return errorResponse(400, errors[0], { errors, fieldErrors });
  }

  const webhookUrl = process.env.N8N_CONTACT_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    console.error(
      "[contact] N8N_CONTACT_WEBHOOK_URL is not configured. Add it to .env.local as a server-only variable and restart the server.",
    );

    return errorResponse(500, GENERIC_CONFIG_ERROR);
  }

  const contact: ContactMessage = { name, email, message };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...contact, website: "" }),
      signal: controller.signal,
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as {
      success?: unknown;
    } | null;

    if (!response.ok || result?.success !== true) {
      console.error(
        `[contact] n8n delivery failed with status ${response.status}.`,
      );

      return errorResponse(502, GENERIC_UPSTREAM_ERROR);
    }

    return NextResponse.json({
      success: true,
      message: "Thanks, your message has been sent.",
    });
  } catch (error) {
    console.error(
      "[contact] Delivery failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return errorResponse(502, GENERIC_UPSTREAM_ERROR);
  } finally {
    clearTimeout(timeout);
  }
}
