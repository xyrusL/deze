import Link from "next/link";

type ArcadeGameCardProps = {
  title: string;
  description: string;
  href: string;
  cta?: string;
};

export default function ArcadeGameCard({ title, description, href, cta = "Play Now" }: ArcadeGameCardProps) {
  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-black/60 p-6 backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:border-cyan-300 hover:bg-black/70 hover:shadow-[0_0_40px_rgba(0,243,255,0.25)] active:scale-[1.005] motion-reduce:transform-none motion-reduce:transition-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.28),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(168,85,247,0.28),transparent_45%),radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.22),transparent_55%)] opacity-35 blur-xl transition-all duration-700 ease-out group-hover:opacity-80 group-hover:blur-2xl group-hover:[transform:translate3d(0,-3%,0)_scale(1.08)] group-active:opacity-90 group-active:[transform:translate3d(0,-1%,0)_scale(1.04)]"
      />
      <h2 className="font-mono text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm text-gray-300">{description}</p>
      <div className="mt-auto pt-6">
        <Link
          href={href}
          className="inline-block rounded-xl border border-purple-400/40 bg-purple-500/10 px-4 py-2 font-mono text-sm font-semibold text-purple-200 transition-all duration-200 ease-out hover:border-purple-300 hover:bg-purple-500/20"
        >
          {cta}
        </Link>
      </div>
    </article>
  );
}
