// src/components/learning-path/SentenceRewritingQuestion.tsx
import { useState, useEffect } from "react";
import { Microphone } from "phosphor-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface SentenceRewritingQuestionProps {
  question: {
    questionId: number;
    originalSentence: string;
    rewrittenSentence: string;
    linkMedia?: string;
  };
  onNext?: (isCorrect: boolean) => void;
}

export default function SentenceRewritingQuestion({
  question,
  onNext,
}: SentenceRewritingQuestionProps) {
  const [userInput, setUserInput] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Đồng bộ transcript vào input khi nói xong
  useEffect(() => {
    if (!listening && isListening) {
      setUserInput(transcript);
      setIsListening(false);
    }
  }, [listening]);

  const checkAnswer = () => {
    const isOk =
      userInput.trim().toLowerCase() === question.rewrittenSentence.trim().toLowerCase();
    setIsCorrect(isOk);
    setIsChecked(true);
  };

  const handleNext = () => {
    setIsChecked(false);
    setIsCorrect(null);
    setUserInput("");
    resetTranscript();
    if (onNext) onNext(Boolean(isCorrect));
  };

  const handleMicClick = () => {
    if (isChecked || !browserSupportsSpeechRecognition) return;

    setIsListening(true);
    resetTranscript(); // Xoá transcript cũ
    SpeechRecognition.startListening({ language: "ko-KR" }); // Tiếng Hàn
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border space-y-4">
      <h3 className="text-xl font-semibold mb-3">✍️ Viết lại câu</h3>

      {question.linkMedia && (
        <div className="mb-3">
          {question.linkMedia.match(/\.(mp3|m4a|ogg)$/i) ? (
            <audio controls className="w-full rounded-md">
              <source src={question.linkMedia} type="audio/mp4" />
              Trình duyệt của bạn không hỗ trợ audio.
            </audio>
          ) : (
            <video controls className="w-full max-h-[300px] rounded-md">
              <source src={question.linkMedia} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          )}
        </div>
      )}

      <div className="border p-2 rounded mb-4 bg-gray-50">{question.originalSentence}</div>

      <div className="relative">
        <input
          type="text"
          className="w-full border rounded p-2 pr-12 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Viết lại câu hoặc sử dụng microphone..."
          value={userInput}
          disabled={isChecked}
          onChange={(e) => setUserInput(e.target.value)}
        />

        <button
          type="button"
          onClick={handleMicClick}
          disabled={isChecked}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
            isChecked
              ? "cursor-not-allowed opacity-50"
              : isListening || listening
              ? "bg-red-100 hover:bg-red-200 text-red-600 animate-pulse"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-blue-600"
          }`}
          title={isListening ? "Đang nghe..." : "Nhấn để nói"}
        >
          <Microphone size={20} weight={isListening || listening ? "fill" : "regular"} />
        </button>
      </div>

      {(isListening || listening) && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          <span>Đang nghe... Hãy nói câu trả lời của bạn</span>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!isChecked ? (
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded"
            onClick={checkAnswer}
            disabled={userInput.trim() === ""}
          >
            Kiểm tra
          </button>
        ) : (
          <button
            className={`px-4 py-2 rounded font-semibold ${
              isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
            onClick={handleNext}
          >
            Tiếp tục
          </button>
        )}
      </div>

      {isChecked && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-center space-x-3 ${
            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border">
            {isCorrect ? (
              <span className="text-green-600 text-xl font-bold">✔</span>
            ) : (
              <span className="text-red-600 text-xl font-bold">✖</span>
            )}
          </div>
          <div>
            <p className="font-bold">
              {isCorrect ? "Chính xác!" : "Đáp án mẫu:"}
            </p>
            {!isCorrect && (
              <p className="text-sm italic">{question.rewrittenSentence}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
