//src/pages/Learn/LessonDetail.tsx
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Vocabulary from "../../pages/Learn/Vocabulary";
import Grammar from "../../pages/Learn/Grammar";
import Exercise from "../../pages/Learn/Exercise";

const tabs = [
  { key: "vocab", label: "Từ vựng", icon: "📚" },
  { key: "grammar", label: "Ngữ pháp", icon: "📖" },
  { key: "exercise", label: "Bài tập", icon: "📝" },
];

export default function LessonDetail() {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const [activeTab, setActiveTab] = useState("vocab"); // mặc định Vocabulary

  if (!lessonId) return <div>Không có bài học nào.</div>;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Navigation tabs */}
      <div className="flex justify-around bg-white shadow-md rounded-xl p-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex flex-col items-center px-4 py-2 transition ${
            activeTab === tab.key ? "text-blue-600 font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <div className="text-2xl">{tab.icon}</div>
            <div className="text-sm">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Nội dung tương ứng */}
      {activeTab === "vocab" && <Vocabulary lessonId={lessonId} />}
      {activeTab === "grammar" && <Grammar lessonId={lessonId} />}
      {activeTab === "exercise" && <Exercise lessonId={lessonId} />}
    </div>
  );
}
