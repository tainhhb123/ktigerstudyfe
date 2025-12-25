import { useState } from "react";
import axios from "axios";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email,
        platform: "web" // Backend yêu cầu thêm field platform
      });
      setSuccess("Nếu email hợp lệ, hệ thống đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư!");
      setEmail("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Gửi yêu cầu thất bại, vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Quên mật khẩu
        </h1>
        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              autoFocus
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded"
          >
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
