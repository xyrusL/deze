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
      className="rounded-[2rem] border border-white/65 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
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

      <div className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.url} project={project} onOpen={onOpenProject} />
        ))}
      </div>
    </section>
  );
}
