import ArcadeGameHeader from "@/app/components/ArcadeGameHeader";
import TetrisGame from "@/app/components/TetrisGame";

export default function ArcadeTetrisPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <ArcadeGameHeader title="Tetris" />

        <TetrisGame />
      </div>
    </main>
  );
}
