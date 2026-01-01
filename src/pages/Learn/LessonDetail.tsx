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
      {/* Tabs - Sticky với max-width */}
      <div className="sticky top-0 z-40 w-full" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <div 
            className="flex rounded-2xl p-1.5 shadow-sm"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 text-sm font-semibold ${
                  activeTab === tab.key 
                    ? 'shadow-md transform scale-[1.02]' 
                    : 'hover:bg-gray-50'
                }`}
                style={{
                  color: activeTab === tab.key ? '#FFFFFF' : '#666666',
                  backgroundColor: activeTab === tab.key ? '#FF6B35' : 'transparent',
                }}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nội dung tương ứng */}
      <div className="max-w-3xl mx-auto pt-6 px-4 pb-8">
        {activeTab === "vocab" && <Vocabulary lessonId={lessonId} />}
        {activeTab === "grammar" && <Grammar lessonId={lessonId} setActiveTab={setActiveTab} />}
        {activeTab === "exercise" && <Exercise lessonId={lessonId} />}
      </div>
    </div>
  );
}
