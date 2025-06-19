import React, { useState, useEffect } from "react";
import { authService } from "../../../services/authService";
import { FaExclamationTriangle } from "react-icons/fa";

// Kiểm tra có ký tự tiếng Hàn không
function isKorean(text: string) {
  return /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/.test(text);
}

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
  listId: number;
}

const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({
  flashcard,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
  onShuffle,
  listId,
}) => {
  const API_URL = import.meta.env.VITE_API_BASE_URL; // ví dụ: "http://localhost:8080/api"
  const userId = authService.getUserId();

  const [flipped, setFlipped] = useState(false);
  const [favId, setFavId] = useState<number | null>(null);
  const [loadingFav, setLoadingFav] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const presetReasons = [
    "Nội dung sai",
    "Nội dung không phù hợp",
    "Lý do khác",
  ];

  // Phát âm flashcard.term với ngôn ngữ phù hợp
  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Trình duyệt không hỗ trợ đọc tự động.");
      return;
    }
    const synth = window.speechSynthesis;
    const isKo = isKorean(text);
    const lang = isKo ? "ko-KR" : "vi-VN";

    const doSpeak = () => {
      const voices = synth.getVoices();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      const voice = voices.find((v) =>
        v.lang.toLowerCase().startsWith(lang.toLowerCase())
      );
      if (voice) utterance.voice = voice;
      synth.cancel();
      synth.speak(utterance);
    };

    if (synth.getVoices().length > 0) {
      doSpeak();
    } else {
      const handler = () => {
        doSpeak();
        synth.removeEventListener("voiceschanged", handler);
      };
      synth.addEventListener("voiceschanged", handler);
    }
  };

  // Reset flip state khi flashcard thay đổi
  useEffect(() => {
    setFlipped(false);
  }, [flashcard]);

  // Lấy trạng thái favorite khi component mount
  useEffect(() => {
    if (!userId || listId == null) return;
    fetch(`${API_URL}/favorite-lists/user/${userId}/list/${listId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not favorited");
        return res.json() as Promise<{ favoriteId: number }>;
      })
      .then((data) => setFavId(data.favoriteId))
      .catch(() => setFavId(null));
  }, [API_URL, userId, listId]);

  // Toggle yêu thích
  const toggleFavorite = async () => {
    if (!userId || listId == null) {
      alert("Bạn cần đăng nhập và chọn danh sách hợp lệ.");
      return;
    }
    setLoadingFav(true);
    try {
      if (favId) {
        const res = await fetch(`${API_URL}/favorite-lists/${favId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error();
        setFavId(null);
      } else {
        const res = await fetch(`${API_URL}/favorite-lists`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, listId }),
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { favoriteId: number };
        setFavId(data.favoriteId);
      }
    } catch {
      alert("Có lỗi khi cập nhật yêu thích.");
    } finally {
      setLoadingFav(false);
    }
  };

  // Gửi báo cáo
  const submitReport = async () => {
    const finalReason =
      selectedReason === "Lý do khác" ? customReason.trim() : selectedReason;
    if (!userId || listId == null || !finalReason) {
      alert("Vui lòng chọn hoặc nhập lý do báo cáo.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/document-reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, listId, reason: finalReason }),
      });
      if (!res.ok) throw new Error();
      alert("Báo cáo đã được gửi.");
      setSelectedReason("");
      setCustomReason("");
      setShowReport(false);
    } catch {
      alert("Có lỗi khi gửi báo cáo.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Flashcard */}
      <div
        className="relative w-full max-w-2xl h-64 mb-6 cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="w-full h-full transition-transform duration-500"
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
            }}
          >
            <span className="block w-full text-center">{flashcard.term}</span>
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                speak(flashcard.term);
              }}
              className="absolute top-3 right-4 p-2 rounded-full hover:bg-blue-100 text-blue-500 transition-colors"
              aria-label={`Phát âm: ${flashcard.term}`}
            >
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
              </svg>
            </button>
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
            {flashcard.meaning}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-8 mb-2">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 transition disabled:opacity-50"
        >
          ←
        </button>
        <span className="text-gray-700 text-lg font-semibold select-none">
          {currentIndex + 1} / {totalCards}
        </span>
        <button
          onClick={onNext}
          disabled={currentIndex === totalCards - 1}
          className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 transition disabled:opacity-50"
        >
          →
        </button>
      </div>

      {/* Shuffle, Favorite & Report */}
      <div className="flex items-center justify-between w-full max-w-2xl px-4 mb-6">
        <button
          onClick={onShuffle}
          className="bg-purple-100 text-purple-700 px-4 py-2 rounded hover:bg-purple-200 transition"
        >
          🔀 Đảo ngẫu nhiên danh sách
        </button>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleFavorite}
            disabled={loadingFav}
            className={`p-2 rounded hover:bg-gray-200 transition ${favId ? "text-red-500" : "text-gray-500"
              }`}
          >
            {favId ? (
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setShowReport(true)}
            className="p-2 rounded hover:bg-gray-200 transition text-yellow-500"
            aria-label="Báo cáo tài liệu"
          >
            <FaExclamationTriangle size={24} />
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Báo cáo tài liệu</h2>
            <div className="mb-4">
              <label className="block font-medium mb-2">Chọn lý do:</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="" disabled>
                  -- Chọn lý do --
                </option>
                {presetReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {selectedReason === "Lý do khác" && (
                <textarea
                  placeholder="Nhập lý do khác..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mt-2 h-24 resize-none"
                />
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowReport(false)}
                className="px-4 py-2 rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={submitReport}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardPlayer;
