"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BrokenComputerIcon,
  GitHubIcon,
  MailIcon,
  OrbitIcon,
  SparkIcon,
} from "@/components/icons";
import { ProjectModal } from "@/components/project-modal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  aboutPageContent,
  contactPageContent,
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

const contactMoments = [
  {
    label: "Collaborate",
    value: "Have an idea you want to build together?",
    detail:
      "If you think we could make something useful together, feel free to reach out.",
    icon: SparkIcon,
  },
  {
    label: "Say hello",
    value: "Questions, feedback, or a simple message are welcome.",
    detail:
      "Even a small note is enough if one of the projects here caught your attention.",
    icon: OrbitIcon,
  },
] as const;

const githubLink = socialLinks.find(
  (link) => link.platform === "github" && link.status === "active",
);

export function ContactPageClient() {
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
    if (link.status === "unavailable") {
      setExternalTarget({
        label: link.label,
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
            <div className="pointer-events-none absolute -right-14 top-0 h-40 w-40 rounded-full bg-sky-400/18 blur-3xl dark:bg-sky-400/20" />
            <div className="pointer-events-none absolute left-0 bottom-0 h-32 w-32 rounded-full bg-white/25 blur-2xl dark:bg-white/8" />

            <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.82fr)] lg:gap-6">
              <div className="space-y-5 sm:space-y-6">
                <span className="inline-flex w-fit rounded-full border border-sky-200/80 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-700 dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
                  {contactPageContent.eyebrow}
                </span>

                <div className="space-y-3 sm:space-y-4">
                  <h1 className="max-w-3xl text-[clamp(2.25rem,10vw,4.6rem)] leading-[0.95] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    Let&apos;s connect{" "}
                    <span
                      aria-hidden="true"
                      className="wave-emoji inline-flex align-[0.04em]"
                    >
                      {"\u{1F44B}"}
                    </span>
                  </h1>

                  {contactPageContent.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="max-w-3xl text-[0.98rem] leading-7 text-zinc-600 sm:text-lg dark:text-zinc-300"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-700 shadow-[0_10px_24px_rgba(14,165,233,0.08)] dark:border-sky-300/20 dark:bg-white/8 dark:text-zinc-100">
                  <span aria-hidden="true" className="text-base">
                    {"\u{2728}"}
                  </span>
                  <span>{contactPageContent.thankYou}</span>
                </div>
              </div>

              <aside className="rounded-[1.35rem] border border-sky-200/70 bg-sky-500/8 p-4 shadow-[0_16px_40px_rgba(14,165,233,0.08)] dark:border-sky-300/20 dark:bg-sky-400/10 sm:rounded-[1.75rem] sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sky-200/80 bg-white/75 text-sky-700 shadow-[0_8px_20px_rgba(14,165,233,0.12)] dark:border-sky-300/20 dark:bg-white/10 dark:text-sky-200">
                    <MailIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[0.7rem] font-medium tracking-[0.18em] text-sky-700 uppercase dark:text-sky-200">
                      Contact info
                    </p>
                    <h2 className="text-lg font-semibold tracking-tight">Reach me here</h2>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
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

                <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {contactPageContent.contactNote}
                </p>

                <div className="mt-5 rounded-[1.2rem] border border-white/65 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] dark:border-white/10 dark:bg-black/20">
                  <p className="text-[0.7rem] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                    {contactPageContent.responseLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
                    {contactPageContent.responseValue}
                  </p>
                </div>
              </aside>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            {contactMoments.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.label}
                  className="relative overflow-hidden rounded-[1.6rem] border border-white/65 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:rounded-[2rem] sm:p-8"
                >
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,_transparent,_rgba(56,189,248,0.07))] dark:bg-[linear-gradient(180deg,_transparent,_rgba(56,189,248,0.08))]" />

                  <div className="relative flex items-start gap-4 sm:gap-5">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sky-200/80 bg-sky-500/10 text-sky-700 shadow-[0_10px_24px_rgba(14,165,233,0.12)] dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
                      <Icon className="h-5 w-5" />
                    </span>

                    <div className="space-y-2 pt-0.5">
                      <p className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
                        {item.label}
                      </p>
                      <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                        {item.value}
                      </h2>
                      <p className="text-sm leading-7 text-zinc-600 sm:text-[0.98rem] dark:text-zinc-300">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
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
