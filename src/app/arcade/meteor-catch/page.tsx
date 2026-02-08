import ArcadeGameHeader from "@/app/components/ArcadeGameHeader";
import MeteorCatchGame from "@/app/components/MeteorCatchGame";

export default function ArcadeMeteorCatchPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <ArcadeGameHeader title="Meteor Catch" />

        <MeteorCatchGame />
      </div>
    </main>
  );
}
