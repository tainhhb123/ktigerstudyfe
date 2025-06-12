import { JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import PageMeta from "../../../components/document/common/PageMeta";

const tabs = [
    { label: "Tài liệu", path: "/documents/Library/tai-lieu" },
    { label: "Tài liệu yêu thích", path: "/documents/Library/tailieuyeuthich" },
    { label: "Lớp học của tôi", path: "/documents/Library/lop-hoc" },
    { label: "Lớp học tham gia", path: "/documents/Library/lophocthamgia" },
];

export default function MyClass(): JSX.Element {
    const location = useLocation();

    return (
        <>
            <PageMeta
                title="Lớp học | Thư viện của bạn"
                description="Bạn chưa tham gia hoặc tạo lớp học nào"
            />

            <div className="">

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

                {/* Nội dung chính */}
                <div className="flex flex-col items-center justify-center mt-16">
                    <img
                        src="/images/chat/chat.jpg"
                        alt="placeholder"
                        className="w-80 mb-6"
                    />
                    <p className="text-xl font-semibold text-gray-800 text-center">
                        Bạn chưa tạo hoặc tham gia lớp học nào
                    </p>
                    <p className="text-gray-600 text-center mt-2 max-w-md">
                        Tạo một lớp học để giúp bạn sắp xếp học phần của mình và chia sẻ chúng với bạn cùng lớp
                    </p>
                    <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition">
                        Tham gia hoặc tạo lớp học
                    </button>
                </div>
            </div>
        </>
    );
}
