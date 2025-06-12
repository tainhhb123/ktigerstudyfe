import React from "react";
import { useLocation } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";

const tabs = [
    { label: "Tài liệu", path: "/documents/Library/tai-lieu" },
    { label: "Tài liệu yêu thích", path: "/documents/Library/tailieuyeuthich" },
    { label: "Lớp học của tôi", path: "/documents/Library/lop-hoc" },
    { label: "Lớp học tham gia", path: "/documents/Library/lophocthamgia" },
];

export default function CourseOverview() {
    const location = useLocation();

    return (
        <div className="min-h-screen font-sans">
            <PageMeta
                title="Lớp học | Thư viện của bạn"
                description="Bạn chưa tham gia hoặc tạo lớp học nào"
            />

            {/* Header Tabs */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
                <nav className="flex space-x-4 text-sm font-medium text-gray-700">
                    {tabs.map((tab) => (
                        <a
                            key={tab.path}
                            href={tab.path}
                            className={`py-2 px-4 rounded-lg transition-colors duration-200 ${location.pathname === tab.path
                                ? "bg-blue-100 text-blue-700"
                                : "hover:bg-gray-100 hover:text-gray-900"
                                }`}
                        >
                            {tab.label}
                        </a>
                    ))}
                </nav>

                {/* Search Bar */}
                <div className="relative flex items-center w-80">
                    <input
                        type="text"
                        placeholder="Tìm kiếm thẻ ghi nhớ"
                        className="w-full py-2 pl-4 pr-10 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <svg
                        className="absolute right-3 text-gray-400 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                    </svg>
                </div>
            </div>

            {/* ÍT GIỜ TRƯỚC */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">ÍT GIỜ TRƯỚC</h3>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg hover:border-blue-300 transition cursor-pointer">
                    <div className="flex items-center mb-2">
                        <span className="text-blue-600 font-bold text-lg mr-2">147 thuật ngữ</span>
                        <img
                            src="https://via.placeholder.com/24"
                            alt="Huyen0996"
                            className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-gray-700 font-medium">Huyen0996</span>
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            Giáo viên
                        </span>
                    </div>
                    <p className="text-gray-900 text-2xl font-bold">từ vựng tiếng anh</p>
                </div>
            </div>

            {/* THÁNG 4 NĂM 2025 */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">THÁNG 4 NĂM 2025</h3>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg hover:border-purple-300 transition cursor-pointer">
                    <div className="flex items-center mb-2">
                        <span className="text-purple-600 font-bold text-lg mr-2">29 thuật ngữ</span>
                        <img
                            src="https://via.placeholder.com/24"
                            alt="vuthingocdiep58"
                            className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-gray-700 font-medium">vuthingocdiep58</span>
                        <span className="ml-auto text-gray-400">
                            <svg
                                className="w-5 h-5 inline-block"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-3-3v6m-3 3h6a2 2 0 002-2V6a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </span>
                    </div>
                    <p className="text-gray-900 text-2xl font-bold">Tiếng Hàn trung cấp cấp 3</p>
                </div>
            </div>
        </div>
    );
}
