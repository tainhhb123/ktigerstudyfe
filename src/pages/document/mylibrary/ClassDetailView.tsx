// src/pages/ClassDetailView.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../../components/document/common/PageMeta";
import DocumentCard from "../../../components/document/homedocument/DocumentCard";
import { authService } from "../../../services/authService";

interface ClassResponse {
    classId: number;
    className: string;
    description?: string;
    userFullName: string;
    createdAt: string;
}

interface ClassUserResponse {
    classUserId: number;
    userFullName: string;
    email: string;
    avatarImage?: string;
    joinedAt: string;
}

interface ClassDocumentListResponse {
    classDocumentListId: number;
    listId: number;
    listTitle: string;
    description: string;
    type: string;
    fullName: string;
    avatarImage?: string;
}

export default function ClassDetailView() {
    const { id } = useParams<{ id: string }>();
    const classId = Number(id);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_BASE_URL;
    const me = authService.getUserId();

    const [cls, setCls] = useState<ClassResponse | null>(null);
    const [members, setMembers] = useState<ClassUserResponse[]>([]);
    const [docs, setDocs] = useState<ClassDocumentListResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // local filter state
    const [docSearchQ, setDocSearchQ] = useState("");
    const [memberSearchQ, setMemberSearchQ] = useState("");

    useEffect(() => {
        if (isNaN(classId)) {
            navigate(-1);
            return;
        }

        Promise.all([
            fetch(`${API}/classes/${classId}`).then(r => r.json()),
            fetch(`${API}/class-users/class/${classId}`).then(r => r.json()),
            fetch(`${API}/class-document-lists/class/${classId}`).then(r => r.json()),
        ])
            .then(([clsData, memData, docData]) => {
                setCls(clsData);
                setMembers(memData);
                setDocs(docData);
            })
            .catch(err => setError(err.message || "Lỗi tải dữ liệu"))
            .finally(() => setLoading(false));
    }, [API, classId, navigate]);

    if (loading) return <p className="text-center">Đang tải chi tiết lớp…</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;
    if (!cls) return <p className="text-center">Không tìm thấy lớp học</p>;

    // apply simple client-side filtering
    const filteredDocs = docs.filter(d =>
        d.listTitle.toLowerCase().includes(docSearchQ.toLowerCase())
    );
    const filteredMembers = members.filter(m =>
        m.userFullName.toLowerCase().includes(memberSearchQ.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <PageMeta
                title={`Lớp: ${cls.className}`}
                description={cls.description || ""}
            />

            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline"
            >
                ← Quay lại
            </button>

            <div className="max-w-7xl mx-auto lg:flex lg:space-x-8">
                {/* -------- Left: Documents -------- */}
                <div className="w-full lg:w-8/12 space-y-6">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tài liệu của bạn…"
                        value={docSearchQ}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDocSearchQ(e.target.value)}
                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                    />

                    <h2 className="text-2xl font-semibold">Tài liệu trong lớp</h2>
                    {filteredDocs.length === 0 ? (
                        <p className="text-gray-500">Chưa có tài liệu khớp.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDocs.map(d => (
                                <DocumentCard
                                    key={d.classDocumentListId}
                                    doc={{
                                        listId: d.listId,
                                        title: d.listTitle,
                                        description: d.description,
                                        type: d.type,
                                        fullName: d.fullName,
                                        avatarImage: d.avatarImage,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* -------- Right: Sidebar -------- */}
                <div className="w-full lg:w-5/12 space-y-6">
                    {/* Thông tin lớp */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-xl font-semibold mb-4">Thông tin lớp học</h3>
                        <p><strong>Tên lớp:</strong> {cls.className}</p>
                        {cls.description && <p className="mt-2"><strong>Mô tả:</strong> {cls.description}</p>}
                        <p className="mt-4 text-sm text-gray-500">
                            Giảng viên: {cls.userFullName}
                        </p>
                        <p className="text-sm text-gray-400">
                            Tạo ngày{" "}
                            {new Date(cls.createdAt).toLocaleDateString("vi-VN", {
                                day: "2-digit", month: "2-digit", year: "numeric",
                            })}
                        </p>
                    </div>

                    {/* Thành viên */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-xl font-semibold mb-4">
                            Thành viên ({filteredMembers.length})
                        </h3>
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng…"
                            value={memberSearchQ}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setMemberSearchQ(e.target.value)
                            }
                            className="w-full mb-4 p-2 border rounded focus:ring-2 focus:ring-blue-400"
                        />

                        {filteredMembers.length === 0 ? (
                            <p className="text-gray-500">Không tìm thấy thành viên nào.</p>
                        ) : (
                            <ul className="space-y-4">
                                {filteredMembers.map(m => (
                                    <li
                                        key={m.classUserId}
                                        className="flex items-center space-x-4"
                                    >
                                        <img
                                            src={m.avatarImage ?? "/images/avatars/default.png"}
                                            alt={m.userFullName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {m.userFullName}
                                            </p>
                                            <p className="text-sm text-gray-500">{m.email}</p>
                                            <p className="text-xs text-gray-400">
                                                Tham gia:{" "}
                                                {new Date(m.joinedAt).toLocaleDateString("vi-VN", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
