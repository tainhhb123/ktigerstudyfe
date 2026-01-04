//src/services/GrammarApi.ts
import axiosInstance from "./axiosConfig";

export const getGrammarByLessonId = async (lessonId: string | number) => {
  const res = await axiosInstance.get(`/api/grammar-theories/lesson/${lessonId}`);
  return res.data;
};
