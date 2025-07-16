import React, { useEffect, useState } from 'react';
import DocumentCard, { Doc } from '../../../components/document/homedocument/DocumentCard';

const Home: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 8;

  const fetchDocs = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/document-lists/public?page=${pageNumber}&size=${pageSize}`
      );
      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }
      const data = await response.json();
      let items: Doc[] = [];
      let pages = 1;

      if (Array.isArray(data)) {
        // API trả về mảng các DocumentListResponse
        items = data;
      } else if (data.content && Array.isArray(data.content)) {
        // API trả về đối tượng phân trang
        items = data.content;
        pages = data.totalPages;
        setPage(data.number);
      } else {
        throw new Error('Unexpected response format');
      }

      setDocs(items);
      setTotalPages(pages);
    } catch (err: any) {
      console.error('Failed to fetch public docs:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs(page);
  }, [page]);

  if (loading) {
    return <p className="p-4 text-center">Đang tải dữ liệu…</p>;
  }

  if (error) {
    return (
      <p className="p-4 text-center text-red-600">
        Đã có lỗi xảy ra: {error}
      </p>
    );
  }

  if (!docs || docs.length === 0) {
    return (
      <p className="p-4 text-center text-gray-500">
        Chưa có tài liệu nào công khai.
      </p>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Bộ thẻ ghi nhớ phổ biến</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {docs.map((doc) => (
          <DocumentCard key={doc.listId} doc={doc} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 rounded border border-green-500 bg-green-100 text-green-700 hover:bg-green-500 hover:text-white disabled:opacity-50 transition"
        >
          Trước
        </button>

        <span className="text-green-700">
          Trang {page + 1} / {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="px-3 py-1 rounded border border-green-500 bg-green-100 text-green-700 hover:bg-green-500 hover:text-white disabled:opacity-50 transition"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default Home;
