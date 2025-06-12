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

            <div className="px-4 py-8 md:px-8">
                {/* Tiêu đề */}
                <h1 className="text-2xl font-bold text-gray-900">Thư viện của bạn</h1>

                {/* Tabs điều hướng */}
                <div className="flex space-x-6 mt-6 border-b border-gray-200">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`pb-2 text-sm font-medium transition ${location.pathname === tab.path
                                ? "text-indigo-600 border-b-2 border-indigo-600"
                                : "text-gray-600 hover:text-indigo-500"
                                }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
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
