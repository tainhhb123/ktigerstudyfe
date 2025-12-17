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
    <header className="sticky top-0 flex w-full z-50 shadow-sm" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #BDBDBD' }}>
      <div className="flex items-center justify-between w-full px-4 py-3 lg:px-6 lg:py-4">
        {/* Logo */}
        <Link to="/learn" className="flex items-center shrink-0 gap-0.5">
          <span className="text-2xl lg:text-3xl font-extrabold tracking-tight" style={{ color: '#FF6B35' }}>
            K-Tiger
          </span>
          <span className="text-2xl lg:text-3xl font-extrabold tracking-tight" style={{ color: '#4CAF50' }}>
            Study
          </span>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:text-[#FF6B35]'
              }`}
              style={{
                backgroundColor: isActive(item.path) ? '#FF6B35' : 'transparent',
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-2 lg:gap-3">
          <Link
            to="/documents"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
            style={{ backgroundColor: '#FFE8DC' }}
            title="Tài liệu"
          >
            <FileText className="w-5 h-5" style={{ color: '#FF6B35' }} />
          </Link>
          <ThemeToggleButton />
          <NotificationDropdown />
          <UserDropdown />
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full transition-all"
            style={{ backgroundColor: '#FFE8DC' }}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" style={{ color: '#FF6B35' }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: '#FF6B35' }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden absolute top-full left-0 right-0 shadow-lg"
          style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #BDBDBD' }}
        >
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl transition-all font-semibold text-center"
                style={{
                  backgroundColor: isActive(item.path) ? '#FF6B35' : '#FFE8DC',
                  color: isActive(item.path) ? '#FFFFFF' : '#333333',
                }}
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
