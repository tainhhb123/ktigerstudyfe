//src/components/flashcard/FlashcardPlayer.tsx
import React, { useState, useEffect } from "react";

interface Flashcard {
  id: number;
  term: string;
  meaning: string;
  image?: string;
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
  const [autoPlay, setAutoPlay] = useState(false);
  
  // Đổi useEffect để đảm bảo thứ tự hoạt động đúng
  useEffect(() => {
    if (!autoPlay) return;

    // Nếu đang ở thẻ cuối => dừng autoplay
    if (currentIndex >= totalCards - 1 && flipped) {
      setTimeout(() => {
        setAutoPlay(false);
      }, 1000);
      return;
    }

    let timer: NodeJS.Timeout;

    if (!flipped) {
      // Nếu thẻ chưa lật, sẽ lật thẻ sau 1 giây
      timer = setTimeout(() => {
        setFlipped(true);
      }, 1000);
    } else {
      // Nếu thẻ đã lật, sẽ tiến tới thẻ kế tiếp sau 1 giây
      // Và reset về mặt trước
      timer = setTimeout(() => {
        // Chuyển thẻ và đảm bảo hiển thị mặt trước
        onNext();
        // Reset thẻ về mặt trước (không nhấp nháy)
        setFlipped(false);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [autoPlay, flipped, currentIndex, totalCards, onNext]);

  // Reset về mặt trước khi flashcard thay đổi 
  // Vô hiệu hóa để tránh conflict với luồng autoPlay
  useEffect(() => {
    if (!autoPlay) {
      setFlipped(false);
    }
  }, [flashcard, autoPlay]);

  // Trường hợp không có flashcard
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
        onClick={() => !autoPlay && setFlipped((f) => !f)} // Chỉ cho phép click khi không trong chế độ autoplay
      >
        <div
          className="w-full h-full transition-transform duration-500 relative"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Mặt Trước */}
          <div
            className="absolute inset-0 rounded-2xl flex items-center justify-center text-gray-800 text-3xl font-semibold p-4"
            style={{
              background: "white",
              boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            <div className="flex flex-row items-center justify-center gap-8">
              <div className="text-center text-3xl font-semibold">{flashcard.term}</div>
              {flashcard.image && (
                <img
                  src={flashcard.image}
                  alt="Flashcard"
                  className="w-50 h-50 object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>
          </div>

          {/* Mặt Sau */}
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

      {/* Thanh điều hướng & Nút chức năng */}
      <div className="relative w-full flex items-center justify-center mb-2">
        {/* Nút quay lui - số thứ tự - nút tiếp theo (giữa) */}
        <div className="flex flex-row items-center space-x-4">
          <button
            className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              setFlipped(false);
              onPrevious();
            }}
            disabled={currentIndex === 0 || autoPlay}
          >
            &#8592;
          </button>
          <span className="text-gray-700 text-lg font-semibold select-none">
            {currentIndex + 1} / {totalCards}
          </span>
          <button
            className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              setFlipped(false);
              onNext();
            }}
            disabled={currentIndex === totalCards - 1 || autoPlay}
          >
            &#8594;
          </button>
        </div>

        {/* Nút Play & Review (phải) */}
        <div className="absolute right-0 pr-6 flex items-center gap-3">
          {/* Nút Play/Pause thay đổi dựa vào trạng thái */}
          <button
            className={`p-2 rounded hover:bg-gray-200 transition ${
              autoPlay ? "bg-gray-200 text-blue-600" : "text-gray-700"
            }`}
            onClick={() => {
              // Bật/tắt AutoPlay
              setAutoPlay((prev) => !prev);
              // Luôn bắt đầu từ mặt trước khi bật autoplay
              if (!autoPlay) setFlipped(false);
            }}
            title={autoPlay ? "Dừng phát" : "Tự động phát"}
          >
            {autoPlay ? (
              // Icon Pause khi đang phát
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              // Icon Play khi đang dừng
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Nút Review (chưa xác định chức năng) */}
          <button className="p-2 rounded hover:bg-gray-200 text-gray-700 transition">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPlayer;