import ArcadeGameHeader from "@/app/components/ArcadeGameHeader";
import NeonDodgerGame from "@/app/components/NeonDodgerGame";

export default function ArcadeNeonDodgerPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <ArcadeGameHeader title="Neon Dodger" />

        <NeonDodgerGame />
      </div>
    </main>
  );
}
