//src/components/learning-path/MultipleChoiceQuestion.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MultipleChoiceQuestionProps {
  question: {
    questionId: number;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
  };
  onNext?: (isCorrect: boolean) => void; 
}

export default function MultipleChoiceQuestion({ question, onNext }: MultipleChoiceQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleCheck = () => {
    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setIsChecked(true);
  };

  const handleNext = () => {
    setIsChecked(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
    if (onNext) onNext(Boolean(isCorrect));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -32 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-white p-5 rounded-xl shadow border space-y-4"
    >
      <motion.h3
        className="text-xl font-semibold"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {question.questionText}
      </motion.h3>
      <div className="grid grid-cols-2 gap-3">
        {["A", "B", "C", "D"].map((opt, idx) => {
          const optionKey = `option${opt}` as keyof typeof question;
          return (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.04 }}
              className={`border rounded-lg py-2 px-4 transition-colors duration-300 focus:outline-none ${selectedAnswer === opt ? "bg-blue-200" : "hover:bg-blue-100"}`}
              onClick={() => setSelectedAnswer(opt)}
              disabled={isChecked}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.06 }}
            >
              <strong>{opt}.</strong> {question[optionKey]}
            </motion.button>
          );
        })}
      </div>
      <div className="flex justify-between mt-4">
        <motion.button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={handleNext}
          disabled={isChecked === false}
          whileTap={{ scale: 0.98 }}
        >
          Bỏ qua
        </motion.button>
        <motion.button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleCheck}
          disabled={!selectedAnswer || isChecked}
          whileTap={{ scale: 0.98 }}
        >
          Kiểm tra
        </motion.button>
      </div>
      <AnimatePresence>
        {isChecked && (
          <motion.div
            key={"resultbox"}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className={`mt-4 p-4 rounded-lg flex items-center justify-between ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border">
                {isCorrect ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-600 text-xl font-bold"
                  >✔</motion.span>
                ) : (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-red-600 text-xl font-bold"
                  >✖</motion.span>
                )}
              </div>
              <div>
                <p className="font-bold">
                  {isCorrect ? "Tuyệt vời!" : "Đáp án đúng:"}
                </p>
                {!isCorrect && (
                  <p className="text-sm italic">
                    {question[`option${question.correctAnswer}` as keyof typeof question]}
                  </p>
                )}
              </div>
            </div>
            <motion.button
              className={`px-4 py-2 rounded font-semibold ${isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
              onClick={handleNext}
              whileTap={{ scale: 0.97 }}
            >
              Tiếp tục
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
