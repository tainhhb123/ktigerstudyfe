import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { ThemeToggleButton } from "../../components/document/common/ThemeToggleButton";
import UserDropdown from "../../components/document/header/UserDropdown";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const DEFAULT_PAGE = 0;
  const DEFAULT_SIZE = 8;

  // Toggle sidebar (desktop vs mobile)
  const handleToggle = () => {
    if (window.innerWidth >= 1024) toggleSidebar();
    else toggleMobileSidebar();
  };

  // Toggle mobile menu
  const toggleApplicationMenu = () => {
    setApplicationMenuOpen((open) => !open);
  };

  // ⌘K / Ctrl+K focus search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Khi bấm tìm → điều hướng sang /search?keyword=...&page=0&size=8
  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = inputRef.current?.value.trim() || "";
    navigate(
      `/documents/search?keyword=${encodeURIComponent(kw)}&page=${DEFAULT_PAGE}&size=${DEFAULT_SIZE}`
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Sidebar Toggle */}
        <button
          onClick={handleToggle}
          aria-label="Toggle Sidebar"
          className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg dark:border-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isMobileOpen ? (
            <span className="block w-6 h-6 bg-[url('/icons/close.svg')] bg-center bg-no-repeat" />
          ) : (
            <span className="block w-6 h-4 bg-[url('/icons/menu.svg')] bg-center bg-no-repeat" />
          )}
        </button>

        {/* Logo */}
        <Link to="/" className="flex-shrink-0 lg:hidden">
          <img src="/images/logo/logo.svg" alt="Logo" className="h-8 dark:hidden" />
          <img src="/images/logo/logo-dark.svg" alt="Logo" className="h-8 hidden dark:block" />
        </Link>

        {/* Search Form */}
        <form
          onSubmit={onSearchSubmit}
          className="relative mx-4 lg:mx-0"
        >
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm tài liệu"
            className="block w-48 lg:w-80 h-8  pl-8 pr-10  text-sm rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white
                focus:ring-2 focus:ring-brand-500" />
          <button
            type="submit"
            className="
      absolute right-2 top-1/2 -translate-y-1/2
      px-2 py-1
      bg-gray-100 rounded text-sm
      hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
    "
          >
            Tìm
          </button>
        </form>


        {/* Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleApplicationMenu}
            aria-label="Open Menu"
            className="lg:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ⋮
          </button>
          <Link
            to="/learn"
            title="Tài liệu học"
            className="hidden lg:flex items-center justify-center w-9 h-9 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <GraduationCap className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <ThemeToggleButton />
          <UserDropdown />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-max-h duration-300 overflow-hidden ${isApplicationMenuOpen ? "max-h-60" : "max-h-0"
          }`}
      >
        <nav className="px-4 py-2 space-y-2">
          <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            Home
          </Link>
          <Link to="/learn" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            Tài liệu học
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
