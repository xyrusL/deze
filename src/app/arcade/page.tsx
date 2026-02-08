import Link from "next/link";
import ArcadeGameCard from "@/app/components/ArcadeGameCard";

const games = [
  {
    title: "Snake",
    description: "Classic neon Snake with keyboard, touch controls, and score tracking.",
    href: "/arcade/snake",
  },
  {
    title: "Fluppy Bird",
    description: "Flappy-style dodging game with keyboard and tap controls across devices.",
    href: "/arcade/fluppy-bird",
  },
  {
    title: "Tap Tap Shoots",
    description: "Tap to launch basketball shots through a moving rim that shifts after every score.",
    href: "/arcade/tap-tap-shoots",
  },
  {
    title: "Tetris",
    description: "Stack falling tetrominoes, clear lines, and survive as drop speed increases by level.",
    href: "/arcade/tetris",
  },
] as const;

export default function ArcadePage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">DEZE ARCADE</p>
            <h1 className="mt-2 font-mono text-3xl font-bold text-white sm:text-4xl">Choose a Game</h1>
          </div>
          <Link className="font-mono text-sm text-gray-400 hover:text-cyan-300" href="/">
            ← Back
          </Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          {games.map((game) => (
            <ArcadeGameCard key={game.href} title={game.title} description={game.description} href={game.href} />
          ))}
        </section>
      </div>
    </main>
  );
}

