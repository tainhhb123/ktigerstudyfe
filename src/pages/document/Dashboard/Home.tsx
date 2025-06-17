// src/pages/document/Home.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DocumentCard, { Doc } from '../../../components/document/homedocument/DocumentCard';

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  number: number;       // current page (0-based)
}

export default function Home() {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    setLoading(true);
    const url = `${API}/document-lists/public?page=${page}&size=${pageSize}`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<PageResponse<Doc>>;
      })
      .then(data => {
        setDocs(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(err => console.error('Error fetching public docs:', err))
      .finally(() => setLoading(false));
  }, [API, page]);

  if (loading) {
    return <p className="p-4 text-center">Đang tải dữ liệu…</p>;
  }

  if (docs.length === 0) {
    return <p className="p-4 text-center text-gray-500">Chưa có tài liệu nào công khai.</p>;
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Bộ thẻ ghi nhớ phổ biến</h1>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {docs.map(doc => (
          <DocumentCard key={doc.listId} doc={doc} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 rounded border border-green-500 bg-green-100 text-green-700 hover:bg-green-500 hover:text-white disabled:opacity-50 transition"
        >
          Trước
        </button>

        <span className="text-green-700">
          Page {page + 1} / {totalPages}
        </span>

        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
          className="px-3 py-1 rounded border border-green-500 bg-green-100 text-green-700 hover:bg-green-500 hover:text-white disabled:opacity-50 transition"
        >
          Sau
        </button>
      </div>

    </div>
  );
}
