// src/components/auth/SignInForm.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import axios, { AxiosError } from "axios";

interface SignInResponse {
  userId: number;
  email: string;
  fullName: string;
  token: string;
  role: "ADMIN" | "USER";    // ← thêm role
}

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<SignInResponse>(
        "http://localhost:8080/api/auth/signin",
        { email, password }
      );

      // const { token, role, userId } = res.data;   // ← lấy thêm role
      const { token, role, userId, fullName } = res.data;
      // Lưu token
      if (keepLoggedIn) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userId", userId.toString());
         localStorage.setItem("fullName", fullName);
      } else {
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("userRole", role);
        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("fullName", fullName);
      }

      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", userId.toString());
       localStorage.setItem("fullName", fullName);

      console.log("userId đã lưu vào localStorage:", userId);
      console.log("fullName đã lưu vào localStorage:", fullName);


      // Điều hướng theo role
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/learn");
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(
        axiosErr.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Quay lại trang chủ
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Đăng Nhập
        </h1>
        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          Nhập email và mật khẩu để đăng nhập!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <Label>
              Email <span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <Label>
              Mật khẩu <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
          </div>

          {/* Ghi nhớ & Quên mật khẩu */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={keepLoggedIn}
                onChange={setKeepLoggedIn}
                className="w-5 h-5"
              />
              <span className="text-gray-700 dark:text-gray-400">
                Ghi nhớ đăng nhập
              </span>
            </div>
            <Link
              to="/reset-password"
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Lỗi */}
          {error && (
            <div className="text-center text-sm text-red-500">{error}</div>
          )}

          {/* Nút đăng nhập */}
          <div>
            <Button
              type="submit"
              disabled={loading}
              size="sm"
              className="w-full"
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </Button>
          </div>
        </form>

        <p className="mt-5 text-sm text-center text-gray-700 dark:text-gray-400">
          Chưa có tài khoản?{" "}
          <Link
            to="/signup"
            className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Đăng Ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
