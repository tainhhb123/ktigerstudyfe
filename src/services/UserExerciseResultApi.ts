// src/services/UserExerciseResultApi.ts
import axiosInstance from "./axiosConfig";

export const saveUserExerciseResult = async ({
  userId,
  exerciseId,
  score,
  dateComplete,
}: {
  userId: number;
  exerciseId: number;
  score: number;
  dateComplete: string;
}) => {
  console.log("Sending:", { userId, exerciseId, score, dateComplete }); 
  return axiosInstance.post("/api/user-exercise-results", {
    userId,
    exerciseId,
    score,
    dateComplete,
  });
};
