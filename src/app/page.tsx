"use client";

import { useEffect, useMemo, useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { BrokenComputerIcon } from "@/components/icons";
import { ProjectModal } from "@/components/project-modal";
import { ProjectsSection } from "@/components/projects-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  footerContent,
  heroContent,
  navigationItems,
  overviewParagraphs,
  projectSectionContent,
  projects,
  socialLinks,
  type SocialLink,
  type Project,
} from "@/data/portfolio";

type ExternalTarget = {
  type: "external" | "unavailable";
  label: string;
  typeLabel: string;
  url?: string;
  description: string;
};

export default function Home() {
  const [externalTarget, setExternalTarget] = useState<ExternalTarget | null>(null);

  const selectedProjectUrl = useMemo(
    () => externalTarget?.type === "external" ? externalTarget.url ?? "" : "",
    [externalTarget],
  );

  useEffect(() => {
    const threshold = 160;
    let devtoolsOpen = false;

    const showPeekabooMessage = () => {
      console.log(
        "%cPeekaboo... curious minds always end up here.",
        [
          "color: #e2e8f0",
          "background: linear-gradient(135deg, #0f172a, #1e293b)",
          "border: 1px solid rgba(56, 189, 248, 0.45)",
          "border-radius: 12px",
          "padding: 12px 16px",
          "font-size: 14px",
          "font-family: monospace",
          "font-weight: 700",
        ].join(";"),
      );
    };

    const detectDevtools = () => {
      const widthGap = window.outerWidth - window.innerWidth;
      const heightGap = window.outerHeight - window.innerHeight;
      const isOpen = widthGap > threshold || heightGap > threshold;

      if (isOpen && !devtoolsOpen) {
        devtoolsOpen = true;
        showPeekabooMessage();
        return;
      }

      if (!isOpen && devtoolsOpen) {
        devtoolsOpen = false;
      }
    };

    detectDevtools();
    window.addEventListener("resize", detectDevtools);

    return () => {
      window.removeEventListener("resize", detectDevtools);
    };
  }, []);

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

  const handleOpenProject = (project: Project) => {
    setExternalTarget({
      label: project.shortName,
      typeLabel: "Project link",
      type: "external",
      url: project.url,
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
        description: "Check back later while this profile is being prepared.",
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

  const handleProjectLaunch = () => {
    if (!selectedProjectUrl) {
      return;
    }

    window.open(selectedProjectUrl, "_blank", "noopener,noreferrer");
    setExternalTarget(null);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(244,244,245,0.94)_42%,_rgba(228,228,231,0.9))] text-zinc-950 dark:bg-[radial-gradient(circle_at_top,_rgba(39,39,42,0.96),_rgba(9,9,11,0.98)_55%,_rgba(0,0,0,1))] dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 py-3 sm:px-6 sm:py-6 lg:px-10">
        <SiteHeader items={navigationItems} />

        <main className="flex flex-1 flex-col gap-6 sm:gap-10">
          <HeroSection
            description={heroContent.description}
            eyebrow={heroContent.eyebrow}
            overviewParagraphs={overviewParagraphs}
            title={heroContent.title}
          />

          <ProjectsSection
            description={projectSectionContent.description}
            eyebrow={projectSectionContent.eyebrow}
            onOpenProject={handleOpenProject}
            projects={projects}
            title={projectSectionContent.title}
          />
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
          destinationLabel={externalTarget.type === "external" ? "Destination" : undefined}
          destinationValue={externalTarget.type === "external" ? selectedProjectUrl.replace(/^https?:\/\//, "") : undefined}
          icon={externalTarget.type === "unavailable" ? BrokenComputerIcon : undefined}
          onContinue={externalTarget.type === "external" ? handleProjectLaunch : undefined}
          onClose={() => setExternalTarget(null)}
          primaryActionLabel={externalTarget.type === "external" ? "Open link" : undefined}
          secondaryActionLabel={externalTarget.type === "external" ? "Cancel" : "Close"}
          title={
            externalTarget.type === "external"
              ? `Open ${externalTarget.label} in a new tab?`
              : `${externalTarget.label} is unavailable right now`
          }
          typeLabel={externalTarget.typeLabel}
        />
      ) : null}
    </div>
  );
}
