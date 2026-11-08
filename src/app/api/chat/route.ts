import { NextResponse } from "next/server";

export const maxDuration = 30;

const MAX_TEXT_LENGTH = 500;
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const UPSTREAM_TIMEOUT_MS = 30_000;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type ChatBody = {
  text?: unknown;
  sessionId?: unknown;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

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
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      },
    );
  }

  let body: ChatBody;

  try {
    const parsed = (await request.json()) as unknown;

    if (!parsed || typeof parsed !== "object") {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    body = parsed as ChatBody;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";

  if (
    text.length < 1 ||
    text.length > MAX_TEXT_LENGTH ||
    !SESSION_ID_PATTERN.test(sessionId)
  ) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const voiceWebhookUrl = process.env.N8N_VOICE_WEBHOOK_URL?.trim();
  const voiceWebhookSecret = process.env.VOICE_WEBHOOK_SECRET?.trim();
  const voiceWebhookHeaderName =
    process.env.VOICE_WEBHOOK_HEADER_NAME?.trim() || "portfolio-voice-agent";

  if (!voiceWebhookUrl || !voiceWebhookSecret) {
    console.error(
      "[chat] Assistant is not configured. Set N8N_VOICE_WEBHOOK_URL and VOICE_WEBHOOK_SECRET as server-only variables in .env.local and restart the server.",
    );

    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(voiceWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [voiceWebhookHeaderName]: voiceWebhookSecret,
      },
      body: JSON.stringify({ sessionId, text, mode: "text" }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[chat] n8n non-2xx", {
        status: response.status,
        contentType: response.headers.get("content-type"),
        bodyStart: (await response.text()).slice(0, 200),
        headerNameUsed: voiceWebhookHeaderName,
        secretLength: voiceWebhookSecret.length,
        requestContentType: request.headers.get("content-type"),
      });

      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }

    const result = (await response.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;

    const reply =
      result && typeof result.reply === "string" ? result.reply.trim() : "";

    if (!reply) {
      console.error(
        `[chat] n8n chat webhook returned an invalid response (status ${response.status}).`,
      );

      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }

    const lang = typeof result?.lang === "string" ? result.lang : "";

    return NextResponse.json({ reply, lang });
  } catch (error) {
    console.error(
      "[chat] Chat proxy request failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return NextResponse.json({ error: "upstream" }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
