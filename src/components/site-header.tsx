import Image from "next/image";
import { GridIcon, HomeIcon, MailIcon, ProfileIcon } from "@/components/icons";
import type { NavigationItem } from "@/data/portfolio";

const navigationIcons = {
  home: HomeIcon,
  projects: GridIcon,
  about: ProfileIcon,
  contact: MailIcon,
} as const;

type SiteHeaderProps = {
  items: NavigationItem[];
};

export function SiteHeader({ items }: SiteHeaderProps) {
  return (
    <header
      id="home"
      className="sticky top-3 z-20 mb-5 rounded-[2rem] border border-white/70 bg-white/80 px-4 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-white/10 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:top-4 sm:mb-8 sm:px-5 sm:py-3"
    >
      <nav
        aria-label="Primary"
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <div className="min-w-0 w-fit max-w-full rounded-full border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] sm:px-5 sm:py-3.5">
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-full border border-white/12 bg-white/50 shadow-[0_8px_18px_rgba(15,23,42,0.08)] dark:bg-white/8">
              <Image
                alt="Deze Dev logo"
                className="h-11 w-11 object-cover sm:h-12 sm:w-12"
                priority
                height={48}
                src="/deze_logo.png"
                width={48}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
                Deze Dev
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Learning, building, improving.
              </p>
            </div>
          </div>
        </div>

        <ul className="grid w-full grid-cols-4 gap-1.5 rounded-[1.5rem] border border-black/5 bg-black/[0.03] p-1.5 text-sm font-medium text-zinc-600 dark:border-white/10 dark:bg-black/20 dark:text-zinc-300 sm:flex sm:w-auto sm:flex-wrap sm:justify-end sm:gap-2 sm:rounded-full sm:border-0 sm:bg-transparent sm:p-0">
          {items.map((item) => {
            const Icon = navigationIcons[item.icon];

            return (
              <li key={item.href} className="min-w-0">
                <a
                  aria-label={item.label}
                  className="hover-chip-premium hover-press-soft group inline-flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2.5 text-[0.68rem] tracking-[0.16em] uppercase hover:bg-sky-500/10 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:hover:bg-sky-400/10 dark:hover:text-white dark:focus-visible:outline-sky-300 sm:min-h-0 sm:w-auto sm:flex-row sm:gap-2 sm:rounded-full sm:px-4 sm:py-2 sm:text-sm sm:normal-case sm:tracking-normal"
                  href={item.href}
                >
                  <span className="hover-icon-drift">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="hover-text-glide">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
