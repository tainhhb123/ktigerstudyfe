import React, { useEffect } from "react";

export interface Vocabulary {
  id: number;
  term: string;
  meaning: string;
}

interface VocabularyListProps {
  vocabularies: Vocabulary[];
}

// Hàm kiểm tra text có phải là tiếng Hàn không
function isKorean(text: string) {
  // Hangul: \uAC00-\uD7AF, Jamo: \u1100-\u11FF, Compatibility: \u3130-\u318F
  return /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/.test(text);
}

export default function VocabularyList({ vocabularies }: VocabularyListProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  /**
   * Đọc từ với ngôn ngữ phù hợp (tiếng Hàn hoặc tiếng Việt)
   */
  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Trình duyệt của bạn không hỗ trợ đọc tự động.");
      return;
    }
    const synth = window.speechSynthesis;

    // Tự động chọn ngôn ngữ
    const isKo = isKorean(text);
    const lang = isKo ? "ko-KR" : "vi-VN";

    const doSpeak = () => {
      const voices = synth.getVoices();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      // Chọn voice phù hợp nếu có
      const pickVoice = voices.find((v) =>
        v.lang.toLowerCase().startsWith(lang.toLowerCase())
      );
      if (pickVoice) {
        utterance.voice = pickVoice;
      }
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

  return (
    <div>
      <h2 className="text-gray-800 text-lg font-semibold mb-3">
        학습하지 않음 ({vocabularies.length})
      </h2>
      <div className="space-y-4">
        {vocabularies.map((v) => (
          <div
            key={v.id}
            className="flex items-center bg-white p-4 rounded-xl shadow-md border border-gray-200"
          >
            <div className="w-1/3 text-gray-900 text-lg font-semibold pr-4 border-r border-gray-200">
              {v.term}
            </div>
            <div className="w-2/3 text-gray-700 text-base pl-4 flex-grow">
              {v.meaning}
            </div>
            <div className="flex-shrink-0 ml-4 flex items-center">
              {/* Favorite button (hiện không xử lý sự kiện) */}
              <button
                className="p-2 rounded-full hover:bg-yellow-100 text-yellow-500 transition-colors duration-200"
                aria-label="Mark as favorite"
                tabIndex={-1}
              >
                <span role="img" aria-label="star">
                  ★
                </span>
              </button>

              {/* Speak button */}
              <button
                onClick={() => speak(v.term)}
                className="ml-3 p-2 rounded-full hover:bg-blue-100 text-blue-500 transition-colors duration-200"
                aria-label={`Phát âm: ${v.term}`}
              >
                <span role="img" aria-label="sound">
                  🔊
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
