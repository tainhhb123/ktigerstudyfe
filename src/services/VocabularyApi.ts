// src/pages/Learn/Lesson.tsx
import axios from "axios";

export const getVocabularyByLessonId = async (lessonId: string | number) => {
  const res = await axios.get(`/api/vocabulary-theories/lesson/${lessonId}`);
  return res.data;
};

