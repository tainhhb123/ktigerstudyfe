//src/services/LeadBoardApi.ts
import axios from "axios";

export const getLeaderboard = async () => {
  const res = await axios.get("/api/user-xp/leaderboard");
  return res.data;
};
