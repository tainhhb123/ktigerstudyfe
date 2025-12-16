import { useEffect, useRef, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
import NotificationDropdown from "../../components/header/NotificationDropdown";
import UserDropdown from "../../components/header/UserDropdown";

type NavItem = {
  name: string;
  path: string;
};

const navItems: NavItem[] = [
  {
    name: "Trang chủ",
    path: "/learn",
  },
  {
    name: "Học",
    path: "/learn/level",
  },
  {
    name: "Thi TOPIK",
    path: "/learn/topik",
  },
  {
    name: "Bảng xếp hạng",
    path: "/learn/leaderboard",
  },
  {
    name: "Chat AI",
    path: "/learn/chatai",
  },
];

const AppHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between w-full px-4 py-3 lg:px-6 lg:py-4">
        {/* Logo */}
        <Link to="/learn" className="flex items-center shrink-0">
          <img
            className="h-8 lg:h-10 dark:hidden"
            src="/images/logo/logo.svg"
            alt="Logo"
          />
          <img
            className="h-8 lg:h-10 hidden dark:block"
            src="/images/logo/logo-dark.svg"
            alt="Logo"
          />
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                isActive(item.path)
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-2 lg:gap-3">
          <Link
            to="/documents"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Tài liệu"
          >
            <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <ThemeToggleButton />
          <NotificationDropdown />
          <UserDropdown />
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg transition-colors font-medium text-center ${
                  isActive(item.path)
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
