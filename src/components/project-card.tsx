import { ArrowUpRightIcon } from "@/components/icons";
import type { Project } from "@/data/portfolio";

type ProjectCardProps = {
  project: Project;
  onOpen: (project: Project) => void;
};

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <article className="group flex h-full min-h-[17rem] min-w-0 flex-col gap-6 overflow-hidden rounded-[1.5rem] border border-zinc-200/80 bg-zinc-50/90 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_18px_35px_rgba(56,189,248,0.12)] dark:border-white/10 dark:bg-black/20 dark:hover:border-sky-300/20">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-3">
            <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
              Project
            </p>
            <h3 className="truncate text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
              {project.shortName}
            </h3>
          </div>

          <button
            aria-label={`Open ${project.shortName} project link options`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition duration-200 hover:border-sky-300 hover:bg-sky-500 hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-white/10 dark:bg-white/10 dark:text-zinc-200 dark:hover:border-sky-300/40 dark:hover:bg-sky-400 dark:hover:text-slate-950"
            onClick={() => onOpen(project)}
            type="button"
          >
            <ArrowUpRightIcon />
          </button>
        </div>

        <p className="break-words text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {project.description}
        </p>
      </div>
    </article>
  );
}
