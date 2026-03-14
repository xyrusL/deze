import { ArrowUpRightIcon } from "@/components/icons";
import type { Project } from "@/data/portfolio";

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
  onContinue: () => void;
};

export function ProjectModal({ project, onClose, onContinue }: ProjectModalProps) {
  return (
    <div
      aria-labelledby="project-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/45 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[1.75rem] border border-white/70 bg-white/95 p-6 shadow-[0_32px_80px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-zinc-950/95"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-sky-200/80 bg-sky-500/10 px-3 py-1 text-xs font-medium tracking-[0.18em] text-sky-700 uppercase dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
            External link
          </div>

          <div className="space-y-2">
            <h3 id="project-modal-title" className="text-xl font-semibold tracking-tight">
              Leave this portfolio and open {project.shortName}?
            </h3>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              This project opens in a new browser tab so you can keep your place here.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
            <span className="mb-1 block text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
              Destination URL
            </span>
            <span className="break-all">{project.url}</span>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-800 transition duration-200 hover:border-zinc-400 hover:bg-zinc-100 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10 dark:focus-visible:outline-white"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(14,165,233,0.28)] transition duration-200 hover:bg-sky-400 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-slate-950"
              onClick={onContinue}
              type="button"
            >
              Continue in new tab
              <ArrowUpRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
