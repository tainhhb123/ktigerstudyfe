//src/pages/Learn/Exercise.tsx
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
import { completeLesson } from "../../services/LessonApi";
import SimpleRewardPopup from "../../components/learning-path/SimpleRewardPopup";


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

export default function Exercise({
  lessonId,
  userId: userIdProp,
}: {
  lessonId: string;
  userId?: number;
}) {
  const userId = typeof userIdProp === "number" && !isNaN(userIdProp)
    ? userIdProp
    : Number(localStorage.getItem("userId"));

  const [questions, setQuestions] = useState<QuestionItem[]>([]);     // Tất cả câu hỏi
  const [loading, setLoading] = useState(true);
  const [currentList, setCurrentList] = useState<QuestionItem[]>([]);  // Danh sách đang làm
  const [currentIdx, setCurrentIdx] = useState(0);                    // Câu hiện tại
  const [wrongList, setWrongList] = useState<QuestionItem[]>([]);     // Câu sai
  const [phase, setPhase] = useState<"main" | "review" | "done">("main"); // Giai đoạn
  const [questionKey, setQuestionKey] = useState(0);
  
  // ➕ Popup rewards
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [rewardData, setRewardData] = useState<{
    xpGained: number;
    isLevelUp: boolean;
    levelNumber?: number;
    levelTitle?: string;
    levelBadge?: string;
  } | null>(null);

  // Refs để lưu trữ không bị reset khi re-render
  const correctCountFirst = useRef<Map<number, number>>(new Map());   // Đếm câu đúng lần đầu
  const finishedFirstRound = useRef(false);                           // Đã làm xong lượt đầu
  const pendingSavedExercises = useRef<Set<number>>(new Set());       // Bài đã lưu
  const prevLevelRef = useRef<number | null>(null);                   // Level cũ để check level up

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

  // ✅ Thay thế useEffect cũ bằng logic mới
  useEffect(() => {
    if (phase === "done" && questions.length > 0 && userId && !isNaN(userId)) {
      const processCompletion = async () => {
        try {
          // 1. Lưu kết quả từng exercise vào UserExerciseResult
          const groups: { [exerciseId: number]: QuestionItem[] } = {};
          questions.forEach((q) => {
            const eid = q.exerciseId;
            if (!groups[eid]) groups[eid] = [];
            groups[eid].push(q);
          });
          
          const exerciseScores: number[] = [];
          
          // Lưu kết quả từng exercise
          for (const [eidStr, qArr] of Object.entries(groups)) {
            const eid = Number(eidStr);
            if (pendingSavedExercises.current.has(eid)) continue;
            
            const correct = correctCountFirst.current.get(eid) || 0;
            const total = qArr.length;
            const exerciseScore = Math.round((correct / total) * 100);
            
            exerciseScores.push(exerciseScore);
            
            // Lưu vào UserExerciseResult
            await saveUserExerciseResult({
              userId,
              exerciseId: eid,
              score: exerciseScore,
              dateComplete: new Date().toISOString(),
            });
            
            pendingSavedExercises.current.add(eid);
          }
          
          // 2. Tính điểm trung bình cho lesson
          const lessonScore = Math.round(
            exerciseScores.reduce((sum, score) => sum + score, 0) / exerciseScores.length
          );

          // 3. ✅ Gọi API hoàn thành lesson (sẽ kiểm tra và chỉ cộng XP nếu lần đầu)
          console.log("🔍 Calling completeLesson API...");
          const result = await completeLesson(userId, Number(lessonId), lessonScore);
          
          console.log("🔍 completeLesson result:", result);
          console.log("📊 XP Added:", result.xpAdded);
          console.log("📊 XP Data:", result.xpData);
          console.log("📊 Is First Time:", result.isFirstTime);
          
          // 4. Hiển thị popup reward - LUÔN hiển thị dù XP = 0 hoặc đã làm rồi
          const xpGained = result.xpAdded || 0;
          const xpData = result.xpData;
          const isLevelUp = xpData && xpData.levelNumber > (prevLevelRef.current || 0);
          
          console.log("🎯 Setting reward data:", { xpGained, isLevelUp });
          
          setRewardData({
            xpGained: xpGained,
            isLevelUp: isLevelUp,
            levelNumber: isLevelUp ? xpData.levelNumber : undefined,
            levelTitle: isLevelUp ? xpData.currentTitle : undefined,
            levelBadge: isLevelUp ? xpData.currentBadge : undefined,
          });
          setShowRewardPopup(true);
          
          if (isLevelUp && xpData) {
            prevLevelRef.current = xpData.levelNumber;
          }
          
          // 5. ✅ Emit event để Lesson.tsx refresh và hiển thị thông báo
          window.dispatchEvent(new CustomEvent('lessonCompleted', {
            detail: { 
              lessonId: Number(lessonId), 
              isFirstTime: result.isFirstTime,
              xpAdded: result.xpAdded,
              score: lessonScore
            }
          }));
          
        } catch (error) {
          console.error('❌ Error completing lesson:', error);
        }
      };
      
      processCompletion();
    }
  }, [phase, questions.length, userId, lessonId]);

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

  if (loading || !currentList[currentIdx]) return <p style={{ color: '#666666' }}>Đang tải câu hỏi...</p>;
  const current = currentList[currentIdx];

  if (!userId || isNaN(userId)) {
    return (
      <div className="text-center font-bold mt-10" style={{ color: '#FF5252' }}>
        Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.<br />
        (userId không hợp lệ)
      </div>
    );
  }

  return (
    <>
      {/* Popup reward nhỏ gọn */}
      {showRewardPopup && rewardData && (
        <SimpleRewardPopup
          xpGained={rewardData.xpGained}
          isLevelUp={rewardData.isLevelUp}
          levelNumber={rewardData.levelNumber}
          levelTitle={rewardData.levelTitle}
          levelBadge={rewardData.levelBadge}
          onClose={() => {
            setShowRewardPopup(false);
            setRewardData(null);
          }}
        />
      )}
      {/* Phần chính */}
      {phase === "done" ? (
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#4CAF50' }}>
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
              <div key={eid} style={{ color: '#333333' }}>
                Bài tập ID <b>{eid}</b>: Đúng lần đầu:{" "}
                <b style={{ color: '#FF6B35' }}>
                  {correctCountFirst.current.get(+eid) || 0}/{total} ({
                    Math.round(
                      ((correctCountFirst.current.get(+eid) || 0) / total) * 100
                    )
                  }
                  %)
                </b>
              </div>
            ))}
          </div>
          <div className="mb-4 text-sm" style={{ color: '#666666' }}>
            Tất cả câu hỏi đã được làm đúng, bạn đã hoàn thành bài tập này.
          </div>
        </div>
      ) : (
        // Câu hỏi bình thường
        <div className="p-4 space-y-4">
          <div className="mb-2 text-sm" style={{ color: '#666666' }}>
            Câu {currentIdx + 1} / {currentList.length} {phase === "review" && <span style={{ color: '#FF6B35' }}>(Làm lại các câu sai)</span>}
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
      )}
    </>
  );
}
