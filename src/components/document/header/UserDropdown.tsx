import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { authService } from '../../../services/authService';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(open => !open);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 h-11 w-11 overflow-hidden rounded-full">
          <img src="/images/user/owner.jpg" alt="User avatar" />
        </span>
        <span className="block mr-1 font-medium text-theme-sm">Lyly111</span>
        <svg
          className={`stroke-current transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          width="18" height="20" viewBox="0 0 18 20" fill="none"
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

      {/* Dropdown menu */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-2 w-64 rounded-2xl border bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        {/* User info */}
        <div className="pb-4 border-b dark:border-gray-800">
          <p className="font-medium text-gray-700 dark:text-gray-300">Musharof Chowdhury</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">randomuser@pimjo.com</p>
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
