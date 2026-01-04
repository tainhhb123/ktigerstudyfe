// src/services/ExerciseApi.ts
import axiosInstance from "./axiosConfig";

export const getExercisesByLessonId = async (lessonId: string | number) => {
  const res = await axiosInstance.get(`/api/exercises/lesson/${lessonId}`);
  return res.data;
};

export const getMultipleChoiceByExerciseId = async (exerciseId: string | number) => {
  const res = await axiosInstance.get(`/api/mcq/exercise/${exerciseId}`);
  return res.data;
};

export const getSentenceRewritingByExerciseId = async (exerciseId: string | number) => {
  const res = await axiosInstance.get(`/api/sentence-rewriting/exercise/${exerciseId}`);
  return res.data;
};
