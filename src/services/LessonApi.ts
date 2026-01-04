//src/services/LessonApi.ts
import axiosInstance from "./axiosConfig";

// Lấy danh sách bài học theo level
export async function getLessonsByLevelId(levelId: string | number) {
  const res = await axiosInstance.get(`/api/lessons?levelId=${levelId}`);
  return res.data; // [{lessonId, levelId, lessonName, lessonDescription}]
}

// ✅ Lấy danh sách bài học theo level + kèm tiến độ user
export async function getLessonsByLevelIdWithProgress(levelId: string | number, userId: string | number) {
  const res = await axiosInstance.get("/api/lessons/progress", {
    params: {
      levelId,
      userId,
    },
  });
  return res.data; // [{lessonId, lessonName, isLessonCompleted, isLocked, ...}]
}

// ✅ Gửi dữ liệu đúng format
export async function completeLesson(userId: number, lessonId: number, score: number) {
  const res = await axiosInstance.post("/api/lessons/complete", null, {
    params: { userId, lessonId, score },
  });
  return res.data;
}