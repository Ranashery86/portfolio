// This route is currently unused. Web3Forms blocks server-side requests on the
// free plan with a Cloudflare 403 challenge, so the contact form submits directly
// from the browser. Keep this handler for the future n8n webhook path.

import { NextResponse } from "next/server";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  honeypot?: unknown;
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

function hasUsableWeb3FormsKey(key: string | undefined) {
  if (!key) {
    return false;
  }

  return !key.toLowerCase().includes("your-");
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

  const honeypot =
    typeof body.honeypot === "string"
      ? body.honeypot
      : typeof body.website === "string"
        ? body.website
        : "";

  if (honeypot.trim() !== "") {
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

  const contact: ContactMessage = { name, email, message };
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL?.trim();
  const web3formsAccessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();
  const web3formsConfigured = hasUsableWeb3FormsKey(web3formsAccessKey);

  try {
    if (n8nWebhookUrl) {
      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          source: "portfolio",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error(
          `[contact] n8n delivery failed with status ${response.status}.`,
        );
        return errorResponse(
          502,
          "Could not deliver the message. Please try again or email me directly.",
        );
      }

      return NextResponse.json({
        success: true,
        message: "Thanks, your message has been sent.",
        provider: "n8n",
      });
    }

    if (web3formsConfigured && web3formsAccessKey) {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          subject: `New enquiry from ${name}`,
          from_name: name,
          replyto: email,
          name,
          email,
          message,
          botcheck: false,
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok || result?.success === false) {
        console.error(
          `[contact] Web3Forms delivery failed with status ${response.status}.`,
        );
        return errorResponse(
          502,
          "Could not deliver the message. Please try again or email me directly.",
        );
      }

      return NextResponse.json({
        success: true,
        message: "Thanks, your message has been sent.",
        provider: "web3forms",
      });
    }

    console.error(
      "[contact] Contact form is not configured. Set a real WEB3FORMS_ACCESS_KEY or N8N_WEBHOOK_URL.",
    );

    return errorResponse(
      500,
      "The contact form is not configured yet. Please email me directly.",
    );
  } catch (error) {
    console.error(
      "[contact] Delivery failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return errorResponse(
      502,
      "Could not deliver the message. Please try again or email me directly.",
    );
  }
}
