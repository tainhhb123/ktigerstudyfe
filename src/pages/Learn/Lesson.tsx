//src/pages/Learn/Lesson.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LearningPath from "../../components/learning-path/LearningPath";
import RoadmapFooter from "../../components/learning-path/RoadmapFooter";
import { getLessonsByLevelId} from "../../services/LessonApi";

function StickyRoadmapHeader({ section, title, onGuide, bgColorClass }: { section: string, title: string, onGuide: () => void,  bgColorClass: string; }) {
  return (
    <div className={`sticky top-[75px] z-50 w-full`}>
      <div className={`${bgColorClass} px-4 py-3 rounded-b-xl shadow-md flex items-center justify-between transition-colors duration-500`}>
        <div className="font-bold text-white">{section}</div>
        <button
          className="bg-white text-xs px-4 py-2 rounded font-bold"
          onClick={onGuide}
        >
          Hướng dẫn
        </button>
      </div>
      <div className="bg-white px-6 py-2">
        <div className="font-semibold text-base text-gray-700">{title}</div>
      </div>
    </div>
  );
}


export default function Lesson() {
  const colorList = ["bg-blue-500", "bg-yellow-400", "bg-purple-500", "bg-red-500", "bg-green-500"];

  const [searchParams] = useSearchParams();
  const levelId = searchParams.get("levelId");
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<any>(null);

  useEffect(() => {
    if (levelId) {
      setLoading(true);
      getLessonsByLevelId(levelId)
        .then(data => {
          setLessons(data);
          setCurrent(data[0]);
        })
        .finally(() => setLoading(false));
    }
  }, [levelId]);

  useEffect(() => {
    const handleScroll = () => {
      if (!lessons.length) return;
      for (let i = lessons.length - 1; i >= 0; i--) {
        const el = document.getElementById(`lesson-${lessons[i].lessonId}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 400) {
            setCurrent(lessons[i]);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // init
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lessons]);

  if (loading) return <div className="text-center py-20">Đang tải bài học...</div>;
  if (!lessons.length) return <div className="text-center py-20">Không có bài học nào cho cấp độ này!</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky Header */}
      <StickyRoadmapHeader
        section={current ? `Bài số ${lessons.indexOf(current) + 1}` : ""}
        title={current ? current.lessonName : ""}
        onGuide={() => alert("Xem hướng dẫn")}  
        bgColorClass={current ? colorList[lessons.indexOf(current) % colorList.length] : "bg-blue-500"}
      />

      {/* Danh sách bài học */}
      {lessons.map((lesson, idx) => (
        <div key={lesson.lessonId} id={`lesson-${lesson.lessonId}`} className="max-w-xl mx-auto pb-32">
          {/* Truyền idx cho LearningPath nếu cần, hoặc truyền lesson nếu muốn */}
          <LearningPath 
          lesson={lesson} 
          lessonIdx={idx}
          isActive={lesson.lessonId === current?.lessonId} />
          <RoadmapFooter text={lesson.lessonDescription || ""} />
        </div>
      ))}
    </div>
  );
}
