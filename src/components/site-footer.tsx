import {
  CopyrightIcon,
  FacebookIcon,
  GitHubIcon,
  LinkedInIcon,
  TikTokIcon,
} from "@/components/icons";
import type { SocialLink } from "@/data/portfolio";

type SiteFooterProps = {
  copyright: string;
  socialLinks: SocialLink[];
  onOpenLink?: (link: SocialLink) => void;
};

export function SiteFooter({
  copyright,
  socialLinks,
  onOpenLink,
}: SiteFooterProps) {
  const year = new Date().getFullYear();
  const socialIcons = {
    github: GitHubIcon,
    linkedin: LinkedInIcon,
    facebook: FacebookIcon,
    tiktok: TikTokIcon,
  } as const;
  const actionClassName =
    "hover-chip-premium hover-press-soft inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/70 text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-sky-300/40 dark:hover:text-sky-200 sm:h-11 sm:w-11";

  return (
    <footer
      id="footer"
      className="mt-6 flex flex-col gap-4 overflow-hidden rounded-[1.6rem] border border-white/60 bg-white/70 px-5 py-5 text-sm leading-6 text-zinc-600 shadow-[0_14px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6 dark:text-zinc-300 sm:mt-10 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3 sm:items-center">
        <p className="inline-flex max-w-2xl items-start gap-1 text-balance">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-zinc-500 dark:text-zinc-400">
            <CopyrightIcon className="h-4 w-4" />
          </span>
          <span>{`${year} ${copyright}`}</span>
        </p>
      </div>

      <div className="mt-1 flex w-full items-center justify-end gap-2 sm:mt-0 sm:w-auto sm:justify-end">
        {socialLinks.map((link) => {
          const Icon = socialIcons[link.platform];

          if (onOpenLink) {
            return (
              <button
                key={link.platform}
                aria-label={`${link.label} ${link.username}`}
                className={actionClassName}
                onClick={() => onOpenLink(link)}
                type="button"
                title={`${link.label}: ${link.username}`}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          }

          if (link.status === "active") {
            return (
              <a
                key={link.platform}
                aria-label={`${link.label} ${link.username}`}
                className={actionClassName}
                href={link.url}
                rel="noreferrer"
                target="_blank"
                title={`${link.label}: ${link.username}`}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          }

          return (
            <button
              key={link.platform}
              aria-label={`${link.label} ${link.username}`}
              className={`${actionClassName} cursor-not-allowed opacity-55`}
              disabled
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
