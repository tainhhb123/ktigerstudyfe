// src/pages/document/mylibrary/FavoriteDocument.tsx
import React, { JSX, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../../../services/authService';
import DocumentCard, { Doc } from '../../../components/document/homedocument/DocumentCard';
import PageMeta from '../../../components/document/common/PageMeta';

const tabs = [
    { label: "Tài liệu", path: "/documents/Library/tai-lieu" },
    { label: "Tài liệu yêu thích", path: "/documents/Library/tailieuyeuthich" },
    { label: "Lớp học của tôi", path: "/documents/Library/lop-hoc" },
    { label: "Lớp học tham gia", path: "/documents/Library/lophocthamgia" },
];

export default function FavoriteDocument(): JSX.Element {
    const rawApiUrl = import.meta.env.VITE_API_BASE_URL || '';
    // Loại bỏ trailing slash nếu có
    const API_URL = rawApiUrl.replace(/\/$/, '');

    const userId = authService.getUserId();
    const location = useLocation();

    const [docs, setDocs] = useState<Doc[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setError('Bạn cần đăng nhập để xem tài liệu yêu thích.');
            return;
        }

        const fetchFavorited = async () => {
            setLoading(true);
            setError(null);

            const endpoint = `${API_URL}/document-lists/favorited/${userId}`;
            console.log('Fetching favorited docs from:', endpoint);

            try {
                const res = await fetch(endpoint);

                if (res.status === 404) {
                    // Nếu chưa có tài liệu yêu thích → hiển thị như danh sách rỗng
                    setDocs([]);
                    return;
                }
                if (!res.ok) {
                    throw new Error(`Server error ${res.status}`);
                }

                const data: Doc[] = await res.json();
                setDocs(data);
            } catch (err: any) {
                console.error('Failed to fetch favorited docs:', err);
                setError(err.message ?? 'Đã có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorited();
    }, [API_URL, userId]);

    return (
        <>
            <PageMeta
                title="Tài liệu yêu thích | Thư viện của bạn"
                description="Danh sách tài liệu bạn đã đánh dấu yêu thích"
            />

            {/* Header Tabs */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
                <nav className="flex space-x-4 text-sm font-medium text-gray-700">
                    {tabs.map(tab => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`py-2 px-4 rounded-lg transition-colors duration-200 ${location.pathname === tab.path
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </nav>
                {/* Search Bar (nếu cần) */}
                <div className="relative flex items-center w-80">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tài liệu"
                        className="w-full py-2 pl-4 pr-10 rounded-lg border border-gray-300 
                       focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-500"
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

            {/* Nội dung chính */}
            {loading && <p className="p-4 text-center">Đang tải dữ liệu…</p>}
            {error && (
                <p className="p-4 text-center text-red-600">
                    Đã có lỗi xảy ra: {error}
                </p>
            )}
            {!loading && !error && docs.length === 0 && (
                <p className="p-4 text-center text-gray-500">
                    Bạn chưa đánh dấu yêu thích tài liệu nào.
                </p>
            )}
            {!loading && !error && docs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 pb-6">
                    {docs.map(doc => (
                        <DocumentCard key={doc.listId} doc={doc} />
                    ))}
                </div>
            )}
        </>
    );
}
