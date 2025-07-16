import axios from "axios";

export const addUserXP = async ({
  userId,
  xpToAdd,
}: {
  userId: number;
  xpToAdd: number;
}) => {
  const res = await axios.post("/api/user-xp/add", { userId, xpToAdd });
  return res.data; 
};
