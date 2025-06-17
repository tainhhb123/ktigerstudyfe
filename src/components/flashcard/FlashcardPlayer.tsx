//src/components/flashcard/FlashcardPlayer.tsx
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
}

const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({
  flashcard,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
}) => {
  const [flipped, setFlipped] = useState(false);

  // Reset về mặt trước khi đổi flashcard
  useEffect(() => {
    setFlipped(false);
  }, [flashcard]);

  // Kiểm tra nếu không có flashcard nào được truyền vào
  if (!flashcard) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl h-64 rounded-2xl bg-white shadow-md text-gray-700 text-lg">
        Không có từ vựng nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Card 3D */}
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
          {/* FRONT */}
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
          {/* BACK */}
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

      {/* Pagination + Control */}
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

      {/* Footer */}
      <div className="flex flex-row items-center justify-between w-full max-w-2xl mt-2 px-4">
        {/* Hint Section */}
        <div className="text-gray-600 text-sm flex items-center gap-2">
          <svg width="18" height="18" fill="none" className="inline">
            <circle cx="9" cy="9" r="9" fill="#e0e0e0" /> {/* Màu nền cho circle */}
            <text x="9" y="13" fontSize="10" textAnchor="middle" fill="#333333"> {/* Màu chữ cho text */}
              힌트
            </text>
          </svg>
          힌트 얻기
        </div>
        {/* Control Buttons (Play & Review) */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded hover:bg-gray-200 text-gray-700 transition">
            <svg width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </button>
          <button className="p-2 rounded hover:bg-gray-200 text-gray-700 transition">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPlayer; 