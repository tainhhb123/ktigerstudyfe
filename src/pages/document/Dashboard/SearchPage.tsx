import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentCard, { Doc } from "../../../components/document/homedocument/DocumentCard";

export const SearchPage: React.FC = () => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const location = useLocation();
    const navigate = useNavigate();

    // parse query params
    const query = new URLSearchParams(location.search);
    const keyword = query.get("keyword") || "";
    const pageParam = parseInt(query.get("page") || "0", 10);
    const sizeParam = parseInt(query.get("size") || "8", 10);

    const [docs, setDocs] = useState<Doc[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(pageParam);
    const [pageSize] = useState(sizeParam);
    const [totalPages, setTotalPages] = useState(1);

    // fetch whenever keyword, page, or pageSize changes
    useEffect(() => {
        // sync URL
        const params = new URLSearchParams();
        if (keyword) params.set("keyword", keyword);
        params.set("page", String(page));
        params.set("size", String(pageSize));
        if (location.search !== `?${params.toString()}`) {
            navigate({ search: params.toString() }, { replace: true });
        }

        const fetchDocs = async () => {
            setLoading(true);
            setError(null);
            try {
                const base = `${API_URL}/document-lists`;
                const url = keyword
                    ? `${base}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${pageSize}`
                    : `${base}/public?page=${page}&size=${pageSize}`;

                const res = await fetch(url);
                if (!res.ok) throw new Error(`Server error ${res.status}`);

                const data = await res.json();
                let items: Doc[] = [];
                let pages = 1;

                if (Array.isArray(data)) {
                    items = data;
                } else if (data.content && Array.isArray(data.content)) {
                    items = data.content;
                    pages = data.totalPages;
                } else {
                    throw new Error("Unexpected response format");
                }

                setDocs(items);
                setTotalPages(pages);
            } catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchDocs();
    }, [API_URL, keyword, page, pageSize, navigate, location.search]);

    if (loading) {
        return <p className="p-4 text-center">Đang tải dữ liệu…</p>;
    }
    if (error) {
        return <p className="p-4 text-center text-red-600">Lỗi: {error}</p>;
    }
    if (docs.length === 0) {
        return <p className="p-4 text-center text-gray-500">Không tìm thấy tài liệu.</p>;
    }

    return (
        <div className="px-4 py-6 space-y-6">
            <h1 className="text-2xl font-semibold">
                {keyword ? `Kết quả tìm kiếm “${keyword}”` : "Bộ thẻ ghi nhớ phổ biến"}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {docs.map((doc) => (
                    <DocumentCard key={doc.listId} doc={doc} />
                ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-10">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    disabled={page === 0}
                    className="px-3 py-1 rounded border bg-green-100 text-green-700 hover:bg-green-500 hover:text-white disabled:opacity-50 transition"
                >
                    Trước
                </button>

                <span className="text-green-700">
                    {page + 1} / {totalPages}
                </span>

                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1 rounded border bg-green-100 text-green-700 hover:bg-green-500 hover:text-white disabled:opacity-50 transition"
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default SearchPage;
