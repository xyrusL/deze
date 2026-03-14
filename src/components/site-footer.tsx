type SiteFooterProps = {
  copyright: string;
  note: string;
};

export function SiteFooter({ copyright, note }: SiteFooterProps) {
  return (
    <footer
      id="footer"
      className="mt-10 flex flex-col gap-4 border-t border-black/10 px-1 pt-6 text-sm text-zinc-600 dark:border-white/10 dark:text-zinc-300 sm:flex-row sm:items-center sm:justify-between"
    >
      <p>{copyright}</p>
      <p>{note}</p>
    </footer>
  );
}
