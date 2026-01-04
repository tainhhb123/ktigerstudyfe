//src/services/VocabularyApi.ts
import axiosInstance from "./axiosConfig";

export const getVocabularyByLessonId = async (lessonId: string | number) => {
  const res = await axiosInstance.get(`/api/vocabulary-theories/lesson/${lessonId}`);
  return res.data;
};

