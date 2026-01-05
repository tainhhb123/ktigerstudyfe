// src/components/auth/SignInForm.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import axios, { AxiosError } from "axios";
import { authService } from "../../services/authService";
import { GoogleLogin } from '@react-oauth/google'; // ✅ Chỉ import GoogleLogin

// ✅ API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// ✅ Type definitions
interface SignInResponse {
  userId: number;
  email: string;
  fullName: string;
  token: string;
  role: "ADMIN" | "USER";
}

interface GoogleSignInResponse {
  userId: number;
  email: string;
  fullName: string;
  role: "ADMIN" | "USER";
  isNewUser: boolean;
  message: string;
}

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Regular email/password login - Updated with redirect
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<SignInResponse>(`${API_BASE_URL}/auth/signin`, {
        email,
        password
      });

      const { token, role, userId, fullName, email: userEmail } = res.data;

      // Save auth data
      saveAuthData({ userId, fullName, email: userEmail, role, token });

      // Navigate based on role
      navigateByRole(role);

    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      
      // ✅ NEW: Redirect to frozen page if account is frozen
      if (axiosErr.response?.status === 403) {
        // Save user info for frozen page context
        const errorMessage = axiosErr.response?.data?.message || "Tài khoản đã bị đóng băng";
        localStorage.setItem("frozenAccountEmail", email);
        localStorage.setItem("frozenAccountMessage", errorMessage);
        
        // Redirect to frozen account page
        navigate("/account-frozen");
        return;
      } else if (axiosErr.response?.status === 401) {
        setError("🔒 " + (axiosErr.response?.data?.message || "Email hoặc mật khẩu không đúng"));
      } else {
        setError("⚠️ " + (axiosErr.response?.data?.message || "Đăng nhập thất bại"));
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google OAuth login success handler
  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      setError("Đăng nhập Google thất bại");
      return;
    }

    setGoogleLoading(true);
    setError("");

    try {
      console.log("=== GOOGLE LOGIN START ===");
      console.log("Sending Google token to backend...");

      // Send Google token to backend
      const res = await axios.post<GoogleSignInResponse>(`${API_BASE_URL}/auth/google-signin`, {
        googleToken: credentialResponse.credential
      });

      const { userId, fullName, email: userEmail, role, isNewUser, message } = res.data;

      console.log("Google signin response:", res.data);

      // Save auth data (simple token for now)
      const simpleToken = "google-token-" + userId + "-" + Date.now();
      saveAuthData({ userId, fullName, email: userEmail, role, token: simpleToken });

      // Show welcome message
      if (isNewUser) {
        alert(`🎉 Chào mừng ${fullName}!\n${message}`);
      } else {
        alert(`👋 Chào mừng trở lại, ${fullName}!`);
      }

      // Navigate based on role
      navigateByRole(role);

    } catch (err) {
      console.error("=== GOOGLE LOGIN ERROR ===");
      console.error("Error:", err);
      const axiosErr = err as AxiosError<{ message: string }>;
      
      // ✅ NEW: Redirect to frozen page if account is frozen
      if (axiosErr.response?.data?.message?.includes("đóng băng") || 
          axiosErr.response?.data?.message?.includes("frozen") ||
          axiosErr.response?.status === 403) {
        
        // Save error context for frozen page
        const errorMessage = axiosErr.response?.data?.message || "Tài khoản đã bị đóng băng";
        localStorage.setItem("frozenAccountMessage", errorMessage);
        
        // Redirect to frozen account page
        navigate("/account-frozen");
        return;
      } else {
        setError("⚠️ " + (axiosErr.response?.data?.message || "Đăng nhập Google thất bại"));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // ✅ Google OAuth login error handler
  const handleGoogleError = () => {
    console.error("Google login failed");
    setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
  };

  // ✅ Helper function to save auth data
  const saveAuthData = (userData: {
    userId: number;
    fullName: string;
    email: string;
    role: string;
    token: string;
  }) => {
    const { userId, fullName, email, role, token } = userData;

    // Save via authService
    authService.setToken(token, keepLoggedIn);
    authService.setRole(role, keepLoggedIn);
    authService.setUserId(userId, keepLoggedIn);

    // Save to storage for compatibility
    const profile = { userId, fullName, email };
    const completeUserData = { userId, fullName, email, role, token };

    if (keepLoggedIn) {
      localStorage.setItem("userProfile", JSON.stringify(profile));
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(completeUserData));
    } else {
      sessionStorage.setItem("userProfile", JSON.stringify(profile));
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("userRole", role);
    }

    // Additional localStorage saves (for compatibility)
    localStorage.setItem("userId", String(userId));
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("user", JSON.stringify(completeUserData));

    console.log("Auth data saved:", { userId, fullName, email, role });
  };

  // ✅ Helper function to navigate by role
  const navigateByRole = (role: string) => {
    if (role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/learn");
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
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Nhập email và mật khẩu để đăng nhập!
        </p>

        {/* ✅ Google Sign In Button */}
        <div className="mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            logo_alignment="left"
            width="400"
          />
          {googleLoading && (
            <p className="text-center text-sm text-blue-600 mt-2 animate-pulse">
              🔄 Đang xử lý đăng nhập Google...
            </p>
          )}
        </div>

        {/* ✅ Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Hoặc đăng nhập bằng email
            </span>
          </div>
        </div>

        {/* ✅ Regular Login Form */}
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
              disabled={googleLoading}
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
                disabled={googleLoading}
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
                disabled={googleLoading}
              />
              <span className="text-gray-700 dark:text-gray-400">
                Ghi nhớ đăng nhập
              </span>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              ⚠️ {error}
            </div>
          )}

          {/* Submit button */}
          <div>
            <Button
              type="submit"
              disabled={loading || googleLoading}
              size="sm"
              className="w-full"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng Nhập"
              )}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-sm text-center text-gray-700 dark:text-gray-400">
          Chưa có tài khoản?{" "}
          <Link
            to="/signup"
            className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium"
          >
            Đăng Ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
