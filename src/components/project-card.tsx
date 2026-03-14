import { ArrowUpRightIcon } from "@/components/icons";
import type { Project } from "@/data/portfolio";

type ProjectCardProps = {
  index: number;
  project: Project;
  onOpen: (project: Project) => void;
};

export function ProjectCard({ index, project, onOpen }: ProjectCardProps) {
  const projectHost = project.url.replace(/^https?:\/\//, "");

  return (
    <button
      className="group flex min-h-[15rem] min-w-0 snap-start flex-col gap-6 overflow-hidden rounded-[1.6rem] border border-zinc-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,244,245,0.9))] p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_18px_35px_rgba(56,189,248,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(24,24,27,0.82),rgba(9,9,11,0.62))] dark:hover:border-sky-300/20 sm:h-full sm:min-h-[17rem]"
      onClick={() => onOpen(project)}
      type="button"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-3">
            <p className="inline-flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.24em] text-zinc-500 uppercase dark:text-zinc-400">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span className="h-px w-4 bg-current/35" aria-hidden="true" />
              Project
            </p>
            <h3 className="text-xl leading-tight font-semibold tracking-tight text-balance text-zinc-950 dark:text-white sm:text-lg">
              {project.shortName}
            </h3>
          </div>

          <span
            aria-hidden="true"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition duration-200 group-hover:border-sky-300 group-hover:bg-sky-500 group-hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-zinc-200 dark:group-hover:border-sky-300/40 dark:group-hover:bg-sky-400 dark:group-hover:text-slate-950 sm:h-10 sm:w-10"
          >
            <ArrowUpRightIcon />
          </span>
        </div>

        <p className="break-words text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {project.description}
        </p>
      </div>

      <div className="mt-auto border-t border-black/8 pt-4 text-[0.72rem] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:border-white/10 dark:text-zinc-400">
        <span className="block truncate">{projectHost}</span>
      </div>
    </button>
  );
}
