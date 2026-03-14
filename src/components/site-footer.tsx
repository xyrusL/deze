import { GitHubIcon } from "@/components/icons";
import type { SocialLink } from "@/data/portfolio";

type SiteFooterProps = {
  copyright: string;
  socialLinks: SocialLink[];
  onOpenLink: (link: SocialLink) => void;
};

export function SiteFooter({
  copyright,
  socialLinks,
  onOpenLink,
}: SiteFooterProps) {
  const year = new Date().getFullYear();
  const socialIcons = {
    github: GitHubIcon,
  } as const;

  return (
    <footer
      id="footer"
      className="mt-6 flex flex-col gap-4 rounded-[1.6rem] border border-white/60 bg-white/70 px-5 py-5 text-sm leading-6 text-zinc-600 shadow-[0_14px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6 dark:text-zinc-300 sm:mt-10 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="max-w-2xl">{`© ${year} ${copyright}`}</p>

      <div className="flex items-center gap-2 self-start sm:justify-end">
        {socialLinks.map((link) => {
          const Icon = socialIcons[link.platform];

          return (
            <button
              key={link.url}
              aria-label={`${link.label} ${link.username}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/70 text-zinc-700 transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-sky-300/40 dark:hover:text-sky-200"
              onClick={() => onOpenLink(link)}
              type="button"
              title={`${link.label}: ${link.username}`}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    </footer>
  );
}
