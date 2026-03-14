type SiteFooterProps = {
  copyright: string;
  note: string;
  githubLabel: string;
  githubUrl: string;
};

export function SiteFooter({
  copyright,
  note,
  githubLabel,
  githubUrl,
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="mt-6 flex flex-col gap-4 rounded-[1.6rem] border border-white/60 bg-white/70 px-5 py-5 text-sm leading-6 text-zinc-600 shadow-[0_14px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6 dark:text-zinc-300 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
    >
      <p>{`© ${year} ${copyright}`}</p>
      <a
        className="inline-flex w-fit items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-sm font-medium text-zinc-700 transition duration-200 hover:border-sky-300 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-sky-300/40 dark:hover:text-sky-200"
        href={githubUrl}
        rel="noreferrer"
        target="_blank"
      >
        {githubLabel}
        <span className="text-zinc-500 dark:text-zinc-400">xyrusL</span>
      </a>
      <p>{note}</p>
    </footer>
  );
}
