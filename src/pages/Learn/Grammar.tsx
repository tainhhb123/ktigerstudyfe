// src/pages/Learn/Grammar.tsx
import { useEffect, useState } from "react";
import { getGrammarByLessonId } from "../../services/GrammarApi";

interface GrammarTheory {
  grammarId: number;
  grammarTitle: string;
  grammarContent: string;
  grammarExample: string;
}

export default function Grammar({ lessonId }: { lessonId: string }) {
  const [grammars, setGrammars] = useState<GrammarTheory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGrammarByLessonId(lessonId)
      .then(setGrammars)
      .catch((err) => console.error("Failed to fetch grammar:", err))
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading) return <div className="text-center py-8">Đang tải ngữ pháp...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📖 Ngữ pháp</h2>
      {grammars.length === 0 && <p>Không có dữ liệu ngữ pháp.</p>}

      <div className="space-y-6">
        {grammars.map((g) => (
          <div
            key={g.grammarId}
            className="border rounded-xl shadow p-5 bg-gray-50 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-2">🔹 {g.grammarTitle}</h3>

            <div className="bg-white rounded-lg p-4 border mb-3">
              <p className="text-sm text-gray-800 whitespace-pre-line">
                <strong className="block text-gray-600 mb-1">📘 Nội dung:</strong>
                {g.grammarContent}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-gray-800 whitespace-pre-line">
                <strong className="block text-gray-600 mb-1">💡 Ví dụ:</strong>
                {g.grammarExample}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
