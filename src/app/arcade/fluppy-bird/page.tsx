import FluppyBirdGame from "@/app/components/FluppyBirdGame";
import ArcadeGameHeader from "@/app/components/ArcadeGameHeader";

export default function ArcadeFluppyBirdPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <ArcadeGameHeader title="Fluppy Bird" />

        <FluppyBirdGame />
      </div>
    </main>
  );
}
