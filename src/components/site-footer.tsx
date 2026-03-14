import { GitHubIcon } from "@/components/icons";
import type { SocialLink } from "@/data/portfolio";

type SiteFooterProps = {
  copyright: string;
  note: string;
  socialLinks: SocialLink[];
};

export function SiteFooter({
  copyright,
  note,
  socialLinks,
}: SiteFooterProps) {
  const year = new Date().getFullYear();
  const socialIcons = {
    github: GitHubIcon,
  } as const;

  return (
    <footer
      id="footer"
      className="mt-6 flex flex-col gap-5 rounded-[1.6rem] border border-white/60 bg-white/70 px-5 py-5 text-sm leading-6 text-zinc-600 shadow-[0_14px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6 dark:text-zinc-300 sm:mt-10 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="max-w-2xl space-y-2">
        <p>{`© ${year} ${copyright}`}</p>
        <p>{note}</p>
      </div>

      <div className="flex items-center gap-3 self-start sm:justify-end">
        <span className="text-[0.68rem] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
          Social
        </span>
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => {
            const Icon = socialIcons[link.platform];

            return (
              <a
                key={link.url}
                aria-label={`${link.label} ${link.username}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/70 text-zinc-700 transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-sky-300/40 dark:hover:text-sky-200"
                href={link.url}
                rel="noreferrer"
                target="_blank"
                title={`${link.label}: ${link.username}`}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
