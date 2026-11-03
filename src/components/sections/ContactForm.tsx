"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COOLDOWN_MS = 30_000;
const COOLDOWN_STORAGE_KEY = "portfolio-contact-cooldown";

const initialFields = {
  name: "",
  email: "",
  message: "",
};

type FieldName = keyof typeof initialFields;
type FieldErrors = Partial<Record<FieldName, string>>;
type FormStatus = "idle" | "submitting" | "success" | "error";

type ContactApiSuccessResponse = {
  success: true;
  message?: string;
};

type ContactApiErrorResponse = {
  success: false;
  error?: string;
  errors?: string[];
  fieldErrors?: FieldErrors;
};

type ContactApiResponse = ContactApiSuccessResponse | ContactApiErrorResponse;

function readStoredCooldown() {
  try {
    const stored = Number(sessionStorage.getItem(COOLDOWN_STORAGE_KEY));

    return Number.isFinite(stored) ? stored : 0;
  } catch {
    return 0;
  }
}

function storeCooldown(until: number) {
  try {
    sessionStorage.setItem(COOLDOWN_STORAGE_KEY, String(until));
  } catch {
    return;
  }
}

const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate bg-ink/60 px-4 py-3 text-base text-white transition-colors placeholder:text-lavender/40 focus:border-violet-light focus:ring-2 focus:ring-violet-light/30 focus:outline-none aria-invalid:border-lavender aria-invalid:ring-1 aria-invalid:ring-lavender/30";

export function ContactForm() {
  const [fields, setFields] = useState(initialFields);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  const cooldownUntilRef = useRef(0);

  useEffect(() => {
    cooldownUntilRef.current = readStoredCooldown();
  }, []);

  const isSubmitting = status === "submitting";

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const fieldName = event.target.name as FieldName;
    const { value } = event.target;

    setFields((current) => ({ ...current, [fieldName]: value }));

    if (fieldErrors[fieldName]) {
      setFieldErrors((current) => ({ ...current, [fieldName]: undefined }));
    }

    if (status === "error") {
      setStatus("idle");
      setServerError(null);
    }
  }

  function validate() {
    const nextErrors: FieldErrors = {};

    if (!fields.name.trim()) {
      nextErrors.name = "Please enter your name.";
    } else if (fields.name.trim().length > MAX_NAME_LENGTH) {
      nextErrors.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
    }

    if (!fields.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (
      fields.email.trim().length > MAX_EMAIL_LENGTH ||
      !EMAIL_PATTERN.test(fields.email.trim())
    ) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!fields.message.trim()) {
      nextErrors.message = "Please enter a message.";
    } else if (fields.message.trim().length > MAX_MESSAGE_LENGTH) {
      nextErrors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
    }

    setFieldErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    setServerError(null);
    setFieldErrors({});

    if (!validate()) {
      return;
    }

    const fallbackError = `Something went wrong. Please try again or email me directly at ${siteConfig.email}.`;
    const honeypot = honeypotRef.current?.value ?? "";

    const cooldownRemainingMs = cooldownUntilRef.current - Date.now();

    if (cooldownRemainingMs > 0) {
      setServerError(
        `Please wait ${Math.ceil(cooldownRemainingMs / 1000)} seconds before sending another message.`,
      );
      setStatus("error");
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          message: fields.message.trim(),
          hp: honeypot,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | ContactApiResponse
        | null;

      if (response.status === 429) {
        setServerError(
          data && "error" in data
            ? data.error || "Too many requests. Please wait a few minutes and try again."
            : "Too many requests. Please wait a few minutes and try again.",
        );
        setStatus("error");
        return;
      }

      if (response.ok && data && "success" in data && data.success === true) {
        const cooldownUntil = Date.now() + COOLDOWN_MS;

        cooldownUntilRef.current = cooldownUntil;
        storeCooldown(cooldownUntil);
        setStatus("success");
        return;
      }

      if (response.status === 400 && data && "fieldErrors" in data && data.fieldErrors) {
        setFieldErrors(data.fieldErrors);
        setServerError(
          (data.errors && data.errors[0]) ||
            data.error ||
            "Please check the highlighted fields and try again.",
        );
        setStatus("error");
        return;
      }

      setServerError(
        data && "error" in data && data.error
          ? data.error
          : fallbackError,
      );
      setStatus("error");
    } catch {
      setServerError(fallbackError);
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  }

  function resetForm() {
    setFields({ ...initialFields });
    setFieldErrors({});
    setServerError(null);
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-start gap-4 rounded-xl border border-violet-light/30 bg-violet-deep/50 p-6"
      >
        <span className="flex size-11 items-center justify-center rounded-full border border-violet-light/40 bg-violet-light/15 text-violet-light">
          <CheckCircle2 aria-hidden className="size-6" />
        </span>
        <div>
          <p className="font-heading text-xl font-semibold text-white">
            Thanks! Your message has been sent.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-lavender">
            I&apos;ll reply by email soon.
          </p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex min-h-11 items-center rounded-full text-sm font-semibold text-violet-light underline-offset-4 transition-colors hover:text-lavender hover:underline focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isSubmitting}
      className="relative flex flex-col gap-5"
    >
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="contact-company-fax-number">
          Leave this field empty
        </label>
        <input
          ref={honeypotRef}
          id="contact-company-fax-number"
          name="company_fax_number"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div>
        <label
          htmlFor="contact-name"
          className="text-sm font-medium text-white"
        >
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={MAX_NAME_LENGTH}
          required
          value={fields.name}
          onChange={handleChange}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={
            fieldErrors.name ? "contact-name-error" : undefined
          }
          className={cn(fieldClassName, "min-h-12")}
        />
        {fieldErrors.name ? (
          <p
            id="contact-name-error"
            className="mt-2 flex items-center gap-1.5 text-sm text-lavender"
          >
            <AlertCircle aria-hidden className="size-4 shrink-0" />
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="text-sm font-medium text-white"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={MAX_EMAIL_LENGTH}
          required
          value={fields.email}
          onChange={handleChange}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={
            fieldErrors.email ? "contact-email-error" : undefined
          }
          className={cn(fieldClassName, "min-h-12")}
        />
        {fieldErrors.email ? (
          <p
            id="contact-email-error"
            className="mt-2 flex items-center gap-1.5 text-sm text-lavender"
          >
            <AlertCircle aria-hidden className="size-4 shrink-0" />
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="contact-message"
            className="text-sm font-medium text-white"
          >
            Message
          </label>
          <span
            id="contact-message-counter"
            className="text-xs tabular-nums text-lavender/60"
          >
            {fields.message.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          required
          value={fields.message}
          onChange={handleChange}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={
            fieldErrors.message
              ? "contact-message-error contact-message-counter"
              : "contact-message-counter"
          }
          className={cn(fieldClassName, "min-h-32 resize-y")}
        />
        {fieldErrors.message ? (
          <p
            id="contact-message-error"
            className="mt-2 flex items-center gap-1.5 text-sm text-lavender"
          >
            <AlertCircle aria-hidden className="size-4 shrink-0" />
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-violet-light/40 bg-violet-deep/60 p-3 text-sm leading-relaxed text-lavender"
        >
          <AlertCircle
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-violet-light"
          />
          <p>{serverError}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send aria-hidden className="size-4" />
              Send message
            </>
          )}
        </Button>
        <p className="text-xs leading-relaxed text-lavender/60">
          Your details are only used to reply to your message.
        </p>
      </div>
    </form>
  );
}
