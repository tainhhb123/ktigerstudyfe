// src/components/tables/AdminTables/DocumentItemTable.tsx
import React, { useEffect, useState, useMemo, Fragment } from "react";
import axiosInstance from "../../../services/axiosConfig";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";

interface Item {
  wordId: number;
  word: string;
  meaning: string;
  example?: string;
  vocabImage?: string;
}
interface Paged<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
interface Props {
  listId: number;
  keyword?: string;
}

export default function DocumentItemTable({ listId, keyword = "" }: Props) {
  const pageSize = 5;
  const [data, setData] = useState<Paged<Item>>({
    content: [],
    totalElements: 0,
    totalPages: 1,
    number: 0,
    size: pageSize,
  });
  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  // reset khi đổi listId hoặc keyword
  useEffect(() => {
    setData(d => ({ ...d, number: 0 }));
  }, [listId, keyword]);

  // fetch paged data
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get<Paged<Item>>(
        `/api/document-items/list/${listId}/paged?page=${data.number}&size=${pageSize}`
      )
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [listId, data.number]);

  const { content: items, totalPages, number: currentPage } = data;

  // filter client-side
  const filtered = useMemo(
    () =>
      items.filter(
        i =>
          i.word.toLowerCase().includes(keyword.toLowerCase()) ||
          i.meaning.toLowerCase().includes(keyword.toLowerCase())
      ),
    [items, keyword]
  );

  // build pagination với ellipsis
  const pages = useMemo<(number | string)[]>(() => {
    const result: (number | string)[] = [];
    const curr = currentPage + 1;
    const delta = 1;
    const left = Math.max(2, curr - delta);
    const right = Math.min(totalPages - 1, curr + delta);

    result.push(1);
    if (left > 2) result.push("...");
    for (let i = left; i <= right; i++) result.push(i);
    if (right < totalPages - 1) result.push("...");
    if (totalPages > 1) result.push(totalPages);

    return result;
  }, [currentPage, totalPages]);

  const goToPage = (i: number) => setData(d => ({ ...d, number: i }));

  return (
    <Fragment>
      {/* Container chính */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>

        {/* Header + phân trang */}
        <div className="flex justify-between items-center p-4" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
          <span className="font-semibold" style={{ color: '#333333' }}>
            📝 Tổng số từ: <strong>{filtered.length}</strong>
          </span>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
              disabled={currentPage === 0}
              onClick={() => goToPage(currentPage - 1)}
            >
              Trước
            </button>
            {pages.map((p, idx) =>
              p === "..." ? (
                <span key={idx} className="px-2" style={{ color: '#999999' }}>…</span>
              ) : (
                <button
                  key={idx}
                  className="px-3 py-1.5 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: p === currentPage + 1 ? '#FF6B35' : '#FFFFFF',
                    color: p === currentPage + 1 ? '#FFFFFF' : '#FF6B35',
                    border: '1px solid #FF6B35'
                  }}
                  onClick={() => goToPage((p as number) - 1)}
                >
                  {p}
                </button>
              )
            )}
            <button
              className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
              disabled={currentPage + 1 >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Sau
            </button>
          </div>
        </div>

        {/* Bảng từ vựng */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#FFE8DC' }}>
              <tr>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Từ vựng</th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Nghĩa</th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35' }}>Ví dụ</th>
                <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35' }}>Ảnh</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 rounded-full animate-spin mb-3" 
                           style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
                      <span style={{ color: '#666666' }}>Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map(i => (
                  <tr 
                    key={i.wordId}
                    className="border-t transition-colors"
                    style={{ borderColor: '#FFE8DC' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="px-4 py-4 font-semibold" style={{ color: '#333333' }}>{i.word}</td>
                    <td className="px-4 py-4" style={{ color: '#333333' }}>{i.meaning}</td>
                    <td className="px-4 py-4" style={{ color: '#666666' }}>{i.example || "-"}</td>
                    <td className="px-4 py-4 text-center">
                      {i.vocabImage ? (
                        <img
                          src={i.vocabImage}
                          alt={i.word}
                          className="h-8 w-8 rounded cursor-pointer inline-block border-2 hover:scale-110 transition-transform"
                          style={{ borderColor: '#FFE8DC' }}
                          onClick={() => setPreviewSrc(i.vocabImage!)}
                        />
                      ) : (
                        <span style={{ color: '#999999' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="text-6xl mb-4">📖</div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>Không có từ nào</h3>
                    <p style={{ color: '#666666' }}>Tài liệu này chưa có từ vựng</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal preview ảnh */}
      {previewSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setPreviewSrc(null)}>
          <div className="relative bg-white rounded-xl p-4 max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 p-2 rounded-full transition-all"
              style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
              onClick={() => setPreviewSrc(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={previewSrc}
              alt="Preview"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}
