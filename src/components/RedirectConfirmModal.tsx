"use client";

import { useEffect, useId, useRef } from "react";
import FaviconBadge from "@/components/FaviconBadge";

interface RedirectConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  hostname: string;
  faviconUrl: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function RedirectConfirmModal({
  open,
  title,
  description,
  hostname,
  faviconUrl,
  confirmLabel = "Continue in new tab",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
}: RedirectConfirmModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      confirmButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="redirect-modal-backdrop"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="redirect-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="redirect-modal-close"
          onClick={onClose}
          aria-label="Close redirect dialog"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.7}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <p className="redirect-modal-kicker">Leaving deze.me</p>
        <h3 id={titleId} className="redirect-modal-title">
          Open the selected project?
        </h3>
        <p id={descriptionId} className="redirect-modal-copy">
          You selected <span className="redirect-modal-emphasis">{title}</span>. It
          will open in a new tab so this landing page stays here.
        </p>

        <div className="redirect-modal-preview">
          <FaviconBadge name={title} faviconUrl={faviconUrl} />
          <div className="min-w-0">
            <p className="redirect-modal-project-title">{title}</p>
            <p className="redirect-modal-hostname">{hostname}</p>
            <p className="redirect-modal-project-description">{description}</p>
          </div>
        </div>

        <div className="redirect-modal-actions">
          <button
            ref={confirmButtonRef}
            type="button"
            className="redirect-modal-confirm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            className="redirect-modal-cancel"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
