//src/pages/Learn/LessonDetail.tsx
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
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

  if (!lessonId) return <div style={{ color: '#666666' }}>Không có bài học nào.</div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Tabs cố định phía trên */}
      <div className="fixed top-19 left-78 right-7 z-50 shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="flex justify-around w-full" style={{ borderBottom: '1px solid #BDBDBD' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className="flex-1 flex flex-col items-center py-3 transition text-sm font-medium"
              style={{
                color: activeTab === tab.key ? '#FF6B35' : '#666666',
                backgroundColor: activeTab === tab.key ? '#FFE8DC' : 'transparent',
                borderBottom: activeTab === tab.key ? '3px solid #FF6B35' : '3px solid transparent'
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              <div className="text-xl">{tab.icon}</div>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nội dung tương ứng */}
      <div className="max-w-3xl mx-auto pt-24 px-4">
        {activeTab === "vocab" && <Vocabulary lessonId={lessonId} />}
        {activeTab === "grammar" && <Grammar lessonId={lessonId} setActiveTab={setActiveTab} />}
        {activeTab === "exercise" && <Exercise lessonId={lessonId} />}
      </div>
    </div>
  );
}
