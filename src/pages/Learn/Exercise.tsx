import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SentenceRewritingQuestion from "../../components/learning-path/SentenceRewritingQuestion";
import MultipleChoiceQuestion from "../../components/learning-path/MultipleChoiceQuestion";

import {
  getExercisesByLessonId,
  getMultipleChoiceByExerciseId,
  getSentenceRewritingByExerciseId,
} from "../../services/ExerciseApi";

interface MultipleChoiceQuestion {
  questionId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
}

interface SentenceRewritingQuestion {
  questionId: number;
  originalSentence: string;
  rewrittenSentence: string;
}

type QuestionItem =
  | { type: "multiple"; data: MultipleChoiceQuestion }
  | { type: "rewrite"; data: SentenceRewritingQuestion };

export default function Exercise({ lessonId }: { lessonId: string }) {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionKey, setQuestionKey] = useState(0);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const exercises = await getExercisesByLessonId(lessonId);
        const allQuestions: QuestionItem[] = [];

        for (const ex of exercises) {
          const [mcq, rewrite] = await Promise.all([
            getMultipleChoiceByExerciseId(ex.exerciseId),
            getSentenceRewritingByExerciseId(ex.exerciseId),
          ]);

          mcq.forEach((q: MultipleChoiceQuestion) => {
            allQuestions.push({ type: "multiple", data: q });
          });

          rewrite.forEach((q: SentenceRewritingQuestion) => {
            allQuestions.push({ type: "rewrite", data: q });
          });
        }

        setQuestions(allQuestions);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu bài tập:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [lessonId]);

  const handleCheck = () => {
    const current = questions[currentIdx];
    if (current?.type === "multiple") {
      const isCorrect = selectedAnswer === current.data.correctAnswer;
      setIsCorrect(isCorrect);
      setIsChecked(true);
    }
  };

  const nextQuestion = () => {
    setIsChecked(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
    setCurrentIdx((prev) => {
      setQuestionKey(qk => qk + 1); // trigger remount animation
      return prev + 1 < questions.length ? prev + 1 : prev;
    });
  };

  const current = questions[currentIdx];
  if (loading || !current) return <p>Đang tải câu hỏi...</p>;

  return (
    <div className="p-4 space-y-4">
      <AnimatePresence mode="wait">
        {current.type === "multiple" && (
          <MultipleChoiceQuestion
            question={current.data}
            onNext={nextQuestion}
          />
        )}

        {current.type === "rewrite" && (
          <motion.div
            key={questionKey}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -32 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <SentenceRewritingQuestion
              question={current.data}
              onNext={nextQuestion}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
