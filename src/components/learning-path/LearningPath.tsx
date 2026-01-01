//src/components/learning-path/LearningPath.tsx 
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AvatarImg from "../../assets/avatar_campfire.png";
import HoHan from "../../assets/hohan.png";
import HoVietNam from "../../assets/hoVietNam.png";
import { Lock, CheckCircle } from "lucide-react";

type LearningPathProps = {
  lesson: {
    lessonId: number;
    lessonName: string;
    lessonDescription?: string;
    lessonImage?: string;
    isLocked?: boolean;
    isLessonCompleted?: boolean;
  };
  lessonIdx: number;
  isActive: boolean;
  totalLessons: number;
  isLast?: boolean;
};

export default function LearningPath({ lesson, lessonIdx, isActive, isLast }: LearningPathProps) {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLButtonElement>(null);
  
  const imageList = [AvatarImg, HoHan, HoVietNam];
  
  // Zigzag pattern: chẵn = trái, lẻ = phải - offset lớn hơn để rộng rãi
  const isLeft = lessonIdx % 2 === 0;
  const offsetX = isLeft ? -130 : 130;
  
  // Mascot mỗi 3 bài
  const showMascot = lessonIdx % 3 === 0 && lessonIdx > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(e.target as Node) &&
        nodeRef.current &&
        !nodeRef.current.contains(e.target as Node)
      ) {
        setShowInfo(false);
      }
    };
    if (showInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfo]);

  const handleNodeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (lesson.isLocked) return;
    // Navigate trực tiếp vào bài học
    navigate(`/learn/lesson-detail?lessonId=${lesson.lessonId}`);
  };

  const handleStartLesson = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/learn/lesson-detail?lessonId=${lesson.lessonId}`);
  };

  // Màu sắc
  const getNodeColor = () => {
    if (lesson.isLocked) return { bg: '#E5E7EB', border: '#D1D5DB', text: '#9CA3AF' };
    if (lesson.isLessonCompleted) return { bg: '#4ADE80', border: '#22C55E', text: '#16A34A' };
    if (isActive) return { bg: '#FF6B35', border: '#FF8C5A', text: '#FF6B35' };
    return { bg: '#FCD34D', border: '#FBBF24', text: '#CA8A04' };
  };
  
  const nodeColor = getNodeColor();
  
  // Offset cho node tiếp theo (ngược lại) - phải khớp với offsetX
  const nextOffsetX = isLeft ? 130 : -130;
  const pathColor = lesson.isLocked ? '#D1D5DB' : '#FBBF24';
  
  return (
    <div className="relative" style={{ height: '160px', marginBottom: '0px' }}>
      {/* SVG Path - đường nối liền mạch */}
      {!isLast && (
        <svg 
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '105px',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '60px',
            zIndex: 0
          }}
          viewBox="0 0 500 60"
        >
          <path
            d={`
              M ${250 + offsetX} 0
              L ${250 + offsetX} 10
              Q ${250 + offsetX} 30, ${250 + offsetX + (nextOffsetX > offsetX ? 25 : -25)} 30
              L ${250 + nextOffsetX - (nextOffsetX > offsetX ? 25 : -25)} 30
              Q ${250 + nextOffsetX} 30, ${250 + nextOffsetX} 50
              L ${250 + nextOffsetX} 55
            `}
            fill="none"
            stroke={pathColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="3 10"
            opacity={lesson.isLocked ? 0.35 : 0.75}
          />
        </svg>
      )}

      {/* Main Content - Centered với offsetX */}
      <div 
        className="absolute top-0 left-1/2 flex flex-col items-center"
        style={{ transform: `translateX(calc(-50% + ${offsetX}px))` }}
      >
        {/* Node button */}
        <button
          ref={nodeRef}
          type="button"
          disabled={lesson.isLocked}
          className={`relative z-20 w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold
            transition-all duration-200 border-4 shadow-lg
            ${lesson.isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
          style={{ 
            backgroundColor: nodeColor.bg,
            borderColor: nodeColor.border
          }}
          onClick={handleNodeClick}
        >
          {lesson.isLocked ? (
            <Lock size={22} className="text-gray-500" />
          ) : lesson.isLessonCompleted ? (
            <CheckCircle size={28} strokeWidth={2.5} />
          ) : (
            <span>{lessonIdx + 1}</span>
          )}
          
          {/* Pulse animation */}
          {isActive && !lesson.isLocked && (
            <div 
              className="absolute inset-0 rounded-full animate-ping"
              style={{ backgroundColor: nodeColor.bg, opacity: 0.3 }}
            />
          )}
        </button>

        {/* Lesson name */}
        <div 
          className="mt-0 text-sm font-semibold text-center max-w-[140px] z-20 px-2 py-1 rounded"
          style={{ 
            color: lesson.isLocked ? '#9CA3AF' : '#374151'
          }}
        >
          {lesson.lessonName}
        </div>
      </div>

      {/* Mascot - phóng to x3, đặt gần node hơn */}
      {showMascot && (
        <img
          src={imageList[Math.floor(lessonIdx / 3) % imageList.length]}
          alt="mascot"
          className="absolute w-40 h-40 object-contain drop-shadow-2xl z-10"
          style={{ 
            top: '-20px',
            [isLeft ? 'right' : 'left']: '25%',
            transform: isLeft ? 'translateX(50%)' : 'translateX(-50%)'
          }}
          draggable={false}
        />
      )}

      {/* Tooltip */}
      {showInfo && !lesson.isLocked && (
        <div
          ref={tooltipRef}
          className="absolute left-1/2 z-50 bg-white rounded-2xl p-5 shadow-2xl 
            flex flex-col items-center text-center w-64 border-2"
          style={{ 
            top: '90px',
            transform: 'translateX(-50%)',
            borderColor: nodeColor.border
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow */}
          <div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rotate-45"
            style={{ borderLeft: `2px solid ${nodeColor.border}`, borderTop: `2px solid ${nodeColor.border}` }}
          />
          
          <div className="text-base font-bold text-gray-900 mb-2">{lesson.lessonName}</div>
          <div className="text-sm text-gray-600 mb-4">{lesson.lessonDescription || "Sẵn sàng học bài mới!"}</div>
          
          <button
            type="button"
            className="w-full py-3 rounded-xl font-bold text-base text-white
              hover:opacity-90 active:scale-95 transition-all shadow-md"
            style={{ backgroundColor: nodeColor.bg }}
            onClick={handleStartLesson}
          >
            Bắt đầu học →
          </button>
        </div>
      )}
    </div>
  );
}
