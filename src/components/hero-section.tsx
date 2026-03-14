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
    <section className="grid gap-6 rounded-[2rem] border border-white/65 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.95fr)] lg:p-12">
      <div className="space-y-6">
        <span className="inline-flex w-fit rounded-full border border-sky-200/80 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-700 dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-200">
          {eyebrow}
        </span>
        <div className="space-y-4">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-pretty sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-300">
            {description}
          </p>
        </div>
      </div>

      <section
        id="about"
        aria-labelledby="about-heading"
        className="rounded-[1.75rem] border border-zinc-200/80 bg-zinc-50/90 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:border-white/10 dark:bg-black/20"
      >
        <h2 id="about-heading" className="text-lg font-semibold tracking-tight">
          Overview
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {overviewParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </section>
  );
}
