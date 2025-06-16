// src/services/UserExerciseResultApi.ts
import axios from "axios";
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
  return axios.post("/api/user-exercise-results", {
    userId,
    exerciseId,
    score,
    dateComplete,
  });
};
