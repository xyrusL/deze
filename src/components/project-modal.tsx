import { ArrowUpRightIcon, CheckIcon, CopyIcon } from "@/components/icons";
import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";

type ModalIconProps = {
  className?: string;
};

type ProjectModalProps = {
  description?: string;
  destinationLabel?: string;
  destinationValue?: string;
  icon?: ComponentType<ModalIconProps>;
  onClose: () => void;
  onContinue?: () => void;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  title?: string;
  typeLabel: string;
};

export function ProjectModal({
  description,
  destinationLabel,
  destinationValue,
  icon: Icon,
  typeLabel,
  onClose,
  onContinue,
  primaryActionLabel = "Continue",
  secondaryActionLabel = "Cancel",
  title,
}: ProjectModalProps) {
  const canCopy = Boolean(destinationValue);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copyResetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  const showCopyFeedback = (status: "copied" | "failed") => {
    if (copyResetTimeoutRef.current) {
      window.clearTimeout(copyResetTimeoutRef.current);
    }

    // Reset first so repeated taps still replay feedback.
    setCopyStatus("idle");

    window.requestAnimationFrame(() => {
      setCopyStatus(status);
      copyResetTimeoutRef.current = window.setTimeout(() => {
        setCopyStatus("idle");
        copyResetTimeoutRef.current = null;
      }, 1800);
    });
  };

  const fallbackCopyToClipboard = (value: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  };

  const handleCopy = async () => {
    if (!destinationValue) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(destinationValue);
        showCopyFeedback("copied");
        return;
      }

      const copied = fallbackCopyToClipboard(destinationValue);
      showCopyFeedback(copied ? "copied" : "failed");
    } catch {
      const copied = fallbackCopyToClipboard(destinationValue);
      showCopyFeedback(copied ? "copied" : "failed");
    }
  };

  return (
    <div
      aria-labelledby="project-modal-title"
      aria-modal="true"
      className="modal-overlay-enter fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/55 p-4 backdrop-blur-md sm:items-center"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="modal-panel-enter relative w-full max-w-xl overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/95 p-6 shadow-[0_32px_80px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-zinc-950/95 sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute -left-14 -top-16 h-40 w-40 rounded-full bg-sky-400/18 blur-3xl dark:bg-sky-400/24" />
        <div className="pointer-events-none absolute left-20 top-2 h-28 w-28 rounded-full bg-white/10 blur-2xl dark:bg-white/6" />
        <div className="relative space-y-5">
          <div className="inline-flex rounded-full border border-sky-200/80 bg-sky-500/10 px-3 py-1 text-xs font-medium tracking-[0.18em] text-sky-700 uppercase dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
            {typeLabel}
          </div>

          <div className="space-y-3">
            {Icon ? (
              <div className="relative overflow-hidden rounded-[1.4rem] border border-white/8 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(14,165,233,0.03)_38%,rgba(255,255,255,0.02))] p-4 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(56,189,248,0.14),rgba(56,189,248,0.04)_40%,rgba(255,255,255,0.02))]">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-[radial-gradient(circle_at_left,rgba(125,211,252,0.18),transparent_72%)]" />
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                <div className="relative flex items-center gap-4">
                  <div className="inline-flex h-15 w-15 shrink-0 items-center justify-center rounded-[1.15rem] border border-white/10 bg-black/10 text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_30px_rgba(14,165,233,0.08)] backdrop-blur-sm dark:bg-white/5">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-medium tracking-[0.22em] text-sky-100/70 uppercase">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/90">
                      Profile setup in progress
                    </p>
                    <p className="mt-1 text-sm text-white/55">
                      This channel has not been published yet.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            {title ? (
              <h3 id="project-modal-title" className="max-w-lg text-2xl font-semibold tracking-tight text-balance">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {description}
              </p>
            ) : null}
          </div>

          {destinationValue ? (
            <div className="relative rounded-2xl border border-zinc-200/80 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
              <span className="mb-1 block text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                {destinationLabel ?? "Destination"}
              </span>
              {canCopy ? (
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-medium tracking-[0.14em] uppercase transition duration-300 ${
                      copyStatus === "copied"
                        ? "translate-y-0 opacity-100 border-emerald-300/40 bg-emerald-500/12 text-emerald-600 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200"
                        : copyStatus === "failed"
                          ? "translate-y-0 opacity-100 border-rose-300/40 bg-rose-500/12 text-rose-600 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-200"
                        : "pointer-events-none translate-y-1 opacity-0"
                    }`}
                  >
                    {copyStatus === "copied" ? "Copied" : "Copy failed"}
                  </span>
                  <button
                    aria-label={
                      copyStatus === "copied"
                        ? "Copy again"
                        : copyStatus === "failed"
                          ? "Retry copy"
                          : "Copy link"
                    }
                    className="hover-lift-soft hover-press-soft inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-white/10 dark:bg-white/8 dark:text-zinc-300 dark:hover:border-sky-300/30 dark:hover:bg-sky-400/10 dark:hover:text-sky-200"
                    onClick={handleCopy}
                    type="button"
                  >
                    {copyStatus === "copied" ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ) : null}
              <span className="block min-w-0 truncate pr-12 font-medium sm:break-all">{destinationValue}</span>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              className="hover-lift-soft hover-press-soft inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-800 hover:border-zinc-400 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10 dark:focus-visible:outline-white"
              onClick={onClose}
              type="button"
            >
              {secondaryActionLabel}
            </button>
            {onContinue ? (
              <button
                className="hover-lift-soft hover-press-soft inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(14,165,233,0.28)] hover:bg-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-slate-950"
                onClick={onContinue}
                type="button"
              >
                {primaryActionLabel}
                <ArrowUpRightIcon />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
