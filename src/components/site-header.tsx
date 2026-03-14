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
      className="sticky top-3 z-20 mb-6 rounded-[2rem] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-white/10 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:top-4 sm:mb-8"
    >
      <nav
        aria-label="Primary"
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <div className="min-w-0 px-1 sm:px-0">
          <p className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
            Deze Portfolio
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Modern web work, presented simply.
          </p>
        </div>
 
        <ul className="grid w-full grid-cols-4 gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:flex sm:w-auto sm:flex-wrap sm:justify-end sm:gap-2">
          {items.map((item) => {
            const Icon = navigationIcons[item.icon];
 
            return (
              <li key={item.href} className="min-w-0">
                <a
                  aria-label={item.label}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-2.5 py-2.5 transition duration-200 hover:bg-sky-500/10 hover:text-zinc-950 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:hover:bg-sky-400/10 dark:hover:text-white dark:focus-visible:outline-sky-300 sm:min-h-0 sm:w-auto sm:px-4 sm:py-2"
                  href={item.href}
                >
<span className="sm:hidden">
                    <Icon />
                  </span>
                  <span className="sr-only sm:not-sr-only sm:inline">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
