import axiosInstance from "./axiosConfig";

interface ChangePasswordPayload {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async (payload: ChangePasswordPayload) => {
  const res = await axiosInstance.post("/api/users/change-password", payload);
  return res.data;
};
