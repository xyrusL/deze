import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/data/portfolio";

type ProjectsSectionProps = {
  title: string;
  eyebrow: string;
  description: string;
  projects: Project[];
  onOpenProject: (project: Project) => void;
};

export function ProjectsSection({
  title,
  eyebrow,
  description,
  projects,
  onOpenProject,
}: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative overflow-hidden rounded-[2rem] border border-white/65 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-8 lg:p-10"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,_transparent,_rgba(56,189,248,0.06))] dark:bg-[linear-gradient(180deg,_transparent,_rgba(56,189,248,0.08))]" />
      <div className="relative flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
            {eyebrow}
          </p>
          <h2 id="projects-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {description}
        </p>
      </div>

      <div className="mobile-projects-scroll relative mt-6 flex max-h-[36rem] snap-y flex-col gap-4 overflow-y-auto pr-1 md:mt-8 md:grid md:auto-rows-fr md:max-h-none md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-4">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.url}
            index={index}
            project={project}
            onOpen={onOpenProject}
          />
        ))}
      </div>
    </section>
  );
}
