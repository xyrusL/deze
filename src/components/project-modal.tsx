import { ArrowUpRightIcon } from "@/components/icons";

type ProjectModalProps = {
  label: string;
  url: string;
  typeLabel: string;
  onClose: () => void;
  onContinue: () => void;
};

export function ProjectModal({
  label,
  url,
  typeLabel,
  onClose,
  onContinue,
}: ProjectModalProps) {
  const host = url.replace(/^https?:\/\//, "");

  return (
    <div
      aria-labelledby="project-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/55 p-4 backdrop-blur-md sm:items-center"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/95 p-6 shadow-[0_32px_80px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-zinc-950/95 sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute -left-14 -top-16 h-40 w-40 rounded-full bg-sky-400/18 blur-3xl dark:bg-sky-400/24" />
        <div className="pointer-events-none absolute left-20 top-2 h-28 w-28 rounded-full bg-white/10 blur-2xl dark:bg-white/6" />
        <div className="relative space-y-5">
          <div className="inline-flex rounded-full border border-sky-200/80 bg-sky-500/10 px-3 py-1 text-xs font-medium tracking-[0.18em] text-sky-700 uppercase dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
            {typeLabel}
          </div>

          <div className="space-y-3">
            <h3 id="project-modal-title" className="max-w-lg text-2xl font-semibold tracking-tight text-balance">
              Open {label} in a new tab?
            </h3>
            <p className="max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              This link opens in a new browser tab, so you can come back here anytime.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
            <span className="mb-1 block text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
              Destination
            </span>
            <span className="block truncate font-medium sm:break-all">{host}</span>
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
              Open link
              <ArrowUpRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
