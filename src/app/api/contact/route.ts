import { NextResponse } from "next/server";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

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

function errorResponse(status: number, error: string, errors?: string[]) {
  return NextResponse.json({ success: false, error, errors }, { status });
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
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
  const errors: string[] = [];

  if (!name) {
    errors.push("Name is required.");
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.push(`Name must be ${MAX_NAME_LENGTH} characters or fewer.`);
  }

  if (!email) {
    errors.push("Email is required.");
  } else if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    errors.push("A valid email address is required.");
  }

  if (!message) {
    errors.push("Message is required.");
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.push(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
  }

  if (errors.length > 0) {
    return errorResponse(400, errors[0], errors);
  }

  const contact: ContactMessage = { name, email, message };
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL?.trim();
  const web3formsAccessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();

  try {
    if (n8nWebhookUrl) {
      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, source: "portfolio", submittedAt: new Date().toISOString() }),
      });

      if (!response.ok) {
        return errorResponse(502, "Could not deliver the message. Please try again.");
      }

      return NextResponse.json({
        success: true,
        message: "Thanks, your message has been sent.",
        provider: "n8n",
      });
    }

    if (web3formsAccessKey) {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
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
        return errorResponse(
          502,
          result?.message || "Could not deliver the message. Please try again.",
        );
      }

      return NextResponse.json({
        success: true,
        message: "Thanks, your message has been sent.",
        provider: "web3forms",
      });
    }

    return errorResponse(
      500,
      "Contact form is not configured. Set WEB3FORMS_ACCESS_KEY or N8N_WEBHOOK_URL.",
    );
  } catch {
    return errorResponse(502, "Could not deliver the message. Please try again.");
  }
}
