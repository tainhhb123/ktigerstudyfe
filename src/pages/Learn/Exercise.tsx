// src/pages/Learn/Exercise.tsx
import { useEffect, useState } from "react";
import axios from "axios";

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

export default function ExerciseSection({ lessonId }: { lessonId: string }) {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await axios.get(`/api/exercises/lesson/${lessonId}`);
        const exercises = res.data;

        const allQuestions: QuestionItem[] = [];

        for (const ex of exercises) {
          const [mcqRes, rewriteRes] = await Promise.all([
            axios.get(`/api/mcq/exercise/${ex.exerciseId}`),
            axios.get(`/api/sentence-rewriting/exercise/${ex.exerciseId}`),
          ]);

          mcqRes.data.forEach((q: MultipleChoiceQuestion) => {
            allQuestions.push({ type: "multiple", data: q });
          });

          rewriteRes.data.forEach((q: SentenceRewritingQuestion) => {
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

  if (loading) return <p className="text-center py-8 text-gray-500">Đang tải dữ liệu bài tập...</p>;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">📝 Bài tập</h2>

      {questions.map((q, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-300"
        >
          {q.type === "multiple" ? (
            <>
              <p className="text-blue-700 font-semibold mb-2">🔘 Câu hỏi trắc nghiệm:</p>
              <p className="text-gray-800 mb-3">{q.data.questionText}</p>
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700 pl-4">
                <li><strong>A.</strong> {q.data.optionA}</li>
                <li><strong>B.</strong> {q.data.optionB}</li>
                <li><strong>C.</strong> {q.data.optionC}</li>
                <li><strong>D.</strong> {q.data.optionD}</li>
              </ul>
            </>
          ) : (
            <>
              <p className="text-purple-700 font-semibold mb-2">✍️ Viết lại câu:</p>
              <p className="text-gray-600">Câu gốc: <span className="text-black">{q.data.originalSentence}</span></p>
              <p className="text-gray-600">Viết lại: <span className="text-black">{q.data.rewrittenSentence}</span></p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
