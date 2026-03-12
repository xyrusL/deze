"use client";

import Image from "next/image";
import { useState } from "react";

interface FaviconBadgeProps {
  name: string;
  faviconUrl: string;
}

function getInitials(name: string): string {
  const initials = name
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || name.slice(0, 2).toUpperCase();
}

export default function FaviconBadge({
  name,
  faviconUrl,
}: FaviconBadgeProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="project-icon-frame">
      <span className="project-icon-fallback">{getInitials(name)}</span>
      {!hasError ? (
        <Image
          src={faviconUrl}
          alt=""
          className="project-icon-image"
          width={28}
          height={28}
          unoptimized
          onError={() => setHasError(true)}
        />
      ) : null}
    </div>
  );
}
