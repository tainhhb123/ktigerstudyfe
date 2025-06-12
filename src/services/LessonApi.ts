import axios from "axios";

export async function getLessonsByLevelId(levelId: string | number) {
  const res = await axios.get(`http://localhost:8080/api/lessons?levelId=${levelId}`);
  return res.data; // [{lessonId, levelId, lessonName, lessonDescription}]
}