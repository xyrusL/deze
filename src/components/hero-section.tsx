import Link from "next/link";
import {
  HiOutlinePaintBrush,
  HiOutlineSparkles,
  HiOutlineUserCircle,
} from "react-icons/hi2";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  overviewParagraphs: string[];
};

export function HeroSection({
  eyebrow,
  title,
  description,
  overviewParagraphs,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/65 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-8 lg:p-12">
      <div className="pointer-events-none absolute -left-12 -top-14 h-44 w-44 rounded-full bg-sky-400/18 blur-3xl dark:bg-sky-400/24" />
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-white/12 blur-2xl dark:bg-white/8" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.95fr)]">
        <div className="space-y-6">
          <span className="inline-flex w-fit rounded-full border border-sky-200/80 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-700 dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
            {eyebrow}
          </span>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-[clamp(2.8rem,12vw,4.8rem)] leading-[0.95] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-300">
              {description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/65 px-3 py-2 text-xs font-medium tracking-[0.12em] text-zinc-700 uppercase shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/8 dark:text-zinc-200">
                <HiOutlineSparkles className="h-4 w-4 text-sky-500 dark:text-sky-300" />
                Building step by step
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/65 px-3 py-2 text-xs font-medium tracking-[0.12em] text-zinc-700 uppercase shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/8 dark:text-zinc-200">
                <HiOutlinePaintBrush className="h-4 w-4 text-sky-500 dark:text-sky-300" />
                Frontend focused
              </span>
            </div>
          </div>
        </div>

        <section
          id="overview"
          aria-labelledby="overview-heading"
          className="rounded-[1.75rem] border border-zinc-200/80 bg-zinc-50/90 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:border-white/10 dark:bg-black/20 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-200/80 bg-sky-500/10 text-sky-700 shadow-[0_8px_20px_rgba(14,165,233,0.16)] dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
              <HiOutlineUserCircle className="h-5 w-5" />
            </span>
            <h2 id="overview-heading" className="text-lg font-semibold tracking-tight">
              Overview
            </h2>
          </div>
          <div className="mt-4 space-y-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {overviewParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-6">
            <Link
              className="hover-chip-premium hover-press-soft inline-flex items-center rounded-full border border-sky-200/80 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-500/16 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200 dark:hover:bg-sky-400/16 dark:hover:text-sky-100"
              href="/about"
            >
              Read more
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
