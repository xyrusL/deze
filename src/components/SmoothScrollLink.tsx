"use client";

import type { MouseEvent, ReactNode } from "react";

const NAVIGATION_OFFSET = 104;
const MIN_DURATION_MS = 420;
const MAX_DURATION_MS = 760;

let activeScrollAnimation = 0;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getTargetTop(element: HTMLElement) {
  const targetTop = window.scrollY + element.getBoundingClientRect().top - NAVIGATION_OFFSET;
  return Math.max(0, targetTop);
}

function stopActiveAnimation() {
  if (activeScrollAnimation) {
    window.cancelAnimationFrame(activeScrollAnimation);
    activeScrollAnimation = 0;
  }
}

function animateScroll(targetTop: number) {
  stopActiveAnimation();

  const startTop = window.scrollY;
  const distance = targetTop - startTop;

  if (Math.abs(distance) < 1) {
    window.scrollTo(0, targetTop);
    return;
  }

  const duration = Math.min(
    MAX_DURATION_MS,
    Math.max(MIN_DURATION_MS, Math.abs(distance) * 0.45)
  );
  const startedAt = window.performance.now();

  const step = (now: number) => {
    const elapsed = now - startedAt;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, startTop + distance * eased);

    if (progress < 1) {
      activeScrollAnimation = window.requestAnimationFrame(step);
      return;
    }

    activeScrollAnimation = 0;
  };

  activeScrollAnimation = window.requestAnimationFrame(step);
}

type ScrollToHashOptions = {
  updateHistory?: boolean;
  instant?: boolean;
};

export function scrollToHash(hash: string, options: ScrollToHashOptions = {}) {
  if (!hash.startsWith("#")) {
    return false;
  }

  const target = document.querySelector<HTMLElement>(hash);

  if (!target) {
    return false;
  }

  const targetTop = getTargetTop(target);
  const shouldScrollInstantly = options.instant || prefersReducedMotion();

  if (options.updateHistory) {
    window.history.pushState(null, "", hash);
  }

  if (shouldScrollInstantly) {
    stopActiveAnimation();
    window.scrollTo({ top: targetTop, behavior: "auto" });
    return true;
  }

  animateScroll(targetTop);
  return true;
}

type SmoothScrollLinkProps = {
  href: `#${string}`;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
};

export default function SmoothScrollLink({
  href,
  className,
  children,
  onNavigate,
}: SmoothScrollLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const didScroll = scrollToHash(href, { updateHistory: true });

    if (!didScroll) {
      return;
    }

    event.preventDefault();
    onNavigate?.();
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
