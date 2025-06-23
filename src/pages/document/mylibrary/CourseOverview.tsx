import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import { authService } from '../../../services/authService';
import { Link } from 'react-router-dom';
import { FaTrash, FaEye, FaEyeSlash, FaEdit } from "react-icons/fa";

const tabs = [
    { label: "Tài liệu", path: "/documents/Library/tai-lieu" },
    { label: "Tài liệu yêu thích", path: "/documents/Library/tailieuyeuthich" },
    { label: "Lớp học của tôi", path: "/documents/Library/lop-hoc" },
    { label: "Lớp học tham gia", path: "/documents/Library/lophocthamgia" },
];

export default function CourseOverview() {
    const location = useLocation();
    const userId = authService.getUserId();
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    interface DocumentList {
        listId: number;
        createdAt: string;
        itemsCount?: number;
        items?: any[];
        avatarImage?: string;
        fullName: string;
        title: string;
        type: string;
        isPublic: number;
    }

    const [lists, setLists] = useState<DocumentList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch user's document lists
    useEffect(() => {
        if (!userId) {
            setError('Bạn chưa đăng nhập.');
            setLoading(false);
            return;
        }

        const fetchLists = async () => {
            try {
                const res = await fetch(`${API_URL}/document-lists/user/${userId}`);
                if (!res.ok) throw new Error(`Error fetching lists: ${res.status}`);
                const data: DocumentList[] = await res.json();
                setLists(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLists();
    }, [API_URL, userId]);

    const handleTogglePublic = async (listId: number, currentFlag: number) => {
        // currentFlag: 0 = công khai, 1 = riêng tư
        try {
            const res = await fetch(`${API_URL}/document-lists/${listId}/visibility`, {
                method: 'PATCH',
            });
            if (!res.ok) throw new Error(`Failed to update visibility: ${res.status}`);
            // nếu thành công thì cập nhật local state
            setLists(prev =>
                prev.map(l =>
                    l.listId === listId
                        ? { ...l, isPublic: currentFlag === 0 ? 1 : 0 }
                        : l
                )
            );
        } catch (err) {
            console.error(err);
            alert('Không thể thay đổi trạng thái công khai.');
        }
    };


    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc muốn xoá danh sách này?')) return;

        try {
            const res = await fetch(`${API_URL}/document-lists/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error(`Xoá thất bại: ${res.status}`);

            // Cập nhật UI
            setLists(prev => prev.filter(item => item.listId !== id));
        } catch (err) {
            console.error(err);
            alert('Xoá không thành công.');
        }
    };
    return (
        <div className="min-h-screen font-sans px-4">
            <PageMeta
                title="Lớp học | Thư viện của bạn"
                description="Danh sách tài liệu của bạn theo userId"
            />

            {/* Header Tabs */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
                <nav className="flex space-x-4 text-sm font-medium text-gray-700">
                    {tabs.map(tab => (
                        <a
                            key={tab.path}
                            href={tab.path}
                            className={`py-2 px-4 rounded-lg transition-colors duration-200 ${location.pathname === tab.path
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100 hover:text-gray-900'
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
                        placeholder="Tìm kiếm tài liệu"
                        className="w-full py-2 pl-4 pr-10 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-500"
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
                        />
                    </svg>
                </div>
            </div>

            {/* Loading / Error States */}
            {loading && <p>Đang tải danh sách...</p>}
            {error && <p className="text-red-500">Lỗi: {error}</p>}

            {/* Render document lists */}
            {!loading && !error && lists.length === 0 && <p>Chưa có danh sách nào.</p>}

            {!loading && !error && lists.map(item => (
                <div key={item.listId} className="mb-6">
                    {/* Header của từng list */}
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-700">
                            {item.createdAt.replace('T', ' ')}
                        </h3>
                        <div className="flex space-x-3">
                            {/* Toggle public/private */}
                            <button
                                onClick={() => handleTogglePublic(item.listId, item.isPublic)}
                                className="p-1 text-gray-600 hover:text-gray-800"
                                title={item.isPublic === 0 ? "Chuyển sang riêng tư" : "Chuyển sang công khai"}
                            >
                                {item.isPublic === 0
                                    ? <FaEye size={20} />
                                    : <FaEyeSlash size={20} />
                                }
                            </button>

                            {/* Edit list */}
                            <Link
                                to={`/documents/edit/${item.listId}`}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Chỉnh sửa danh sách"
                            >
                                <FaEdit size={20} />
                            </Link>

                            {/* Delete list */}
                            <button
                                onClick={() => handleDelete(item.listId)}
                                className="p-1 text-red-500 hover:text-red-700"
                                title="Xoá danh sách"
                            >
                                <FaTrash size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Card nội dung */}
                    <Link to={`/documents/view/${item.listId}`}>
                        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg hover:border-purple-300 transition cursor-pointer">
                            <div className="flex items-center mb-2">
                                <span className="text-purple-600 font-semibold text-base mr-2">
                                    {item.type}
                                </span>
                                <img
                                    src={item.avatarImage || 'https://via.placeholder.com/20'}
                                    alt={item.fullName}
                                    className="w-5 h-5 rounded-full mr-2"
                                />
                                <span className="text-gray-600 text-sm">{item.fullName}</span>
                                <span className="ml-auto text-gray-400">
                                    <svg
                                        className="w-4 h-4 inline-block"
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
                            <p className="text-gray-800 text-xl font-normal">{item.title}</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
