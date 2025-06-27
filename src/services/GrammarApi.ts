//src/services/GrammarApi.ts
import axios from "axios";

export const getGrammarByLessonId = async (lessonId: string | number) => {
  const res = await axios.get(`/api/grammar-theories/lesson/${lessonId}`);
  return res.data;
};
