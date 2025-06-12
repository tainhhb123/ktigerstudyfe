import React from "react";

const functionButtons = [
  {
    label: "날말카드",
    icon: (
      // Icon dạng 2 thẻ giống như clone
      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="3" y="7" width="13" height="13" rx="2" stroke="currentColor"/>
        <rect x="8" y="3" width="13" height="13" rx="2" stroke="currentColor"/>
      </svg>
    ),
  },
  {
    label: "학습하기",
    icon: (
      // Icon loading (autoawesome)
      <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeDasharray="2 4"/>
      </svg>
    ),
  },
  {
    label: "테스트",
    icon: (
      // Icon dấu chấm hỏi
      <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <text x="12" y="17" fontSize="10" textAnchor="middle" fill="currentColor">?</text>
      </svg>
    ),
  },
  {
    label: "블록",
    icon: (
      // Icon block hình vuông nhỏ
      <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="4" width="5" height="5" rx="1"/>
        <rect x="15" y="4" width="5" height="5" rx="1"/>
        <rect x="4" y="15" width="5" height="5" rx="1"/>
        <rect x="15" y="15" width="5" height="5" rx="1"/>
      </svg>
    ),
  },
  {
    label: "Blast",
    icon: (
      // Icon tên lửa
      <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M2 16l4.5-4.5m15-7L15 8.5m-2.5 2.5a6 6 0 01-8.5 8.5l2-2M15 8.5L12.5 11a2 2 0 01-2.5 2.5l-2 2"/>
        <circle cx="17" cy="7" r="3" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "카드 맞추기",
    icon: (
      // Icon 2 mũi tên xoay
      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M4 4v5h5M20 20v-5h-5M4 19a9 9 0 0114-7.7M20 5a9 9 0 01-14 7.7" />
      </svg>
    ),
  },
];

export default function FunctionBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mt-4 mb-2">
      {functionButtons.map((btn, idx) => (
        <button
          key={idx} // Sử dụng index làm key tạm thời, nhưng nên dùng ID duy nhất nếu có
          className="flex flex-col items-center justify-center py-4 rounded-xl bg-white text-gray-800 shadow-md hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {btn.icon}
          <span className="mt-2 font-semibold">{btn.label}</span>
        </button>
      ))}
    </div>
  );
}