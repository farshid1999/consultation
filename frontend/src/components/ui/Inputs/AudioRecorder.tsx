"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiMic, FiSquare, FiTrash2 } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/jalaali";
import FieldWrapper, { describedBy } from "./FieldWrapper";

export interface AudioRecorderProps {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
  className?: string;
  /** The recorded clip, or null if nothing has been recorded yet. */
  value: Blob | null;
  onChange: (blob: Blob | null) => void;
  disabled?: boolean;
  /** Stops recording automatically once this many seconds are reached. */
  maxDurationSeconds?: number;
}

const CANDIDATE_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
];

function pickSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return CANDIDATE_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

function formatTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return toPersianDigits(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
}

type RecorderState = "idle" | "requesting" | "recording" | "recorded";

/**
 * A voice-note input: tap to request microphone access and start
 * recording, tap again to stop, then review the clip with a native audio
 * player before keeping or discarding it. Emits a plain `Blob` via
 * `onChange`, ready to append to a `FormData` upload or convert to a
 * `File` (`new File([blob], "voice-note.webm", { type: blob.type })`)
 * before submitting.
 *
 * Requires a secure context (https, or localhost in dev) for
 * `getUserMedia` — this is a browser platform requirement, not something
 * this component can work around.
 */
export default function AudioRecorder({
  id,
  label,
  error,
  helperText,
  required,
  wrapperClassName,
  className,
  value,
  onChange,
  disabled,
  maxDurationSeconds = 120,
}: AudioRecorderProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  const [state, setState] = useState<RecorderState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setAudioUrl(null);
    return undefined;
  }, [value]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startRecording = async () => {
    setPermissionError(null);
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType ?? "audio/webm" });
        onChange(blob);
        setState("recorded");
        stopTimer();
        stopStream();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setState("recording");
      setElapsed(0);

      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= maxDurationSeconds) {
            recorder.stop();
          }
          return next;
        });
      }, 1000);
    } catch {
      setPermissionError("دسترسی به میکروفون امکان‌پذیر نشد. لطفاً مجوز آن را در مرورگر بررسی کنید.");
      setState("idle");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const discardRecording = () => {
    onChange(null);
    setState("idle");
    setElapsed(0);
  };

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      required={required}
      error={error ?? permissionError ?? undefined}
      helperText={helperText}
      className={wrapperClassName}
    >
      <div
        className={cn(
          "flex items-center gap-4 rounded-2xl border border-cream/15 bg-deep/60 px-4 py-3.5",
          (error || permissionError) && "border-red-400/50",
          disabled && "pointer-events-none opacity-50",
          className
        )}
      >
        {state === "idle" && (
          <>
            <button
              type="button"
              id={fieldId}
              onClick={startRecording}
              aria-describedby={describedBy(fieldId, error ?? permissionError ?? undefined, helperText)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors hover:bg-gold/20"
              aria-label="شروع ضبط صدا"
            >
              <FiMic aria-hidden="true" />
            </button>
            <p className="text-sm text-cream/45">برای ضبط پیام صوتی ضربه بزنید</p>
          </>
        )}

        {state === "requesting" && (
          <p className="text-sm text-cream/45">در حال درخواست دسترسی به میکروفون...</p>
        )}

        {state === "recording" && (
          <>
            <button
              type="button"
              onClick={stopRecording}
              aria-label="توقف ضبط"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-400/15 text-red-400 transition-colors hover:bg-red-400/25"
            >
              <FiSquare aria-hidden="true" />
            </button>

            <div className="flex flex-1 items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-400" />
              </span>
              <div className="flex items-end gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span
                    key={i}
                    className="w-0.5 rounded-full bg-gold/70"
                    animate={{ height: ["6px", "16px", "6px"] }}
                    transition={{ duration: 0.8 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
              <span className="text-sm tabular-nums text-cream/70">{formatTimer(elapsed)}</span>
            </div>
          </>
        )}

        {state === "recorded" && audioUrl && (
          <>
            <audio src={audioUrl} controls className="h-10 flex-1 [color-scheme:dark]" />
            <button
              type="button"
              onClick={discardRecording}
              aria-label="حذف و ضبط دوباره"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cream/40 transition-colors hover:bg-red-400/10 hover:text-red-400"
            >
              <FiTrash2 aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </FieldWrapper>
  );
}
