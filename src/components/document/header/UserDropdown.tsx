import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { authService } from "../../../services/authService";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (err) {
        console.error("Lỗi đọc user từ localStorage:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    // Xóa tất cả dữ liệu liên quan đến đăng nhập
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // Chuyển hướng về trang đăng nhập sau khi đăng xuất
    navigate("/signin");
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img src="/images/user/owner.jpg" alt="User" />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user?.fullName?.split(" ")[0] || "User"}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.fullName || "User Name"}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email || "example@email.com"}
          </span>
        </div>

        {/* Menu items */}
        <ul className="mt-3 space-y-1">
          <li>
            <DropdownItem
              tag="a"
              to="/profile"
              onItemClick={closeDropdown}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {/* SVG icon */}
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <Link
              to="/home"
              onClick={closeDropdown}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {/* SVG icon */}
              Trang chủ
            </Link>
          </li>
          <li>
            <Link
              to="/signin"
              onClick={e => {
                e.preventDefault();
                authService.logout();
                navigate('/signin');
              }}
              className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {/* SVG icon */}
              Đăng xuất
            </Link>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}
