// src/components/document/flashcard/FlashcardPlayer.tsx
import React, { useState, useEffect } from "react";

export interface Flashcard {
  id: number;
  term: string;
  meaning: string;
}

interface FlashcardPlayerProps {
  flashcard: Flashcard;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCards: number;
  onShuffle: () => void;
}

const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({
  flashcard,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
  onShuffle,
}) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [flashcard]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        className="relative w-full max-w-2xl h-64 mb-6 cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="w-full h-full transition-transform duration-500 relative"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl flex items-center justify-center text-gray-800 text-3xl font-semibold p-4"
            style={{
              background: "white",
              boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            {flashcard.term}
          </div>
          <div
            className="absolute inset-0 rounded-2xl flex items-center justify-center text-gray-800 text-3xl font-bold p-4"
            style={{
              background: "white",
              boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {flashcard.meaning}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-8 mb-2">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ←
        </button>
        <span className="text-gray-700 text-lg font-semibold select-none">
          {currentIndex + 1} / {totalCards}
        </span>
        <button
          onClick={onNext}
          disabled={currentIndex === totalCards - 1}
          className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>

      <div className="flex items-center justify-between w-full max-w-2xl px-4 mb-6">
        <button
          onClick={onShuffle}
          className="bg-purple-100 text-purple-700 text-sm px-4 py-2 rounded-md hover:bg-purple-200 transition"
        >
          🔀 Đảo ngẫu nhiên danh sách
        </button>
      </div>
    </div>
  );
};

export default FlashcardPlayer;
