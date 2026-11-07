"use client";

import {
  AlertCircle,
  ArrowUpRight,
  Loader2,
  MessageSquare,
  Mic,
  Send,
  Sparkles,
  Square,
  Volume2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

type VoiceStatus =
  | "idle"
  | "starting"
  | "recording"
  | "processing"
  | "playing";

type AssistantMode = "chat" | "voice";

type ChatMessage = {
  id: string;
  role: "visitor" | "assistant";
  text: string;
};

type VoiceResponse = {
  transcript?: string | null;
  reply?: string | null;
  lang?: string | null;
  audio?: string | null;
  audioMime?: string | null;
  error?: string;
};

type ChatResponse = {
  reply?: unknown;
  lang?: unknown;
  error?: unknown;
};

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg",
] as const;

const MAX_RECORDING_MS = 30_000;
const MIN_RECORDING_MS = 1_000;
const SESSION_STORAGE_KEY = "portfolio-voice-session";
const MODE_STORAGE_KEY = "assistantMode";
const MAX_CHAT_LENGTH = 500;
const CHAT_COUNTER_THRESHOLD = 400;

const MODE_CHOOSER_WELCOME =
  "Hi! I'm Shaheer's AI assistant. How would you like to talk?";
const CHAT_WELCOME =
  "Type your question below. I can tell you about custom CRMs and automation.";
const VOICE_WELCOME =
  "Tap the mic and ask me about custom CRMs and automation.";

const ERROR_MESSAGES = {
  permission:
    "Microphone access is blocked. Please allow it in your browser settings.",
  noMicrophone:
    "No microphone was found. Please connect one and try again.",
  unsupported:
    "Voice recording is not supported in this browser. Please try a different browser.",
  notConfigured:
    "The voice assistant is being set up and will be available soon.",
  upstream: "Something went wrong. Please try again.",
  rateLimited: "Too many requests. Please wait a few minutes.",
  tooShort: "That was too short. Please try again.",
} as const;

const CHAT_ERROR_MESSAGES = {
  notConfigured:
    "The assistant is being set up and will be available soon.",
  rateLimited: "Too many messages. Please wait a few minutes.",
  upstream: "Something went wrong. Please try again.",
} as const;

let memorySessionId: string | null = null;

function getSessionId() {
  if (memorySessionId) {
    return memorySessionId;
  }

  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (stored && /^[A-Za-z0-9_-]{1,64}$/.test(stored)) {
      memorySessionId = stored;
      return stored;
    }
  } catch {
    // sessionStorage can be unavailable in private browsing modes.
  }

  const generated =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  memorySessionId = generated;

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, generated);
  } catch {
    // Fall back to the in-memory value.
  }

  return generated;
}

function readStoredMode(): AssistantMode | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = sessionStorage.getItem(MODE_STORAGE_KEY);

    if (stored === "chat" || stored === "voice") {
      return stored;
    }
  } catch {
    // Fall back to showing the mode chooser.
  }

  return null;
}

function storeMode(mode: AssistantMode) {
  try {
    sessionStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // The widget still works if storage is unavailable.
  }
}

function getAudioExtension(mimeType: string) {
  if (mimeType.includes("mp4")) {
    return "mp4";
  }

  if (mimeType.includes("ogg")) {
    return "ogg";
  }

  return "webm";
}

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function createMessageId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-violet-light/15 bg-violet-deep px-3.5 py-3">
        <span className="sr-only">Assistant is typing</span>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            aria-hidden
            className="typing-dot size-1.5 rounded-full bg-violet-light"
            style={{ animationDelay: `${index * 150}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

export function VoiceWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AssistantMode | null>(() =>
    readStoredMode(),
  );
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);

  const panelId = useId();
  const titleId = useId();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);
  const chatChooserRef = useRef<HTMLButtonElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const autoStopRef = useRef<number | null>(null);
  const recordingStartedAtRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fetchControllerRef = useRef<AbortController | null>(null);
  const chatControllerRef = useRef<AbortController | null>(null);
  const statusRef = useRef<VoiceStatus>("idle");
  const openRef = useRef(false);
  const modeRef = useRef<AssistantMode | null>(mode);
  const prevModeRef = useRef<AssistantMode | null>(mode);
  const welcomeInitRef = useRef(false);
  const shouldRefocusInputRef = useRef(false);

  const updateStatus = useCallback((next: VoiceStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const addMessage = useCallback((role: ChatMessage["role"], text: string) => {
    setMessages((current) => [
      ...current,
      { id: createMessageId(), role, text },
    ]);
  }, []);

  const clearTimers = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (autoStopRef.current !== null) {
      window.clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
  }, []);

  const releaseAudio = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audio.src = "";
    audioRef.current = null;
  }, []);

  const releaseRecording = useCallback(() => {
    clearTimers();

    const recorder = mediaRecorderRef.current;

    if (recorder) {
      recorder.ondataavailable = null;
      recorder.onstop = null;

      if (recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch {
          // The recorder may already be stopping.
        }
      }
    }

    mediaRecorderRef.current = null;
    chunksRef.current = [];

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, [clearTimers]);

  const stopPlayback = useCallback(() => {
    releaseAudio();
    setPlaybackUrl(null);

    if (statusRef.current === "playing") {
      updateStatus("idle");
    }
  }, [releaseAudio, updateStatus]);

  const cleanupMedia = useCallback(() => {
    releaseRecording();
    stopPlayback();
    updateStatus("idle");
  }, [releaseRecording, stopPlayback, updateStatus]);

  const playAudio = useCallback(
    async (url: string) => {
      releaseAudio();

      const audio = new Audio(url);
      audioRef.current = audio;
      updateStatus("playing");

      audio.onended = () => {
        if (audioRef.current !== audio) {
          return;
        }

        audioRef.current = null;
        setPlaybackUrl(null);
        updateStatus("idle");
      };

      audio.onerror = () => {
        if (audioRef.current !== audio) {
          return;
        }

        audioRef.current = null;
        setPlaybackUrl(null);
        updateStatus("idle");
      };

      try {
        await audio.play();
        return true;
      } catch {
        audio.onended = null;
        audio.onerror = null;

        if (audioRef.current === audio) {
          audioRef.current = null;
        }

        audio.src = "";
        updateStatus("idle");

        return false;
      }
    },
    [releaseAudio, updateStatus],
  );

  const chooseMode = useCallback(
    (next: AssistantMode) => {
      if (modeRef.current === next) {
        return;
      }

      modeRef.current = next;
      storeMode(next);
      setError(null);

      if (!welcomeInitRef.current) {
        welcomeInitRef.current = true;
        addMessage(
          "assistant",
          next === "chat" ? CHAT_WELCOME : VOICE_WELCOME,
        );
      }

      if (next === "chat") {
        cleanupMedia();
      }

      setMode(next);
    },
    [addMessage, cleanupMedia],
  );

  const sendChat = useCallback(async () => {
    if (modeRef.current !== "chat" || isSendingChat) {
      return;
    }

    const text = chatInput.trim();

    if (!text) {
      return;
    }

    setChatInput("");
    setError(null);
    shouldRefocusInputRef.current = true;
    setIsSendingChat(true);
    addMessage("visitor", text);

    const controller = new AbortController();
    chatControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sessionId: getSessionId() }),
        signal: controller.signal,
        cache: "no-store",
      });

      const data = (await response
        .json()
        .catch(() => null)) as ChatResponse | null;

      if (response.status === 429 || data?.error === "rate_limited") {
        setChatInput(text);
        setError(CHAT_ERROR_MESSAGES.rateLimited);
        return;
      }

      if (response.status === 503 || data?.error === "not_configured") {
        setChatInput(text);
        setError(CHAT_ERROR_MESSAGES.notConfigured);
        return;
      }

      if (!response.ok) {
        setChatInput(text);
        setError(CHAT_ERROR_MESSAGES.upstream);
        return;
      }

      const reply = typeof data?.reply === "string" ? data.reply.trim() : "";

      if (!reply) {
        setChatInput(text);
        setError(CHAT_ERROR_MESSAGES.upstream);
        return;
      }

      addMessage("assistant", reply);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") {
        return;
      }

      setChatInput(text);
      setError(CHAT_ERROR_MESSAGES.upstream);
    } finally {
      if (chatControllerRef.current === controller) {
        chatControllerRef.current = null;
      }

      setIsSendingChat(false);
    }
  }, [addMessage, chatInput, isSendingChat]);

  const sendRecording = useCallback(
    async (blob: Blob, mimeType: string) => {
      if (!openRef.current) {
        updateStatus("idle");
        return;
      }

      updateStatus("processing");
      setError(null);

      const controller = new AbortController();
      fetchControllerRef.current = controller;

      try {
        const formData = new FormData();
        formData.append(
          "audio",
          blob,
          `recording.${getAudioExtension(mimeType)}`,
        );
        formData.append("sessionId", getSessionId());

        const response = await fetch("/api/voice", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        if (response.status === 429) {
          updateStatus("idle");
          setError(ERROR_MESSAGES.rateLimited);
          return;
        }

        const data = (await response
          .json()
          .catch(() => null)) as VoiceResponse | null;

        if (!response.ok) {
          updateStatus("idle");
          setError(
            response.status === 503 || data?.error === "not_configured"
              ? ERROR_MESSAGES.notConfigured
              : ERROR_MESSAGES.upstream,
          );
          return;
        }

        const reply = typeof data?.reply === "string" ? data.reply.trim() : "";
        const transcript =
          typeof data?.transcript === "string" ? data.transcript.trim() : "";

        if (!reply) {
          updateStatus("idle");
          setError(ERROR_MESSAGES.upstream);
          return;
        }

        if (transcript) {
          addMessage("visitor", transcript);
        }

        addMessage("assistant", reply);

        if (
          modeRef.current === "voice" &&
          openRef.current &&
          typeof data?.audio === "string" &&
          data.audio.length > 0
        ) {
          const audioMime =
            typeof data.audioMime === "string" && data.audioMime
              ? data.audioMime
              : "audio/wav";
          const dataUrl = `data:${audioMime};base64,${data.audio}`;
          const played = await playAudio(dataUrl);

          if (!played) {
            setPlaybackUrl(dataUrl);
          }
        } else {
          updateStatus("idle");
        }
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") {
          return;
        }

        updateStatus("idle");
        setError(ERROR_MESSAGES.upstream);
      } finally {
        if (fetchControllerRef.current === controller) {
          fetchControllerRef.current = null;
        }
      }
    },
    [addMessage, playAudio, updateStatus],
  );

  const startRecording = useCallback(async () => {
    if (modeRef.current !== "voice" || statusRef.current !== "idle") {
      return;
    }

    setError(null);

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setError(ERROR_MESSAGES.unsupported);
      return;
    }

    const mimeType =
      MIME_CANDIDATES.find((candidate) =>
        MediaRecorder.isTypeSupported(candidate),
      ) ?? "";

    updateStatus("starting");
    releaseAudio();
    setPlaybackUrl(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      const selectedMimeType = recorder.mimeType || mimeType || "audio/webm";

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearTimers();

        const duration = Date.now() - recordingStartedAtRef.current;
        const chunks = chunksRef.current;
        chunksRef.current = [];

        releaseRecording();

        if (duration < MIN_RECORDING_MS) {
          updateStatus("idle");
          setError(ERROR_MESSAGES.tooShort);
          return;
        }

        const blob = new Blob(chunks, { type: selectedMimeType });

        if (blob.size === 0) {
          updateStatus("idle");
          setError(ERROR_MESSAGES.upstream);
          return;
        }

        void sendRecording(blob, selectedMimeType);
      };

      recorder.start();
      recordingStartedAtRef.current = Date.now();
      setElapsedMs(0);
      updateStatus("recording");

      timerRef.current = window.setInterval(() => {
        setElapsedMs(Date.now() - recordingStartedAtRef.current);
      }, 250);

      autoStopRef.current = window.setTimeout(() => {
        const activeRecorder = mediaRecorderRef.current;

        if (activeRecorder && activeRecorder.state === "recording") {
          activeRecorder.stop();
        }
      }, MAX_RECORDING_MS);
    } catch (caught) {
      releaseRecording();
      updateStatus("idle");

      const name = caught instanceof DOMException ? caught.name : "";

      if (
        name === "NotAllowedError" ||
        name === "PermissionDeniedError" ||
        name === "SecurityError"
      ) {
        setError(ERROR_MESSAGES.permission);
      } else if (
        name === "NotFoundError" ||
        name === "DevicesNotFoundError"
      ) {
        setError(ERROR_MESSAGES.noMicrophone);
      } else {
        setError(ERROR_MESSAGES.upstream);
      }
    }
  }, [
    clearTimers,
    releaseAudio,
    releaseRecording,
    sendRecording,
    updateStatus,
  ]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state === "recording") {
      try {
        recorder.stop();
      } catch {
        // The recorder may already be stopping.
      }
    }
  }, []);

  const handleMicClick = useCallback(() => {
    if (statusRef.current === "recording") {
      stopRecording();
      return;
    }

    if (statusRef.current === "idle") {
      void startRecording();
    }
  }, [startRecording, stopRecording]);

  const handlePlayReply = useCallback(async () => {
    if (!playbackUrl) {
      return;
    }

    const url = playbackUrl;
    setPlaybackUrl(null);

    const played = await playAudio(url);

    if (!played) {
      setPlaybackUrl(url);
    }
  }, [playAudio, playbackUrl]);

  const openPanel = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    fetchControllerRef.current?.abort();
    fetchControllerRef.current = null;
    chatControllerRef.current?.abort();
    chatControllerRef.current = null;
    cleanupMedia();
    triggerRef.current?.focus();
  }, [cleanupMedia]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!mode || welcomeInitRef.current) {
      return;
    }

    welcomeInitRef.current = true;
    addMessage("assistant", mode === "chat" ? CHAT_WELCOME : VOICE_WELCOME);
  }, [addMessage, mode]);

  useEffect(() => {
    openRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      if (modeRef.current === "chat") {
        inputRef.current?.focus();
      } else if (modeRef.current === "voice") {
        micButtonRef.current?.focus();
      } else {
        chatChooserRef.current?.focus();
      }
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closePanel, isOpen]);

  useEffect(() => {
    const previous = prevModeRef.current;
    prevModeRef.current = mode;

    if (!isOpen || mode === null || previous === mode) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      if (mode === "chat") {
        inputRef.current?.focus();
      } else {
        micButtonRef.current?.focus();
      }
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [isOpen, mode]);

  useEffect(() => {
    if (isSendingChat || !shouldRefocusInputRef.current) {
      return;
    }

    shouldRefocusInputRef.current = false;

    if (openRef.current && modeRef.current === "chat") {
      inputRef.current?.focus();
    }
  }, [isSendingChat]);

  useEffect(() => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 112)}px`;
  }, [chatInput, isOpen, mode]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const list = listRef.current;

    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, [isOpen, isSendingChat, messages, mode]);

  useEffect(() => {
    return () => {
      fetchControllerRef.current?.abort();
      chatControllerRef.current?.abort();
      releaseRecording();
      releaseAudio();
    };
  }, [releaseAudio, releaseRecording]);

  return (
    <div className="fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[60] sm:right-[calc(1.5rem+env(safe-area-inset-right))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]">
      {isOpen ? (
        <div
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="voice-panel voice-panel-enter absolute right-0 bottom-[calc(56px+0.75rem)] flex w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-violet-light/25 bg-violet-deep/80 shadow-[0_24px_70px_-18px_rgba(14,11,29,0.9),0_0_38px_-8px_rgba(139,124,199,0.35)] backdrop-blur-xl sm:w-[360px] sm:max-w-[360px]"
        >
          <div className="shrink-0 border-b border-violet-light/20 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden
                  className="flex size-8 items-center justify-center rounded-full border border-violet-light/30 bg-violet-light/15 text-violet-light"
                >
                  <Sparkles className="size-4" />
                </span>
                <h2
                  id={titleId}
                  className="truncate font-heading text-base font-semibold text-lavender"
                >
                  Shaheer&apos;s AI Assistant
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closePanel}
                aria-label="Close AI assistant"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-transparent text-lavender transition-colors hover:bg-violet-light/10 hover:text-violet-light focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-violet-deep focus-visible:outline-none"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>

            <div
              role="group"
              aria-label="Conversation mode"
              className="mt-2 flex w-fit items-center gap-1 rounded-full border border-violet-light/25 bg-violet-deep/60 p-1"
            >
              <button
                type="button"
                aria-pressed={mode === "chat"}
                onClick={() => chooseMode("chat")}
                className={cn(
                  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-violet-deep focus-visible:outline-none",
                  mode === "chat"
                    ? "bg-violet-light text-ink"
                    : "text-lavender hover:bg-violet-light/10 hover:text-violet-light",
                )}
              >
                Chat
              </button>
              <button
                type="button"
                aria-pressed={mode === "voice"}
                onClick={() => chooseMode("voice")}
                className={cn(
                  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-violet-deep focus-visible:outline-none",
                  mode === "voice"
                    ? "bg-violet-light text-ink"
                    : "text-lavender hover:bg-violet-light/10 hover:text-violet-light",
                )}
              >
                Talk
              </button>
            </div>
          </div>

          <div
            ref={listRef}
            aria-live="polite"
            aria-relevant="additions text"
            className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {mode === null ? (
              <div className="space-y-3">
                <div className="flex justify-start">
                  <p
                    dir="auto"
                    className="max-w-[85%] rounded-2xl rounded-bl-md border border-violet-light/15 bg-violet-deep px-3.5 py-2.5 text-sm leading-relaxed text-lavender"
                  >
                    {MODE_CHOOSER_WELCOME}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    ref={chatChooserRef}
                    type="button"
                    onClick={() => chooseMode("chat")}
                    className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-violet-light bg-violet-light/10 px-4 py-3 text-left backdrop-blur transition-colors hover:bg-violet-light/15 focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-violet-deep focus-visible:outline-none"
                  >
                    <span
                      aria-hidden
                      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-violet-light/40 bg-violet-deep text-violet-light"
                    >
                      <MessageSquare className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-heading text-sm font-semibold text-lavender">
                        Chat
                      </span>
                      <span className="block text-xs leading-relaxed text-lavender/70">
                        Type your questions
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => chooseMode("voice")}
                    className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-violet-light bg-violet-light/10 px-4 py-3 text-left backdrop-blur transition-colors hover:bg-violet-light/15 focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-violet-deep focus-visible:outline-none"
                  >
                    <span
                      aria-hidden
                      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-violet-light/40 bg-violet-deep text-violet-light"
                    >
                      <Mic className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-heading text-sm font-semibold text-lavender">
                        Talk
                      </span>
                      <span className="block text-xs leading-relaxed text-lavender/70">
                        Speak and hear the replies
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "visitor"
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    <p
                      dir="auto"
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                        message.role === "visitor"
                          ? "rounded-br-md bg-violet-light text-ink"
                          : "rounded-bl-md border border-violet-light/15 bg-violet-deep text-lavender",
                      )}
                    >
                      {message.text}
                    </p>
                  </div>
                ))}

                {isSendingChat ? <TypingIndicator /> : null}
              </>
            )}
          </div>

          <div className="shrink-0 border-t border-violet-light/20 px-4 py-3">
            {error ? (
              <p
                role="alert"
                className="mb-3 flex items-start gap-2 rounded-xl border border-violet-light/30 bg-violet-light/10 px-3 py-2 text-sm leading-relaxed text-lavender"
              >
                <AlertCircle
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-violet-light"
                />
                <span>{error}</span>
              </p>
            ) : null}

            {mode === "chat" ? (
              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <textarea
                    ref={inputRef}
                    dir="auto"
                    rows={1}
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        void sendChat();
                      }
                    }}
                    placeholder="Type your question..."
                    maxLength={MAX_CHAT_LENGTH}
                    disabled={isSendingChat}
                    aria-label="Type your question"
                    className="max-h-28 w-full resize-none rounded-2xl border border-violet-light/30 bg-violet-deep/60 px-3.5 py-2.5 text-sm leading-relaxed text-lavender placeholder:text-lavender/50 focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-violet-deep focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
                  />
                  {chatInput.length > CHAT_COUNTER_THRESHOLD ? (
                    <p className="mt-1 text-right text-[11px] text-lavender/60">
                      {chatInput.length}/{MAX_CHAT_LENGTH}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => void sendChat()}
                  disabled={isSendingChat || chatInput.trim().length === 0}
                  aria-label="Send message"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-violet-light text-ink transition-colors hover:bg-lavender focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-violet-deep focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSendingChat ? (
                    <Loader2
                      aria-hidden
                      className="size-4 animate-spin motion-reduce:animate-none"
                    />
                  ) : (
                    <Send aria-hidden className="size-4" />
                  )}
                </button>
              </div>
            ) : mode === "voice" ? (
              <>
                {playbackUrl ? (
                  <button
                    type="button"
                    onClick={() => void handlePlayReply()}
                    className="mb-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-violet-light/40 bg-violet-light/10 px-4 py-2 text-sm font-semibold text-lavender transition-colors hover:bg-violet-light/15 hover:text-violet-light focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-violet-deep focus-visible:outline-none"
                  >
                    <Volume2 aria-hidden className="size-4" />
                    Play reply
                  </button>
                ) : null}

                {status === "playing" ? (
                  <div className="flex min-h-12 items-center justify-between gap-3 rounded-full border border-violet-light/30 bg-violet-light/10 px-4 py-2">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-lavender">
                      <Volume2
                        aria-hidden
                        className="size-4 text-violet-light"
                      />
                      Speaking...
                    </span>
                    <button
                      type="button"
                      onClick={stopPlayback}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-lavender transition-colors hover:bg-violet-light/15 hover:text-violet-light focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-violet-deep focus-visible:outline-none"
                    >
                      <Square aria-hidden className="size-3.5 fill-current" />
                      Stop
                    </button>
                  </div>
                ) : (
                  <button
                    ref={micButtonRef}
                    type="button"
                    onClick={handleMicClick}
                    disabled={status === "starting" || status === "processing"}
                    aria-label={
                      status === "recording"
                        ? "Stop recording"
                        : "Start recording"
                    }
                    className={cn(
                      "relative flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-semibold text-ink transition duration-200 focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-violet-deep focus-visible:outline-none disabled:cursor-wait disabled:opacity-80",
                      status === "recording"
                        ? "bg-violet-light"
                        : "bg-violet-light hover:bg-lavender",
                    )}
                  >
                    {status === "recording" ? (
                      <>
                        <span
                          aria-hidden
                          className="absolute inset-0 animate-ping rounded-full bg-violet-light/40 motion-reduce:animate-none"
                        />
                        <Mic aria-hidden className="relative size-4" />
                        <span className="relative tabular-nums">
                          {formatDuration(elapsedMs)}
                        </span>
                        <span className="relative">Tap to stop</span>
                      </>
                    ) : status === "starting" ? (
                      <>
                        <Loader2
                          aria-hidden
                          className="size-4 animate-spin motion-reduce:animate-none"
                        />
                        Starting...
                      </>
                    ) : status === "processing" ? (
                      <>
                        <Loader2
                          aria-hidden
                          className="size-4 animate-spin motion-reduce:animate-none"
                        />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Mic aria-hidden className="size-4" />
                        Tap to talk
                      </>
                    )}
                  </button>
                )}
              </>
            ) : null}

            <div className="mt-3">
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-semibold text-lavender underline-offset-4 transition-colors hover:text-violet-light hover:underline focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-violet-deep focus-visible:outline-none"
              >
                Book a Free Call
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            </div>

            <p className="mt-1 text-[11px] leading-relaxed text-lavender/60">
              AI-generated replies. Voice is processed to answer your question.
            </p>
          </div>
        </div>
      ) : null}

      <div className="relative">
        {!isOpen ? (
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-violet-light/25 motion-reduce:animate-none"
          />
        ) : null}
        <button
          ref={triggerRef}
          type="button"
          aria-label="Talk to my AI assistant"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={isOpen ? closePanel : openPanel}
          className="relative flex size-14 items-center justify-center rounded-full bg-violet-light text-ink shadow-[0_0_28px_rgba(139,124,199,0.45)] transition duration-200 hover:scale-[1.04] hover:bg-lavender focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none active:scale-[0.98]"
        >
          {isOpen ? (
            <X aria-hidden className="size-6" />
          ) : (
            <Mic aria-hidden className="size-6" />
          )}
        </button>
      </div>
    </div>
  );
}
