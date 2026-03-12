"use client";

import { useEffect } from "react";
import { scrollToHash } from "@/components/SmoothScrollLink";

export default function HashScrollManager() {
  useEffect(() => {
    const alignCurrentHash = (instant = false) => {
      if (!window.location.hash) {
        return;
      }

      scrollToHash(window.location.hash, { instant });
    };

    const handleHashChange = () => alignCurrentHash();

    window.addEventListener("hashchange", handleHashChange);
    window.requestAnimationFrame(() => alignCurrentHash(true));

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return null;
}
