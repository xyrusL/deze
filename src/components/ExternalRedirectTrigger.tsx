"use client";

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import RedirectConfirmModal from "@/components/RedirectConfirmModal";

interface ExternalRedirectTriggerProps {
  url: string;
  name: string;
  description: string;
  hostname: string;
  faviconUrl: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export default function ExternalRedirectTrigger({
  url,
  name,
  description,
  hostname,
  faviconUrl,
  className,
  style,
  children,
}: ExternalRedirectTriggerProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closeModal = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  const confirmRedirect = useCallback(() => {
    window.open(url, "_blank", "noopener,noreferrer");
    closeModal();
  }, [closeModal, url]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={className}
        style={style}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {children}
      </button>

      <RedirectConfirmModal
        open={open}
        title={name}
        description={description}
        hostname={hostname}
        faviconUrl={faviconUrl}
        onConfirm={confirmRedirect}
        onClose={closeModal}
      />
    </>
  );
}
