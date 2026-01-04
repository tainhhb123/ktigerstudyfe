import axiosInstance from "./axiosConfig";

export const addUserXP = async ({
  userId,
  xpToAdd,
}: {
  userId: number;
  xpToAdd: number;
}) => {
  const res = await axiosInstance.post("/api/user-xp/add", { userId, xpToAdd });
  return res.data; 
};
