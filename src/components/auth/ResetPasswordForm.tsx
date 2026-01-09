import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/ResetPasswordApi";

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Lấy token từ query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  if (!token) {
    return <div className="text-center text-red-500">Liên kết không hợp lệ hoặc đã hết hạn.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword.trim()) {
      setError("Vui lòng nhập mật khẩu mới.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Sử dụng service thay vì gọi axios trực tiếp
      const message = await resetPassword({ token, newPassword });
      setSuccess(message || "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập lại.");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, hãy thử lại hoặc gửi lại yêu cầu mới."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Đặt lại mật khẩu
        </h1>
        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded"
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
