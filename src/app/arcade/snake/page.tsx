import SnakeGame from "../../components/SnakeGame";
import ArcadeGameHeader from "@/app/components/ArcadeGameHeader";

export default function ArcadeSnakePage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <ArcadeGameHeader title="Snake" />

        <SnakeGame />
      </div>
    </main>
  );
}

