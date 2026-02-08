import ArcadeGameHeader from "../../components/ArcadeGameHeader";
import WordGuessGame from "../../components/WordGuessGame";

export default function ArcadeWordGuessPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <ArcadeGameHeader title="Word Guess" />

        <WordGuessGame />
      </div>
    </main>
  );
}
