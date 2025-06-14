import { useState } from "react";

interface SentenceRewritingQuestionProps {
  question: {
    questionId: number;
    originalSentence: string;
    rewrittenSentence: string;
    linkMedia?: string;
  };
  onNext?: () => void;
}

export default function SentenceRewritingQuestion({ question, onNext }: SentenceRewritingQuestionProps) {
  const [userInput, setUserInput] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // So sánh đơn giản: Chuẩn hóa chữ hoa/thường và xóa khoảng trắng 2 đầu
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
    onNext && onNext();
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border space-y-4">
      <h3 className="text-xl font-semibold mb-3">✍️ Viết lại câu</h3>
      <p className="text-gray-700 mb-2">Câu gốc:</p>
      <div className="border p-2 rounded mb-4 bg-gray-50">{question.originalSentence}</div>
      <input
        type="text"
        className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        placeholder="Viết lại câu của bạn..."
        value={userInput}
        disabled={isChecked}
        onChange={e => setUserInput(e.target.value)}
      />
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
            className={`px-4 py-2 rounded font-semibold ${isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
            onClick={handleNext}
          >
            Tiếp tục
          </button>
        )}
      </div>
      {isChecked && (
        <div className={`mt-4 p-4 rounded-lg flex items-center space-x-3 ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
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
