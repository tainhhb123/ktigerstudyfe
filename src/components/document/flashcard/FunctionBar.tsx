import React from "react";
import { useNavigate } from "react-router-dom";

const functionButtons = [
  {
    label: "Thẻ Ghi nhớ",
    path: "/documents/flashcardsfull",
    icon: (
      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="3" y="7" width="13" height="13" rx="2" stroke="currentColor" />
        <rect x="8" y="3" width="13" height="13" rx="2" stroke="currentColor" />
      </svg>
    ),
  },
  {
    label: "Học",
    path: "/documents/study",
    icon: (
      <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeDasharray="2 4" />
      </svg>
    ),
  },
  {
    label: "Kiểm tra",
    path: "/documents/quiz",
    icon: (
      <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <text x="12" y="17" fontSize="10" textAnchor="middle" fill="currentColor">?</text>
      </svg>
    ),
  },
];

export default function FunctionBar() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mt-4 mb-2">
      {functionButtons.map((btn, idx) => (
        <button
          key={idx}
          onClick={() => navigate(btn.path)}
          className="flex flex-col items-center justify-center py-4 rounded-xl bg-white text-gray-800 shadow-md hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {btn.icon}
          <span className="mt-2 font-semibold">{btn.label}</span>
        </button>
      ))}
    </div>
  );
}
