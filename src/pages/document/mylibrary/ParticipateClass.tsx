// src/pages/ParticipateClass.tsx
import React, { JSX, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import PageMeta from "../../../components/document/common/PageMeta";
import { authService } from "../../../services/authService";

interface ClassUserResponse {
    classUserId: number;
    classId: number;
    className: string;
    userId: number;
    userFullName: string;
    joinedAt: string;
    email?: string;
    avatarImage?: string;
}

export default function ParticipateClass(): JSX.Element {
    const location = useLocation();
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_BASE_URL;
    const me = authService.getUserId();

    const [classes, setClasses] = useState<ClassUserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const tabs = [
        { label: "Tài liệu", path: "/documents/Library/tai-lieu" },
        { label: "Tài liệu yêu thích", path: "/documents/Library/tailieuyeuthich" },
        { label: "Lớp học của tôi", path: "/documents/Library/lop-hoc" },
        { label: "Lớp học tham gia", path: "/documents/Library/lophocthamgia" },
    ];

    useEffect(() => {
        if (!me) {
            setError("Bạn chưa đăng nhập");
            setLoading(false);
            return;
        }
        fetch(`${API}/class-users/user/${me}`)
            .then((r) => {
                if (!r.ok) throw new Error(`Lỗi ${r.status}`);
                return r.json();
            })
            .then((data: ClassUserResponse[]) => setClasses(data))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [API, me]);

    const handleLeave = async (classUserId: number) => {
        if (!window.confirm("Bạn có chắc muốn rời khỏi lớp này không?")) return;
        try {
            const res = await fetch(`${API}/class-users/${classUserId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error(`Lỗi ${res.status}`);
            // Cập nhật lại danh sách sau khi rời
            setClasses((prev) => prev.filter((c) => c.classUserId !== classUserId));
        } catch (e: any) {
            alert("Không thể rời lớp: " + e.message);
        }
    };

    return (
        <div className="min-h-screen font-sans p-6 bg-gray-50">
            <PageMeta
                title="Lớp học tham gia | Thư viện của bạn"
                description="Danh sách các lớp bạn đã tham gia"
            />

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
                <nav className="flex space-x-4 text-sm font-medium text-gray-700">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`py-2 px-4 rounded-lg transition-colors duration-200 ${location.pathname === tab.path
                                    ? "bg-blue-100 text-blue-700"
                                    : "hover:bg-gray-100 hover:text-gray-900"
                                }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Nội dung */}
            {loading && <p className="text-center">Đang tải lớp học…</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!loading && !error && classes.length === 0 && (
                <p className="text-center text-gray-500">Bạn chưa tham gia lớp học nào.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((c) => (
                    <div key={c.classUserId} className="relative bg-white rounded-xl shadow hover:shadow-lg transition p-6 space-y-3">
                        <Link
                            to={`/documents/Library/classesuser/${c.classId}`}
                            className="block"
                        >
                            <div className="flex items-center space-x-3">
                                <img
                                    src={c.avatarImage ?? "/images/avatars/default.png"}
                                    alt={c.userFullName}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{c.className}</h3>
                                    <p className="text-sm text-gray-500">Giảng viên: {c.userFullName}</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs mt-2">
                                Tham gia:{" "}
                                {new Date(c.joinedAt).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </p>
                        </Link>
                        {/* Nút rời khỏi */}
                        <button
                            onClick={() => handleLeave(c.classUserId)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1"
                            aria-label="Rời khỏi lớp"
                        >
                            Rời lớp
                        </button>
                    </div>
                ))}
            </div>

            {/* Nếu có nested routes (ví dụ chi tiết lớp) */}
            <Outlet />
        </div>
    );
}
