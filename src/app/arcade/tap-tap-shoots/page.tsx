import ArcadeGameHeader from "@/app/components/ArcadeGameHeader";
import TapTapShootsGame from "@/app/components/TapTapShootsGame";

export default function ArcadeTapTapShootsPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <ArcadeGameHeader title="Tap Tap Shoots" />

        <TapTapShootsGame />
      </div>
    </main>
  );
}
