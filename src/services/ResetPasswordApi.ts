import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
  platform: string; // 'web' hoặc 'mobile'
}

/**
 * Gửi yêu cầu đặt lại mật khẩu (gửi email)
 * ✅ PUBLIC API - Không cần JWT
 */
export const forgotPassword = async (email: string): Promise<string> => {
  const response = await axios.post<string>(`${API_URL}/forgot-password`, {
    email,
    platform: 'web'
  });
  return response.data;
};

/**
 * Đặt lại mật khẩu với token từ email
 * ✅ PUBLIC API - Không cần JWT
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<string> => {
  const response = await axios.post<string>(`${API_URL}/reset-password`, data);
  return response.data;
};

/**
 * Kiểm tra token reset password có hợp lệ không
 * ✅ PUBLIC API - Không cần JWT
 */
export const validateResetToken = async (token: string): Promise<boolean> => {
  try {
    await axios.get(`${API_URL}/validate-reset-token`, {
      params: { token }
    });
    return true;
  } catch (error) {
    return false;
  }
};
