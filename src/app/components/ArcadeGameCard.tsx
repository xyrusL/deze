import Link from "next/link";

type ArcadeGameCardProps = {
  title: string;
  description: string;
  href: string;
  cta?: string;
};

export default function ArcadeGameCard({ title, description, href, cta = "Play Now" }: ArcadeGameCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-cyan-500/30 bg-black/60 p-6 backdrop-blur-xl transition hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,243,255,0.25)]">
      <h2 className="font-mono text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm text-gray-300">{description}</p>
      <div className="mt-auto pt-6">
        <Link
          href={href}
          className="inline-block rounded-xl border border-purple-400/40 bg-purple-500/10 px-4 py-2 font-mono text-sm font-semibold text-purple-200 transition hover:border-purple-300 hover:bg-purple-500/20"
        >
          {cta}
        </Link>
      </div>
    </article>
  );
}
