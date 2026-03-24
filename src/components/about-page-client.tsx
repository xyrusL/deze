"use client";

import Image from "next/image";
import type { ComponentType } from "react";
import type { IconType } from "react-icons";
import { PH } from "country-flag-icons/react/3x2";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaTiktok,
} from "react-icons/fa6";
import {
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineLightBulb,
  HiOutlineMapPin,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { PiTShirtLight } from "react-icons/pi";
import { useEffect, useMemo, useState } from "react";
import {
  ProfileDecoration,
  profileDecorationOptions,
  type ProfileDecorationVariant,
} from "@/components/profile-decoration";
import { ProjectModal } from "@/components/project-modal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  aboutTechStack,
  aboutPageContent,
  footerContent,
  navigationItems,
  socialLinks,
  type SocialLink,
} from "@/data/portfolio";

type ExternalTarget = {
  type: "external" | "unavailable";
  label: string;
  typeLabel: string;
  url?: string;
  description?: string;
};

const storyColumns = [
  aboutPageContent.paragraphs.slice(0, 2),
  aboutPageContent.paragraphs.slice(2),
];

const focusPoints = [
  {
    label: "Approach",
    value: "Hybrid workflow",
    detail: "I mix my own direction and decisions with AI support when it helps.",
    icon: HiOutlineSparkles,
  },
  {
    label: "Why I build",
    value: "Purpose first",
    detail: "Every project needs a clear reason to exist before I spend time making it.",
    icon: HiOutlineLightBulb,
  },
  {
    label: "What I make",
    value: "Apps, sites, and tools",
    detail: "My portfolio covers different kinds of projects, each built for a different use.",
    icon: HiOutlineSquares2X2,
  },
] as const;

const stackToneClasses = {
  amber:
    "border-amber-300/70 bg-amber-400/15 text-amber-700 shadow-[0_10px_24px_rgba(245,158,11,0.14)] dark:border-amber-300/20 dark:bg-amber-300/12 dark:text-amber-200",
  blue:
    "border-blue-300/70 bg-blue-500/12 text-blue-700 shadow-[0_10px_24px_rgba(59,130,246,0.14)] dark:border-blue-300/20 dark:bg-blue-300/12 dark:text-blue-200",
  orange:
    "border-orange-300/70 bg-orange-500/12 text-orange-700 shadow-[0_10px_24px_rgba(249,115,22,0.14)] dark:border-orange-300/20 dark:bg-orange-300/12 dark:text-orange-200",
  sky:
    "border-sky-300/70 bg-sky-500/12 text-sky-700 shadow-[0_10px_24px_rgba(14,165,233,0.14)] dark:border-sky-300/20 dark:bg-sky-300/12 dark:text-sky-200",
  zinc:
    "border-zinc-300/70 bg-zinc-900/8 text-zinc-700 shadow-[0_10px_24px_rgba(63,63,70,0.12)] dark:border-zinc-300/20 dark:bg-white/10 dark:text-zinc-100",
  cyan:
    "border-cyan-300/70 bg-cyan-500/12 text-cyan-700 shadow-[0_10px_24px_rgba(6,182,212,0.14)] dark:border-cyan-300/20 dark:bg-cyan-300/12 dark:text-cyan-200",
  teal:
    "border-teal-300/70 bg-teal-500/12 text-teal-700 shadow-[0_10px_24px_rgba(20,184,166,0.14)] dark:border-teal-300/20 dark:bg-teal-300/12 dark:text-teal-200",
  violet:
    "border-violet-300/70 bg-violet-500/12 text-violet-700 shadow-[0_10px_24px_rgba(139,92,246,0.14)] dark:border-violet-300/20 dark:bg-violet-300/12 dark:text-violet-200",
  emerald:
    "border-emerald-300/70 bg-emerald-500/12 text-emerald-700 shadow-[0_10px_24px_rgba(16,185,129,0.14)] dark:border-emerald-300/20 dark:bg-emerald-300/12 dark:text-emerald-200",
} as const;

const profileSummary = {
  name: "Paul",
  role: "Builder, learner, and side project maker",
  location: "San Mateo, Rizal",
  country: "PH",
  description: "I build projects with clear goals, practical decisions, and AI help where it genuinely saves time.",
  timeZone: "Asia/Manila",
} as const;

const avatarDecorationVariant: ProfileDecorationVariant = "catEars";

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  facebook: FaFacebookF,
  tiktok: FaTiktok,
} as const;

const socialToneClasses = {
  github:
    "border-zinc-300/70 bg-zinc-900/6 text-zinc-800 shadow-[0_12px_26px_rgba(24,24,27,0.12)] dark:border-zinc-400/20 dark:bg-white/8 dark:text-zinc-100",
  linkedin:
    "border-sky-300/70 bg-sky-500/12 text-sky-700 shadow-[0_12px_26px_rgba(14,165,233,0.14)] dark:border-sky-300/20 dark:bg-sky-300/12 dark:text-sky-200",
  facebook:
    "border-blue-300/70 bg-blue-500/12 text-blue-700 shadow-[0_12px_26px_rgba(59,130,246,0.14)] dark:border-blue-300/20 dark:bg-blue-300/12 dark:text-blue-200",
  tiktok:
    "border-pink-300/70 bg-pink-500/12 text-pink-700 shadow-[0_12px_26px_rgba(236,72,153,0.14)] dark:border-pink-300/20 dark:bg-pink-300/12 dark:text-pink-200",
} as const;

type MetaIconProps = {
  className?: string;
};

function PhilippinesFlagIcon({ className }: MetaIconProps) {
  return (
    <PH
      aria-hidden="true"
      className={className}
      title="Philippines"
    />
  );
}

type ProfileMetaItem = {
  className?: string;
  icon: ComponentType<MetaIconProps> | IconType;
  label: string;
  value: string;
};

const profileMetaItems: ProfileMetaItem[] = [
  {
    label: "Location",
    value: profileSummary.location,
    icon: HiOutlineMapPin,
    className: "sm:col-span-2",
  },
  {
    label: "Country",
    value: profileSummary.country,
    icon: PhilippinesFlagIcon,
  },
] as const;

export function AboutPageClient() {
  const [externalTarget, setExternalTarget] = useState<ExternalTarget | null>(null);
  const [activeDecoration, setActiveDecoration] =
    useState<ProfileDecorationVariant>(avatarDecorationVariant);
  const [isDecorationPickerOpen, setIsDecorationPickerOpen] = useState(false);
  const [manilaTime, setManilaTime] = useState("");
  const [pulsingDecoration, setPulsingDecoration] =
    useState<ProfileDecorationVariant | null>(null);

  const selectedTargetUrl = useMemo(() => externalTarget?.url ?? "", [externalTarget]);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-PH", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: profileSummary.timeZone,
    });

    const updateTime = () => {
      const parts = formatter.formatToParts(new Date());
      const hour = parts.find((part) => part.type === "hour")?.value ?? "";
      const minute = parts.find((part) => part.type === "minute")?.value ?? "";
      const dayPeriod = (parts.find((part) => part.type === "dayPeriod")?.value ?? "")
        .replace(/\./g, "")
        .toUpperCase();

      setManilaTime(`${hour}:${minute} ${dayPeriod}`.trim());
    };

    updateTime();

    const intervalId = window.setInterval(updateTime, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!externalTarget && !isDecorationPickerOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExternalTarget(null);
        setIsDecorationPickerOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [externalTarget, isDecorationPickerOpen]);

  useEffect(() => {
    if (!pulsingDecoration) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPulsingDecoration(null);
    }, 280);

    return () => window.clearTimeout(timeoutId);
  }, [pulsingDecoration]);

  const handleOpenSocial = (link: SocialLink) => {
    if (link.status !== "active") {
      setExternalTarget({
        label: `${link.label} / ${link.username}`,
        typeLabel: "Social profile",
        type: "unavailable",
      });

      return;
    }

    setExternalTarget({
      label: `${link.label} / ${link.username}`,
      typeLabel: "External profile",
      type: "external",
      url: link.url,
      description:
        "This link opens in a new browser tab, so you can come back here anytime.",
    });
  };

  const handleContinue = () => {
    if (!selectedTargetUrl) {
      return;
    }

    window.open(selectedTargetUrl, "_blank", "noopener,noreferrer");
    setExternalTarget(null);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(244,244,245,0.94)_42%,_rgba(228,228,231,0.9))] text-zinc-950 dark:bg-[radial-gradient(circle_at_top,_rgba(39,39,42,0.96),_rgba(9,9,11,0.98)_55%,_rgba(0,0,0,1))] dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 py-3 sm:px-6 sm:py-6 lg:px-10">
        <SiteHeader items={navigationItems} />

        <main className="flex flex-1 flex-col gap-5 sm:gap-8 lg:gap-10">
          <section className="relative overflow-hidden rounded-[1.75rem] border border-white/65 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:rounded-[2rem] sm:p-8 lg:p-12">
            <div className="pointer-events-none absolute -right-12 top-0 h-40 w-40 rounded-full bg-sky-400/18 blur-3xl dark:bg-sky-400/20" />
            <div className="pointer-events-none absolute left-0 bottom-0 h-32 w-32 rounded-full bg-white/25 blur-2xl dark:bg-white/8" />

            <div className="relative grid items-start gap-5 lg:grid-cols-[minmax(20rem,0.82fr)_minmax(0,1.58fr)] lg:gap-5 xl:grid-cols-[minmax(21rem,0.8fr)_minmax(0,1.6fr)] xl:gap-6">
              <aside className="self-start overflow-hidden rounded-[1.55rem] border border-zinc-200/80 bg-zinc-50/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_18px_45px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-black/20 sm:rounded-[1.85rem] sm:p-5">
                <div className="relative isolate">
                  <div className="pointer-events-none absolute inset-x-8 top-5 h-28 rounded-full bg-sky-400/18 blur-3xl dark:bg-sky-400/18" />
                  <button
                    aria-label="Open avatar decoration picker"
                    className="hover-chip-premium hover-press-soft absolute right-0 top-0 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-200/20 bg-[linear-gradient(180deg,rgba(18,31,46,0.94),rgba(10,18,30,0.98))] text-sky-100 shadow-[0_10px_22px_rgba(2,8,23,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-sky-200/12 sm:right-1 sm:top-1"
                    onClick={() => setIsDecorationPickerOpen(true)}
                    title="Avatar decoration"
                    type="button"
                  >
                    <PiTShirtLight className="h-4 w-4" />
                  </button>
                  <div className="relative mx-auto w-fit">
                    <ProfileDecoration variant={activeDecoration}>
                      <div className="relative mx-auto flex w-fit items-center justify-center rounded-full border border-white/70 bg-white/65 p-2.5 shadow-[0_18px_40px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/8">
                        <div className="relative h-40 w-40 overflow-hidden rounded-full border border-sky-200/80 bg-sky-500/10 ring-4 ring-white/60 dark:border-sky-300/20 dark:ring-white/8 sm:h-48 sm:w-48">
                          <Image
                            alt="About page photo"
                            className="object-cover"
                            fill
                            priority
                            sizes="(max-width: 1024px) 52vw, 12rem"
                            src="/images/about-photo.png"
                          />
                        </div>
                      </div>
                    </ProfileDecoration>

                  </div>
                </div>

                <div className="mt-4.5 rounded-[1.3rem] border border-white/70 bg-[linear-gradient(145deg,rgba(14,165,233,0.12),rgba(255,255,255,0.78))] p-4 dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(14,165,233,0.14),rgba(255,255,255,0.04))]">
                  <p className="text-[0.7rem] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                    Profile
                  </p>
                  <h2 className="mt-1.5 text-[1.25rem] font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {profileSummary.name}
                  </h2>

                  <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
                    {profileMetaItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className={`inline-flex w-full items-center gap-2 rounded-full border border-sky-200/80 bg-white/75 px-3.5 py-2 text-sm font-medium text-zinc-700 dark:border-sky-300/20 dark:bg-white/8 dark:text-zinc-200 ${item.className ?? ""}`}
                        >
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-200/80 bg-sky-500/10 text-sky-700 dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[0.63rem] leading-4 tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
                              {item.label}
                            </p>
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                          {item.value}
                        </p>
                      </div>
                        </div>
                      );
                    })}

                    <div className="inline-flex w-full items-center gap-2 rounded-full border border-sky-200/80 bg-white/75 px-3.5 py-2 text-sm font-medium text-zinc-700 dark:border-sky-300/20 dark:bg-white/8 dark:text-zinc-200">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-200/80 bg-sky-500/10 text-sky-700 dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
                        <HiOutlineClock className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[0.63rem] leading-4 tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
                          Time
                        </p>
                        <p className="whitespace-nowrap text-sm font-medium text-zinc-800 dark:text-zinc-100">
                          {manilaTime || "Loading..."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[0.7rem] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                      Social
                    </p>
                    <div className="mt-3 grid grid-cols-4 justify-items-center gap-3">
                      {socialLinks.map((link) => {
                        const Icon = socialIcons[link.platform];
                        const toneClassName = socialToneClasses[link.platform];

                        return (
                          <button
                            key={link.platform}
                            aria-label={`${link.label} ${link.username}`}
                            className={`social-chip-premium hover-press-soft group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${toneClassName} ${link.status !== "active" ? "opacity-60" : ""}`}
                            data-platform={link.platform}
                            onClick={() => handleOpenSocial(link)}
                            title={`${link.label}: ${link.username}`}
                            type="button"
                          >
                            <Icon className="hover-icon-drift h-5 w-5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="space-y-5 sm:space-y-6 lg:py-2 lg:pl-0 xl:pl-2">
                <span className="inline-flex w-fit rounded-full border border-sky-200/80 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-700 dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
                  {aboutPageContent.eyebrow}
                </span>
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="max-w-4xl text-[clamp(2.25rem,10vw,4.6rem)] leading-[0.95] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    {aboutPageContent.title}
                  </h1>
                  <p className="max-w-4xl text-[0.98rem] leading-7 text-zinc-600 sm:text-lg dark:text-zinc-300">
                    {aboutPageContent.intro}
                  </p>
                </div>

                <div className="w-full max-w-4xl rounded-[1.35rem] border border-sky-200/70 bg-sky-500/8 p-4 shadow-[0_16px_40px_rgba(14,165,233,0.08)] dark:border-sky-300/20 dark:bg-sky-400/10 sm:rounded-[1.5rem] sm:p-5">
                  <p className="text-xs font-medium tracking-[0.18em] text-sky-700 uppercase dark:text-sky-200">
                    Profile details
                  </p>
                  <div className="mt-3 grid gap-3 sm:mt-4 lg:grid-cols-2">
                    <div className="rounded-[1.15rem] border border-white/60 bg-white/70 p-4 dark:border-white/10 dark:bg-white/6 sm:rounded-[1.25rem]">
                      <p className="text-[0.7rem] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                        Role
                      </p>
                      <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">
                        {profileSummary.role}
                      </p>
                    </div>

                    <div className="rounded-[1.15rem] border border-white/60 bg-white/70 p-4 dark:border-white/10 dark:bg-white/6 sm:rounded-[1.25rem]">
                      <p className="text-[0.7rem] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                        How I build
                      </p>
                      <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                        {profileSummary.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[1.6rem] border border-white/65 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:rounded-[2rem] sm:p-8">
            <div className="pointer-events-none absolute left-0 top-0 h-28 w-28 rounded-full bg-sky-400/12 blur-3xl dark:bg-sky-400/14" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-200/80 bg-sky-500/10 text-sky-700 shadow-[0_8px_20px_rgba(14,165,233,0.16)] dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
                  <HiOutlineUserCircle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[0.7rem] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                    Snapshot
                  </p>
                  <h2 className="text-lg font-semibold tracking-tight">Quick snapshot</h2>
                </div>
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                {focusPoints.map((point) => {
                  const Icon = point.icon;

                  return (
                    <div
                      key={point.label}
                      className="hover-card-premium hover-shadow-premium hover-lift-soft rounded-[1.15rem] border border-white/70 bg-white/75 p-3.5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6 sm:rounded-[1.35rem] sm:p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-200/80 bg-sky-500/10 text-sky-700 dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="space-y-1">
                          <p className="text-[0.7rem] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                            {point.label}
                          </p>
                          <p className="text-[1.02rem] font-semibold text-zinc-950 dark:text-white">
                            {point.value}
                          </p>
                          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                            {point.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            {storyColumns.map((column, index) => (
              <article
                key={`story-column-${index + 1}`}
                className="relative overflow-hidden rounded-[1.6rem] border border-white/65 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:rounded-[2rem] sm:p-8"
              >
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,_transparent,_rgba(56,189,248,0.07))] dark:bg-[linear-gradient(180deg,_transparent,_rgba(56,189,248,0.08))]" />
                <div className="relative space-y-3 sm:space-y-4">
                  <p className="inline-flex w-fit rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-[0.72rem] font-bold tracking-[0.24em] text-sky-700 uppercase shadow-[0_8px_20px_rgba(14,165,233,0.08)] dark:border-sky-300/18 dark:bg-sky-400/12 dark:text-sky-200">
                    {index === 0 ? "How I work" : "What keeps it real"}
                  </p>
                  {column.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm leading-7 text-zinc-600 sm:text-[0.98rem] dark:text-zinc-300"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="relative overflow-hidden rounded-[1.6rem] border border-white/65 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:rounded-[2rem] sm:p-8">
            <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-full bg-sky-400/12 blur-3xl dark:bg-sky-400/14" />
            <div className="relative">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <p className="inline-flex w-fit rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-[0.72rem] font-bold tracking-[0.24em] text-sky-700 uppercase shadow-[0_8px_20px_rgba(14,165,233,0.08)] dark:border-sky-300/18 dark:bg-sky-400/12 dark:text-sky-200">
                    Tech stack
                  </p>
                  <h2 className="text-[1.45rem] font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-[1.65rem]">
                    The tools I currently use the most
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  These are the main languages, frameworks, and backend tools I
                  usually reach for when building side projects.
                </p>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {aboutTechStack.map((group) => (
                  <article
                    key={group.category}
                    className="hover-card-premium hover-shadow-premium hover-lift-soft rounded-[1.35rem] border border-white/70 bg-white/75 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6 sm:p-5"
                  >
                    <p className="text-[0.72rem] font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
                      {group.category}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {group.items.map((item) => (
                        <span
                          key={item.label}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium ${stackToneClasses[item.tone]}`}
                        >
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 rounded-full bg-current opacity-75"
                          />
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>

        <SiteFooter
          copyright={footerContent.copyright}
          onOpenLink={handleOpenSocial}
          socialLinks={socialLinks}
        />
      </div>

      {externalTarget ? (
        <ProjectModal
          description={externalTarget.description}
          destinationLabel="Destination"
          destinationValue={selectedTargetUrl.replace(/^https?:\/\//, "")}
          icon={
            externalTarget.type === "unavailable" ? HiOutlineExclamationTriangle : undefined
          }
          onContinue={
            externalTarget.type === "unavailable" ? undefined : handleContinue
          }
          onClose={() => setExternalTarget(null)}
          primaryActionLabel="Open link"
          secondaryActionLabel={
            externalTarget.type === "unavailable" ? "Close" : "Cancel"
          }
          title={
            externalTarget.type === "unavailable"
              ? undefined
              : `Open ${externalTarget.label} in a new tab?`
          }
          typeLabel={externalTarget.typeLabel}
        />
      ) : null}

      {isDecorationPickerOpen ? (
        <div
          aria-labelledby="decoration-picker-title"
          aria-modal="true"
          className="modal-overlay-enter fixed inset-0 z-50 flex items-center justify-center bg-[rgba(5,10,15,0.72)] p-3 backdrop-blur-xl sm:p-5"
          role="dialog"
          onClick={() => setIsDecorationPickerOpen(false)}
        >
          <div
            className="modal-panel-enter decoration-picker relative flex h-[min(46rem,88vh)] w-full max-w-[52rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.14),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(6,12,20,0.98))] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute -left-20 -top-24 h-52 w-52 rounded-full bg-teal-300/12 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 top-10 h-36 w-36 rounded-full bg-rose-300/10 blur-3xl" />
            <div className="relative flex h-full flex-col">
              <div className="inline-flex w-fit rounded-full border border-teal-300/18 bg-teal-300/10 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.24em] text-teal-100 uppercase">
                Avatar frame
              </div>
              <h3
                id="decoration-picker-title"
                className="mt-4 text-[1.75rem] font-semibold tracking-[-0.03em] text-white sm:text-[2rem]"
              >
                Profile Decoration
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Pick a decoration for your profile frame. Each style stays live in preview, and only one can be current at a time.
              </p>

              <div className="decoration-picker-scroll mt-5 grid flex-1 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                {profileDecorationOptions
                  .filter((option) => option.value !== "none")
                  .map((option) => (
                    <button
                      aria-pressed={activeDecoration === option.value}
                      key={option.value}
                      className={`decoration-picker-row group flex min-h-[12.6rem] w-full flex-col overflow-hidden rounded-[1.2rem] border p-3 text-left transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out sm:p-3.5 ${
                        activeDecoration === option.value
                          ? "border-teal-300/65 bg-[rgba(17,94,89,0.32)] shadow-[0_18px_40px_rgba(13,148,136,0.16)]"
                          : "border-white/10 bg-[rgba(255,255,255,0.04)]"
                      }`}
                      onClick={() => {
                        if (activeDecoration === option.value) {
                          return;
                        }

                        setActiveDecoration(option.value);
                        setPulsingDecoration(option.value);
                      }}
                      type="button"
                    >
                      <div className="decoration-picker-card__media">
                        <ProfileDecoration
                          className={`decoration-picker-avatar ${
                            activeDecoration === option.value
                              ? "decoration-picker-avatar--selected"
                              : ""
                          } ${
                            pulsingDecoration === option.value
                              ? "decoration-picker-avatar--pulse"
                              : ""
                          }`}
                          variant={option.value}
                        >
                          <div className="relative flex w-fit items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-1.5 shadow-[0_12px_30px_rgba(2,8,23,0.45)]">
                            <div className="relative h-[6.25rem] w-[6.25rem] overflow-hidden rounded-full border border-teal-200/20 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.24),rgba(15,23,42,0.86))]">
                              <Image
                                alt={`${option.label} decoration preview`}
                                className="object-cover"
                                fill
                                sizes="100px"
                                src="/images/about-photo.png"
                              />
                            </div>
                          </div>
                        </ProfileDecoration>
                      </div>
                      <div className="mt-auto flex w-full items-center justify-between gap-3 pt-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-[1rem] font-semibold tracking-[-0.03em] text-white">
                            {option.label}
                          </p>
                        </div>
                        {activeDecoration === option.value ? (
                          <span className="inline-flex shrink-0 rounded-full border border-teal-300/65 bg-teal-300/12 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.18em] text-teal-100 uppercase">
                            Current
                          </span>
                        ) : null}
                      </div>
                    </button>
                  ))}
              </div>

              <div className="mt-5 flex justify-end border-t border-white/10 pt-4">
                <button
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-sm font-medium text-white transition-colors duration-200 hover:border-white/24 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
                  onClick={() => setIsDecorationPickerOpen(false)}
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
