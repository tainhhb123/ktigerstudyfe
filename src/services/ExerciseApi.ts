// src/services/ExerciseApi.ts
import axios from "axios";

export const getExercisesByLessonId = async (lessonId: string | number) => {
  const res = await axios.get(`/api/exercises/lesson/${lessonId}`);
  return res.data;
};

export const getMultipleChoiceByExerciseId = async (exerciseId: string | number) => {
  const res = await axios.get(`/api/mcq/exercise/${exerciseId}`);
  return res.data;
};

export const getSentenceRewritingByExerciseId = async (exerciseId: string | number) => {
  const res = await axios.get(`/api/sentence-rewriting/exercise/${exerciseId}`);
  return res.data;
};
