
//src/pages/Learn/Lesson.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LearningPath from "../../components/learning-path/LearningPath";
import RoadmapFooter from "../../components/learning-path/RoadmapFooter";
import { getLessonsByLevelIdWithProgress } from "../../services/LessonApi";

function StickyRoadmapHeader({
  section,
  title,
  onGuide,
}: {
  section: string;
  title: string;
  onGuide: () => void;
  bgColorClass?: string;
}) {
  return (
    <div className="sticky top-[75px] z-50 w-full">
      <div
        className="px-6 py-5 rounded-b-2xl shadow-lg flex items-center justify-between transition-colors duration-500 text-xl font-semibold"
        style={{ backgroundColor: '#FF6B35' }}
      >
        <div className="font-bold text-white">{section}</div>
        <button
          className="text-xs px-4 py-2 rounded font-bold transition-colors"
          style={{ backgroundColor: '#FFFFFF', color: '#FF6B35' }}
          onClick={onGuide}
        >
          Hướng dẫn
        </button>
      </div>
      <div className="px-6 py-2" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="font-semibold text-base" style={{ color: '#333333' }}>{title}</div>
      </div>
    </div>
  );
}

export default function Lesson() {
  const [searchParams] = useSearchParams();
  const levelId = searchParams.get("levelId");
  const userId = Number(localStorage.getItem("userId"));

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<any>(null);
  
  // ✅ Thêm state để hiển thị thông báo completion
  const [completionMessage, setCompletionMessage] = useState<string>("");
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  // ✅ Tách logic fetch thành function riêng
  const fetchLessons = () => {
    if (levelId && userId) {
      setLoading(true);
      console.log("📊 Fetching lessons for levelId:", levelId, "userId:", userId);
      
      getLessonsByLevelIdWithProgress(levelId, userId)
        .then((data) => {
          console.log("📊 API Response:", data);
          
          // Kiểm tra nếu data không phải là array hoặc rỗng
          if (!Array.isArray(data)) {
            console.error("❌ API response is not an array:", data);
            setLessons([]);
            return;
          }
          
          if (data.length === 0) {
            console.warn("⚠️ No lessons found for this level");
            setLessons([]);
            return;
          }

          // ⭐ Chuyển key locked → isLocked, lessonCompleted → isLessonCompleted
          const mappedLessons = data.map((item: any) => ({
            ...item,
            isLocked: item.locked,                  // FE dùng isLocked
            isLessonCompleted: item.lessonCompleted // FE dùng isLessonCompleted
          }));
          
          console.log("📊 Mapped lessons:", mappedLessons);
          setLessons(mappedLessons);
          setCurrent(mappedLessons[0]);
        })
        .catch((error) => {
          console.error("❌ Error fetching lessons:", error);
          setLessons([]);
        })
        .finally(() => setLoading(false));
    } else {
      console.warn("⚠️ Missing levelId or userId:", { levelId, userId });
      setLoading(false);
    }
  };

  // ✅ useEffect ban đầu
  useEffect(() => {
    console.log("🔍 DEBUG - useEffect triggered with:", { levelId, userId });
    fetchLessons();
  }, [levelId, userId]);

  // ✅ Thêm listener để refresh khi hoàn thành bài học
  useEffect(() => {
    const handleLessonCompleted = (event: any) => {
      console.log("🎉 Lesson completed event received:", event.detail);
      
      const { lessonId, isFirstTime, xpAdded, score } = event.detail;
      
      // ✅ Hiển thị thông báo phù hợp
      if (isFirstTime && xpAdded) {
        setCompletionMessage(`🎉 Chúc mừng! Bạn đã hoàn thành bài học và nhận được ${score} XP!`);
      } else {
        setCompletionMessage(`✅ Bài học đã hoàn thành trước đó. Điểm số: ${score} (không có XP bổ sung)`);
      }
      
      // ✅ Hiển thị thông báo
      setShowCompletionMessage(true);
      
      // ✅ Ẩn thông báo sau 4 giây
      setTimeout(() => {
        setShowCompletionMessage(false);
        setCompletionMessage("");
      }, 4000);
      
      // ✅ Refresh danh sách bài học để cập nhật trạng thái
      fetchLessons();
    };

    // Lắng nghe event từ Exercise.tsx
    window.addEventListener('lessonCompleted', handleLessonCompleted);
    
    return () => {
      window.removeEventListener('lessonCompleted', handleLessonCompleted);
    };
  }, [levelId, userId]);

  // Thay đổi bài học hiện tại theo scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!lessons.length) return;
      for (let i = lessons.length - 1; i >= 0; i--) {
        const el = document.getElementById(`lesson-${lessons[i].lessonId}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 500) {
            setCurrent(lessons[i]);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // khởi tạo lần đầu
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lessons]);

  if (loading)
    return <div className="text-center py-20" style={{ color: '#666666' }}>Đang tải bài học...</div>;
  
  console.log("📊 Current lessons state:", lessons, "Length:", lessons.length);
  
  if (!lessons.length)
    return <div className="text-center py-20" style={{ color: '#666666' }}>Không có bài học nào cho cấp độ này!</div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      {/* ✅ Thông báo completion */}
      {showCompletionMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[60] animate-bounce">
          <div 
            className="text-white px-6 py-4 rounded-xl shadow-2xl max-w-md mx-auto text-center"
            style={{ background: 'linear-gradient(to right, #4CAF50, #FF6B35)' }}
          >
            <div className="font-bold text-lg mb-1">
              {completionMessage.includes("🎉") ? "🎉 Hoàn thành!" : "✅ Đã hoàn thành"}
            </div>
            <div className="text-sm opacity-90">
              {completionMessage}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <StickyRoadmapHeader
        section={current ? `Bài số ${lessons.indexOf(current) + 1}` : ""}
        title={current ? current.lessonName : ""}
        onGuide={() => alert("Xem hướng dẫn")}

      />

      {/* Danh sách bài học */}
      {lessons.map((lesson, idx) => (
        <div
          key={lesson.lessonId}
          id={`lesson-${lesson.lessonId}`}
          className="max-w-xl mx-auto pb-10"
        >
          <LearningPath
            lesson={lesson}
            lessonIdx={idx}
            isActive={lesson.lessonId === current?.lessonId}
          />
          <RoadmapFooter text={lesson.lessonDescription || ""} />
        </div>
      ))}
    </div>
  );
}
