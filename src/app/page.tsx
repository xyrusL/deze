"use client";

import { useEffect, useMemo, useState } from "react";
import { HeroSection } from "@/components/hero-section";
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
  label: string;
  typeLabel: string;
  url: string;
};

export default function Home() {
  const [externalTarget, setExternalTarget] = useState<ExternalTarget | null>(null);

  const selectedProjectUrl = useMemo(
    () => externalTarget?.url ?? "",
    [externalTarget],
  );

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
      url: project.url,
    });
  };

  const handleOpenSocial = (link: SocialLink) => {
    setExternalTarget({
      label: `${link.label} / ${link.username}`,
      typeLabel: "External profile",
      url: link.url,
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
          label={externalTarget.label}
          onContinue={handleProjectLaunch}
          onClose={() => setExternalTarget(null)}
          typeLabel={externalTarget.typeLabel}
          url={externalTarget.url}
        />
      ) : null}
    </div>
  );
}
