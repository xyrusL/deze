import Image from "next/image";
import { FacebookIcon, GitHubIcon, TikTokIcon } from "@/components/icons";
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
    facebook: FacebookIcon,
    tiktok: TikTokIcon,
  } as const;

  return (
    <footer
      id="footer"
      className="mt-6 flex flex-col gap-4 rounded-[1.6rem] border border-white/60 bg-white/70 px-5 py-5 text-sm leading-6 text-zinc-600 shadow-[0_14px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6 dark:text-zinc-300 sm:mt-10 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="overflow-hidden rounded-full border border-white/12 bg-white/50 shadow-[0_8px_18px_rgba(15,23,42,0.06)] dark:bg-white/8">
          <Image
            alt="Deze Dev logo"
            className="h-10 w-10 object-cover"
            height={40}
            src="/deze_logo.png"
            width={40}
          />
        </div>
        <p className="max-w-2xl">{`(c) ${year} ${copyright}`}</p>
      </div>

      <div className="flex items-center gap-2 self-start sm:justify-end">
        {socialLinks.map((link) => {
          const Icon = socialIcons[link.platform];

          return (
            <button
              key={link.platform}
              aria-label={`${link.label} ${link.username}`}
              className="hover-chip-premium hover-press-soft inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/70 text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-sky-300/40 dark:hover:text-sky-200"
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
