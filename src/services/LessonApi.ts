import axios from "axios";

// Lấy danh sách bài học theo level
export async function getLessonsByLevelId(levelId: string | number) {
  const res = await axios.get(`http://localhost:8080/api/lessons?levelId=${levelId}`);
  return res.data; // [{lessonId, levelId, lessonName, lessonDescription}]
}

// ✅ Lấy danh sách bài học theo level + kèm tiến độ user
export async function getLessonsByLevelIdWithProgress(levelId: string | number, userId: string | number) {
  const res = await axios.get("http://localhost:8080/api/lessons/progress", {
    params: {
      levelId,
      userId,
    },
  });
  return res.data; // [{lessonId, lessonName, isLessonCompleted, isLocked, ...}]
}

// ✅ Gửi dữ liệu đúng format
export async function completeLesson(userId: number, lessonId: number, score: number) {
  const res = await axios.post("http://localhost:8080/api/lessons/complete", {
    userId,
    lessonId,
    score
  });
  return res.data;
}
