import React, { useState, useEffect } from "react";

interface Flashcard {
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
  onShuffle: () => void; // thêm props mới
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

  if (!flashcard) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl h-64 rounded-2xl bg-white shadow-md text-gray-700 text-lg">
        Không có từ vựng nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Flashcard */}
      <div
        className="relative w-full max-w-2xl h-64 mb-6 cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={`w-full h-full transition-transform duration-500 relative`}
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl flex items-center justify-center text-gray-800 text-3xl font-semibold p-4"
            style={{
              background: "white",
              boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            <div className="px-4 text-center">{flashcard.term}</div>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl flex items-center justify-center text-gray-800 text-3xl font-bold p-4"
            style={{
              background: "white",
              boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="px-4 text-center">{flashcard.meaning}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-row items-center justify-center space-x-8 mb-2">
        <button
          className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onPrevious}
          disabled={currentIndex === 0}
        >
          &#8592;
        </button>
        <span className="text-gray-700 text-lg font-semibold select-none">
          {currentIndex + 1} / {totalCards}
        </span>
        <button
          className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNext}
          disabled={currentIndex === totalCards - 1}
        >
          &#8594;
        </button>
      </div>

      {/* Nút shuffle */}
      <div className="flex items-center justify-between w-full max-w-2xl px-4 mb-6">
        <button
          className="bg-purple-100 text-purple-700 text-sm px-4 py-2 rounded-md hover:bg-purple-200 transition"
          onClick={onShuffle}
        >
          🔀 Đảo ngẫu nhiên danh sách
        </button>
        <button className="p-2 rounded hover:bg-gray-200 text-red-500 transition">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                           2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
                           C13.09 3.81 14.76 3 16.5 3 
                           19.58 3 22 5.42 22 8.5 
                           c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>


    </div>
  );
};

export default FlashcardPlayer;
