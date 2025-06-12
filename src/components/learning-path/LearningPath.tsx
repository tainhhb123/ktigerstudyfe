// File: src/components/learning-path/LearningPath.tsx
import { useNavigate } from "react-router";
import AvatarImg from "../../assets/avatar_campfire.png";

type LearningPathProps = {
  lesson: {
    lessonId: number;
    lessonName: string;
    lessonDescription?: string;
  };
  lessonIdx: number;
  isActive: boolean;
};

// Hàm căn lề zigzag (tuỳ chọn, bạn có thể xoá nếu không dùng)
function getOffsetClass(idx: number): string {
  if (idx % 3 === 1) return "ml-24";
  if (idx % 3 === 2) return "mr-24";
  return "mx-auto";
}

export default function LearningPath({ lesson, lessonIdx, isActive  }: LearningPathProps) {
  const navigate = useNavigate();
  const colorList = ["bg-blue-500", "bg-yellow-400", "bg-purple-500", "bg-red-500", "bg-green-500"];
  const activeColor = colorList[lessonIdx % colorList.length];
  
  return (
  <div
    className={`relative flex flex-col items-center ${getOffsetClass(lessonIdx)} cursor-pointer`}
    onClick={() => navigate(`/learn/lesson/${lesson.lessonId}`)}
  >
    {/* Avatar nếu muốn giữ */}
    <img
      src={AvatarImg}
      alt="avatar cầm lửa"
      className="w-40 h-40 object-contain drop-shadow-xl absolute -top-24 right-[-100px] z-10"
      draggable={false}
      style={{ userSelect: "none" }}
    />
  
    <div
      className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow mb-4
      ${isActive ? activeColor : "bg-gray-300"}`}
    >
      {lessonIdx + 1}
    </div>


    <div className="text-center font-semibold text-xl">{lesson.lessonName}</div>

    {/* Mô tả bài học (có thể bật lại nếu muốn) */}
    {/* {lesson.lessonDescription && (
      <div className="text-center text-gray-600 text-sm mt-1 px-2">{lesson.lessonDescription}</div>
    )} */}
  </div>
);
}
