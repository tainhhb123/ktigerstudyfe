//src/components/learning-path/LearningPath.tsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AvatarImg from "../../assets/avatar_campfire.png";
import HoHan from "../../assets/hohan.png";
import HoVietNam from "../../assets/hoVietNam.png";

type LearningPathProps = {
  lesson: {
    lessonId: number;
    lessonName: string;
    lessonDescription?: string;
    lessonImage?: string;
  };
  lessonIdx: number;
  isActive: boolean;
};

function getOffsetClass(idx: number): string {
  if (idx % 3 === 1) return "ml-24";
  if (idx % 3 === 2) return "mr-24";
  return "mx-auto";
}

export default function LearningPath({ lesson, lessonIdx, isActive }: LearningPathProps) {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const colorList = ["bg-blue-500", "bg-yellow-400", "bg-purple-500", "bg-red-500", "bg-green-500"];
  const imageList = [AvatarImg, HoHan, HoVietNam ];
  const activeColor = colorList[lessonIdx % colorList.length];
  const tooltipRef = useRef<HTMLDivElement>(null);

  //Đóng tooltip khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowInfo(false);
      }
    };

    if (showInfo) {
      window.addEventListener("mousedown", handleClickOutside);
      // Bắt đầu animation sau một tick
      setTimeout(() => setTooltipVisible(true), 10);
    } else {
      setTooltipVisible(false);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfo]);

  return (
    <div className={`relative flex flex-col items-center ${getOffsetClass(lessonIdx)} mt-10`}>
     <img
        src={imageList[lessonIdx % imageList.length]} 
        alt="lesson"
        className="w-40 h-40 object-contain drop-shadow-xl absolute -top 28 right-[-100px] z-10"
        draggable={false}
        style={{ userSelect: "none" }}
      />

      {/* Nút chính */}
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow mb-4 cursor-pointer transform transition-all duration-150 active:scale-95 hover:scale-120
        ${isActive ? activeColor : "bg-gray-300"}`}
        onClick={() => setShowInfo(!showInfo)}
      >
        {lessonIdx + 1}
      </div>

      {/* Tên bài */}
      <div className="text-center font-semibold text-xl">{lesson.lessonName}</div>

      {/* Tooltip nổi */}
      {showInfo && (
        <div
          ref={tooltipRef}
          className={`absolute top-24 left-1/2 -translate-x-1/2 z-50 rounded-xl p-4 text-white shadow-xl ${activeColor} flex flex-col items-center text-center max-w-sm transition-all duration-300 ease-out
          ${tooltipVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-inherit" />
          <div className="text-sm font-bold mb-2">{lesson.lessonDescription || "Không có mô tả."}</div>
          <button
            className="bg-white text-sm font-bold rounded-full px-4 py-1 text-green-600 hover:bg-gray-100 transition"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/learn/lesson-detail?lessonId=${lesson.lessonId}`);
            }}
          >
            BẮT ĐẦU
          </button>
        </div>
      )}
    </div>
  );
}
