// src/pages/document/Home.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DocumentCard, { Doc } from '../../../components/document/homedocument/DocumentCard';

export default function Home() {
  // Giả sử bạn đã set VITE_API_BASE_URL = "http://localhost:8080/api" trong .env
  const API = import.meta.env.VITE_API_BASE_URL;
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${API}/document-lists/public`;
    console.log('→ Fetching public docs from:', url);
    fetch(url)
      .then(res => {
        console.log('← Response status:', res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Doc[]>;
      })
      .then(data => {
        console.log('← Fetched docs:', data);
        setDocs(data);
      })
      .catch(err => {
        console.error('Error fetching public docs:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API]);

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
        <Link
          to="/documents/popular"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          Xem thêm
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {docs.map(doc => (
          <DocumentCard key={doc.listId} doc={doc} />
        ))}
      </div>
    </div>
  );
}
