"use client";

import Image from "next/image";
import { useState } from "react";
import SmoothScrollLink from "@/components/SmoothScrollLink";
import dezeIcon from "@/app/icon.png";

const links = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="surface-nav mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <SmoothScrollLink href="#home" className="flex items-center gap-3 select-none">
          <span className="brand-mark" aria-hidden="true">
            <Image
              src={dezeIcon}
              alt=""
              className="brand-mark-image"
              sizes="40px"
              priority
            />
          </span>
          <span>
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              Deze network
            </span>
            <span className="font-display text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              deze.me
            </span>
          </span>
        </SmoothScrollLink>

        <ul className="hidden items-center gap-2 sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <SmoothScrollLink
                href={l.href}
                className="nav-link"
              >
                {l.label}
              </SmoothScrollLink>
            </li>
          ))}
        </ul>

        <button
          className="mobile-nav-toggle sm:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={open ? "line open-top" : "line"} />
          <span className={open ? "line open-middle" : "line"} />
          <span className={open ? "line open-bottom" : "line"} />
        </button>
      </div>

      {open && (
        <div className="surface-nav mx-4 mt-3 flex flex-col gap-2 px-3 py-3 sm:hidden">
          {links.map((l) => (
            <SmoothScrollLink
              key={l.href}
              href={l.href}
              onNavigate={() => setOpen(false)}
              className="mobile-nav-link"
            >
              {l.label}
            </SmoothScrollLink>
          ))}
        </div>
      )}
    </nav>
  );
}
