"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BrokenComputerIcon,
  GitHubIcon,
  MailIcon,
  OrbitIcon,
  ProfileIcon,
  SparkIcon,
} from "@/components/icons";
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
  type: "external" | "mailto" | "unavailable";
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
    icon: SparkIcon,
  },
  {
    label: "Why I build",
    value: "Purpose first",
    detail: "Every project needs a clear reason to exist before I spend time making it.",
    icon: OrbitIcon,
  },
  {
    label: "What I make",
    value: "Apps, sites, and tools",
    detail: "My portfolio covers different kinds of projects, each built for a different use.",
    icon: ProfileIcon,
  },
] as const;

const githubLink = socialLinks.find(
  (link) => link.platform === "github" && link.status === "active",
);

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

export function AboutPageClient() {
  const [externalTarget, setExternalTarget] = useState<ExternalTarget | null>(null);

  const selectedTargetUrl = useMemo(() => externalTarget?.url ?? "", [externalTarget]);

  useEffect(() => {
    if (!externalTarget) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExternalTarget(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [externalTarget]);

  const handleOpenEmail = () => {
    setExternalTarget({
      label: aboutPageContent.email,
      typeLabel: "Email contact",
      type: "mailto",
      url: `mailto:${aboutPageContent.email}`,
      description:
        "This opens your default email app so you can send a message to Paul.",
    });
  };

  const handleOpenGitHub = () => {
    if (!githubLink) {
      return;
    }

    setExternalTarget({
      label: `GitHub / ${githubLink.username}`,
      typeLabel: "External profile",
      type: "external",
      url: githubLink.url,
      description:
        "This link opens in a new browser tab, so you can come back here anytime.",
    });
  };

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

    if (externalTarget?.type === "mailto") {
      window.location.href = selectedTargetUrl;
      setExternalTarget(null);
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

            <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.8fr)] lg:gap-6">
              <div className="space-y-5 sm:space-y-6">
                <span className="inline-flex w-fit rounded-full border border-sky-200/80 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-700 dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
                  {aboutPageContent.eyebrow}
                </span>
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="max-w-3xl text-[clamp(2.25rem,10vw,4.6rem)] leading-[0.95] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    {aboutPageContent.title}
                  </h1>
                  <p className="max-w-3xl text-[0.98rem] leading-7 text-zinc-600 sm:text-lg dark:text-zinc-300">
                    {aboutPageContent.intro}
                  </p>
                </div>

                <div className="w-full max-w-2xl rounded-[1.35rem] border border-sky-200/70 bg-sky-500/8 p-3.5 shadow-[0_16px_40px_rgba(14,165,233,0.08)] dark:border-sky-300/20 dark:bg-sky-400/10 sm:rounded-[1.5rem] sm:p-4">
                  <p className="text-xs font-medium tracking-[0.18em] text-sky-700 uppercase dark:text-sky-200">
                    Contact
                  </p>
                  <div className="mt-3 grid gap-3 min-[560px]:grid-cols-2 sm:mt-4">
                    <button
                      className="hover-chip-premium hover-press-soft flex w-full items-center gap-3 rounded-[1.1rem] border border-white/60 bg-white/70 p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-white/10 dark:bg-white/6 sm:rounded-[1.2rem]"
                      onClick={handleOpenEmail}
                      type="button"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sky-200/80 bg-white/75 text-sky-700 dark:border-sky-300/20 dark:bg-white/10 dark:text-sky-200">
                        <MailIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[0.7rem] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                          Email
                        </p>
                        <span className="block max-w-full overflow-hidden text-sm leading-6 font-medium text-zinc-900 [overflow-wrap:anywhere] dark:text-white">
                          {aboutPageContent.email}
                        </span>
                      </div>
                    </button>

                    {githubLink ? (
                      <button
                        className="hover-chip-premium hover-press-soft flex w-full items-center gap-3 rounded-[1.1rem] border border-white/60 bg-white/70 p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-white/10 dark:bg-white/6 sm:rounded-[1.2rem]"
                        onClick={handleOpenGitHub}
                        type="button"
                      >
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sky-200/80 bg-white/75 text-sky-700 dark:border-sky-300/20 dark:bg-white/10 dark:text-sky-200">
                          <GitHubIcon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[0.7rem] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                            GitHub
                          </p>
                          <span className="block max-w-full overflow-hidden text-base font-medium text-zinc-900 dark:text-white">
                            {githubLink.username}
                          </span>
                        </div>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <aside className="rounded-[1.35rem] border border-zinc-200/80 bg-zinc-50/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:border-white/10 dark:bg-black/20 sm:rounded-[1.75rem] sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-200/80 bg-sky-500/10 text-sky-700 shadow-[0_8px_20px_rgba(14,165,233,0.16)] dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
                    <ProfileIcon className="h-5 w-5" />
                  </span>
                  <h2 className="text-lg font-semibold tracking-tight">Quick snapshot</h2>
                </div>

                <div className="mt-4 space-y-3 sm:mt-5">
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
              </aside>
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
                  <p className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
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
                  <p className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
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
          destinationLabel={
            externalTarget.type === "mailto" ? "Email address" : "Destination"
          }
          destinationValue={
            externalTarget.type === "mailto"
              ? aboutPageContent.email
              : selectedTargetUrl.replace(/^https?:\/\//, "")
          }
          icon={externalTarget.type === "unavailable" ? BrokenComputerIcon : undefined}
          onContinue={
            externalTarget.type === "unavailable" ? undefined : handleContinue
          }
          onClose={() => setExternalTarget(null)}
          primaryActionLabel={
            externalTarget.type === "mailto" ? "Open email app" : "Open link"
          }
          secondaryActionLabel={
            externalTarget.type === "unavailable" ? "Close" : "Cancel"
          }
          title={
            externalTarget.type === "unavailable"
              ? undefined
              : externalTarget.type === "mailto"
                ? `Open your email app for ${externalTarget.label}?`
                : `Open ${externalTarget.label} in a new tab?`
          }
          typeLabel={externalTarget.typeLabel}
        />
      ) : null}
    </div>
  );
}
