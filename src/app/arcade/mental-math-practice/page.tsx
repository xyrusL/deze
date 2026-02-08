import ArcadeGameHeader from "@/app/components/ArcadeGameHeader";
import MentalMathPracticeGame from "@/app/components/MentalMathPracticeGame";

export default function ArcadeMentalMathPracticePage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <ArcadeGameHeader title="Mental Math Practice" />

        <MentalMathPracticeGame />
      </div>
    </main>
  );
}
