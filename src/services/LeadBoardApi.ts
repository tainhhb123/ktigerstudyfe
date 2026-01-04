//src/services/LeadBoardApi.ts
import axiosInstance from "./axiosConfig";

export const getLeaderboard = async () => {
  const res = await axiosInstance.get("/api/user-xp/leaderboard");
  return res.data;
};
