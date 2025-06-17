import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SentenceRewritingQuestion from "../../components/learning-path/SentenceRewritingQuestion";
import MultipleChoiceQuestion from "../../components/learning-path/MultipleChoiceQuestion";
import {
  getExercisesByLessonId,
  getMultipleChoiceByExerciseId,
  getSentenceRewritingByExerciseId,
} from "../../services/ExerciseApi";
import { saveUserExerciseResult } from "../../services/UserExerciseResultApi";

interface MultipleChoiceQuestion {
  questionId: number;
  exerciseId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
}

interface SentenceRewritingQuestion {
  questionId: number;
  exerciseId: number;
  originalSentence: string;
  rewrittenSentence: string;
}

type QuestionItem =
  | { type: "multiple"; data: MultipleChoiceQuestion; exerciseId: number }
  | { type: "rewrite"; data: SentenceRewritingQuestion; exerciseId: number };

// Component
export default function Exercise({
  lessonId,
  userId: userIdProp,
}: {
  lessonId: string;
  userId?: number;
}) {
  // ✅ Lấy userId rõ ràng ngay khi component render
  const userId = typeof userIdProp === "number" && !isNaN(userIdProp)
    ? userIdProp
    : Number(localStorage.getItem("userId"));

  // DEBUG mạnh mẽ
  console.log("userId lấy từ prop:", userIdProp);
  console.log("userId lấy từ localStorage:", localStorage.getItem("userId"));
  console.log("userId sử dụng:", userId);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentList, setCurrentList] = useState<QuestionItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [wrongList, setWrongList] = useState<QuestionItem[]>([]);
  const [phase, setPhase] = useState<"main" | "review" | "done">("main");
  const [questionKey, setQuestionKey] = useState(0);

  const correctCountFirst = useRef<Map<number, number>>(new Map());
  const finishedFirstRound = useRef(false);
  const pendingSavedExercises = useRef<Set<number>>(new Set());

  // Lấy danh sách câu hỏi
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
          mcq.forEach((q: any) => {
            allQuestions.push({
              type: "multiple",
              data: { ...q },
              exerciseId: ex.exerciseId,
            });
          });
          rewrite.forEach((q: any) => {
            allQuestions.push({
              type: "rewrite",
              data: { ...q },
              exerciseId: ex.exerciseId,
            });
          });
        }
        setQuestions(allQuestions);
        setCurrentList(allQuestions);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu bài tập:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [lessonId]);

  // Lưu kết quả nếu userId hợp lệ
  useEffect(() => {
    if (
      phase === "done" &&
      questions.length > 0 &&
      userId &&
      !isNaN(userId)
    ) {
      const groups: { [exerciseId: number]: QuestionItem[] } = {};
      questions.forEach((q) => {
        const eid = q.exerciseId;
        if (!groups[eid]) groups[eid] = [];
        groups[eid].push(q);
      });

      Object.entries(groups).forEach(([eidStr, qArr]) => {
        const eid = Number(eidStr);
        if (pendingSavedExercises.current.has(eid)) return;
        const correct = correctCountFirst.current.get(eid) || 0;
        const total = qArr.length;
        const score = Math.round((correct / total) * 100);
        saveUserExerciseResult({
          userId,
          exerciseId: eid,
          score,
          dateComplete: new Date().toISOString(),
        })
          .then(() => {
            pendingSavedExercises.current.add(eid);
          })
          .catch(console.error);
      });
    }
  }, [phase, questions.length, userId]);

  const handleAnswer = (isCorrect: boolean) => {
    const curQuestion = currentList[currentIdx];
    const eid = curQuestion.exerciseId;

    if (phase === "main" && !finishedFirstRound.current) {
      if (isCorrect) {
        correctCountFirst.current.set(
          eid,
          (correctCountFirst.current.get(eid) || 0) + 1
        );
      }
    }

    if (!isCorrect) setWrongList((list) => [...list, curQuestion]);

    if (currentIdx + 1 < currentList.length) {
      setCurrentIdx((idx) => idx + 1);
      setQuestionKey((k) => k + 1);
    } else {
      if (phase === "main") {
        finishedFirstRound.current = true;
        if (wrongList.length + (isCorrect ? 0 : 1) > 0) {
          const newWrongList = [...wrongList];
          if (!isCorrect) newWrongList.push(curQuestion);
          setCurrentList(newWrongList);
          setWrongList([]);
          setCurrentIdx(0);
          setPhase("review");
          setQuestionKey((k) => k + 1);
        } else {
          setPhase("done");
        }
      } else {
        if (wrongList.length + (isCorrect ? 0 : 1) > 0) {
          const newWrongList = [...wrongList];
          if (!isCorrect) newWrongList.push(curQuestion);
          setCurrentList(newWrongList);
          setWrongList([]);
          setCurrentIdx(0);
          setQuestionKey((k) => k + 1);
        } else {
          setPhase("done");
        }
      }
    }
  };

  if (loading || !currentList[currentIdx]) return <p>Đang tải câu hỏi...</p>;

  // Nếu không có userId hợp lệ thì cảnh báo (và không gọi lưu điểm)
  if (!userId || isNaN(userId)) {
    return (
      <div className="text-center text-red-600 font-bold mt-10">
        Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.<br />
        (userId không hợp lệ)
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          🎉 Hoàn thành bài tập!
        </h2>
        <div className="mb-2">
          {Object.entries(
            questions.reduce<{ [eid: number]: number }>((acc, q) => {
              const eid = q.exerciseId;
              acc[eid] = (acc[eid] || 0) + 1;
              return acc;
            }, {})
          ).map(([eid, total]) => (
            <div key={eid}>
              Bài tập ID <b>{eid}</b>: Đúng lần đầu:{" "}
              <b>
                {correctCountFirst.current.get(+eid) || 0}/{total} (
                {Math.round(
                  ((correctCountFirst.current.get(+eid) || 0) / total) * 100
                )}
                %)
              </b>
            </div>
          ))}
        </div>
        <div className="mb-4 text-gray-500 text-sm">
          Tất cả câu hỏi đã được làm đúng, bạn đã hoàn thành bài tập này.
        </div>
      </div>
    );
  }

  const current = currentList[currentIdx];

  return (
    <div className="p-4 space-y-4">
      <div className="mb-2 text-sm text-gray-500">
        Câu {currentIdx + 1} / {currentList.length}{" "}
        {phase === "review" && <span>(Làm lại các câu sai)</span>}
      </div>
      <AnimatePresence mode="wait">
        {current.type === "multiple" && (
          <MultipleChoiceQuestion
            question={current.data}
            onNext={handleAnswer}
            key={questionKey}
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
              onNext={handleAnswer}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
