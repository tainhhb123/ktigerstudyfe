import React, { useState, useEffect } from "react";
import { authService } from "../../../services/authService";
import { FaRegHeart, FaHeart, FaExclamationTriangle } from 'react-icons/fa';

// Kiểm tra ký tự tiếng Hàn
function isKorean(text: string) {
  return /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/.test(text);
}

export interface Flashcard {
  id: number;
  term: string;
  meaning: string;
  example?: string;
  vocabImage?: string;
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
  // Đảm bảo URL đầy đủ
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const API_URL = base.endsWith("/api") ? base : `${base}/api`;
  const userId = authService.getUserId();

  const [flipped, setFlipped] = useState(false);
  const [favId, setFavId] = useState<number | null>(null);
  const [loadingFav, setLoadingFav] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const presetReasons = ["Nội dung sai", "Nội dung không phù hợp", "Lý do khác"];

  // Phát âm
  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Trình duyệt không hỗ trợ phát âm.");
      return;
    }
    const synth = window.speechSynthesis;
    const lang = isKorean(text) ? "ko-KR" : "vi-VN";
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    const voice = synth.getVoices().find(v => v.lang.startsWith(lang));
    if (voice) utt.voice = voice;
    synth.cancel();
    synth.speak(utt);
  };

  // Reset trạng thái flip
  useEffect(() => {
    setFlipped(false);
  }, [flashcard]);

  // Lấy trạng thái yêu thích (404 => không yêu thích)
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/favorite-lists/user/${userId}/list/${listId}`)
      .then(res => {
        if (res.status === 404) {
          setFavId(null);
          return null;
        }
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data: { favoriteId: number } | null) => {
        if (data) setFavId(data.favoriteId);
      })
      .catch(() => setFavId(null));
  }, [API_URL, userId, listId]);

  // Toggle yêu thích
  const toggleFavorite = async () => {
    if (!userId) { alert("Vui lòng đăng nhập."); return; }
    setLoadingFav(true);
    try {
      if (favId) {
        const res = await fetch(`${API_URL}/favorite-lists/${favId}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        setFavId(null);
      } else {
        const res = await fetch(`${API_URL}/favorite-lists`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, listId }),
        });
        if (!res.ok) throw new Error();
        const { favoriteId } = await res.json();
        setFavId(favoriteId);
      }
    } catch {
      alert("Cập nhật yêu thích thất bại.");
    } finally {
      setLoadingFav(false);
    }
  };

  // Gửi báo cáo
  const submitReport = async () => {
    const reason = selectedReason === "Lý do khác" ? customReason.trim() : selectedReason;
    if (!reason) { alert("Vui lòng chọn hoặc nhập lý do."); return; }
    try {
      const res = await fetch(`${API_URL}/document-reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, listId, reason }),
      });
      if (!res.ok) throw new Error();
      alert("Báo cáo đã gửi.");
      setShowReport(false);
      setSelectedReason("");
      setCustomReason("");
    } catch {
      alert("Gửi báo cáo thất bại.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Flashcard */}
      <div
        className="relative w-full max-w-2xl h-64 mb-6 cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white shadow-md rounded-2xl flex items-center justify-center p-4"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-3xl font-semibold text-gray-800 text-center">
              {flashcard.term}
            </span>
            <button
              onClick={e => { e.stopPropagation(); speak(flashcard.term); }}
              className="absolute top-3 right-4 p-2 rounded-full hover:bg-blue-100 text-blue-500"
              aria-label={`Phát âm ${flashcard.term}`}
            >🔊</button>
          </div>
          {/* Back */}
          <div
            className={`absolute inset-0 bg-white shadow-md rounded-2xl p-6 flex ${flashcard.vocabImage ? 'flex-row items-start' : 'flex-col items-center justify-center'}`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className={`${flashcard.vocabImage ? 'flex-1 pr-4' : ''}`}>
              <p className="mb-2 text-3xl font-bold text-gray-800">{flashcard.meaning}</p>
              {flashcard.example && <p className="italic text-lg text-gray-600">“{flashcard.example}”</p>}
            </div>
            {flashcard.vocabImage && (
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={flashcard.vocabImage}
                  alt={flashcard.term}
                  className="max-w-[200px] max-h-[200px] object-contain rounded"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-8 mb-4">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 transition disabled:opacity-50"
        >←</button>
        <span className="text-lg font-semibold select-none">
          {currentIndex + 1} / {totalCards}
        </span>
        <button
          onClick={onNext}
          disabled={currentIndex === totalCards - 1}
          className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 transition disabled:opacity-50"
        >→</button>
      </div>

      {/* Shuffle, Favorite & Report */}
      <div className="flex items-center justify-between w-full max-w-2xl px-4 mb-6">
        <button
          onClick={onShuffle}
          className="bg-purple-100 text-purple-700 px-4 py-2 rounded hover:bg-purple-200 transition"
        >
          🔀 Đảo ngẫu nhiên
        </button>
        <div className="flex space-x-4">
          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            disabled={loadingFav}
            className="p-2 rounded hover:bg-gray-200 transition"
            aria-label={favId ? 'Bỏ yêu thích' : 'Yêu thích'}
          >
            {favId
              ? <FaHeart size={24} className="text-red-500" />
              : <FaRegHeart size={24} className="text-gray-500" />
            }
          </button>

          {/* Report button */}
          <button
            onClick={() => setShowReport(true)}
            className="p-2 rounded hover:bg-gray-200 transition"
            aria-label="Báo cáo tài liệu"
          >
            <FaExclamationTriangle size={24} className="text-yellow-500" />
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        // wrapper cố định full màn hình
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop: mờ + blur nền phía sau */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Modal content */}
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Báo cáo tài liệu</h2>
            <select
              value={selectedReason}
              onChange={e => setSelectedReason(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            >
              <option value="" disabled>-- Chọn lý do --</option>
              {presetReasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {selectedReason === 'Lý do khác' && (
              <textarea
                placeholder="Nhập lý do khác..."
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 mb-4 h-24 resize-none"
              />
            )}
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
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FlashcardPlayer;
