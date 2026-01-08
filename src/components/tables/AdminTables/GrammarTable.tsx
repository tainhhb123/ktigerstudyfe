import { useEffect, useState, useMemo, useCallback, Fragment } from "react";
import axiosInstance from "../../../services/axiosConfig";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";
import { FaSearch } from "react-icons/fa";
import AddGrammarModal from "../../modals/AddGrammarModal";

interface Grammar {
  grammarId: number;
  lessonId: number;
  grammarTitle: string;
  grammarContent: string;
  grammarExample?: string;
}

interface GrammarTableProps {
  lessonId: number;
}

export default function GrammarTable({ lessonId }: GrammarTableProps) {
  const [items, setItems] = useState<Grammar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGrammar, setEditingGrammar] = useState<Grammar | null>(null);

  useEffect(() => {
    setPageNumber(0);
    setSearchTerm("");
    setError(null);
    setItems([]);
  }, [lessonId]);

  const fetchGrammar = useCallback(async () => {
    if (!lessonId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/api/grammar-theories/lessons/${lessonId}/grammar/paged`, {
        params: {
          searchTerm: searchTerm || "",
          page: pageNumber,
          size: 10
        }
      });

      setItems(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch {
      setError("Không thể tải dữ liệu ngữ pháp");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [lessonId, pageNumber, searchTerm]);

  useEffect(() => {
    fetchGrammar();
  }, [fetchGrammar]);

  const paginationPages = useMemo(() => {
    const pages: (number | string)[] = [];
    for (let i = 0; i < totalPages; i++) {
      if (
        i === 0 ||
        i === totalPages - 1 ||
        (i >= pageNumber - 1 && i <= pageNumber + 1)
      ) {
        pages.push(i + 1);
      } else if (i === pageNumber - 2 || i === pageNumber + 2) {
        pages.push("...");
      }
    }
    return pages;
  }, [totalPages, pageNumber]);

  const handleEditClick = (grammar: Grammar) => {
    setEditingGrammar(grammar);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (grammarId: number, grammarTitle: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa ngữ pháp "${grammarTitle}"?`)) {
      try {
        setLoading(true);
        await axiosInstance.delete(`/api/grammar-theories/${grammarId}`);
        alert("Xóa ngữ pháp thành công!");
        fetchGrammar();
      } catch {
        alert("Lỗi khi xóa ngữ pháp!");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModalSuccess = () => {
    setIsEditModalOpen(false);
    setEditingGrammar(null);
    fetchGrammar();
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setEditingGrammar(null);
  };

  return (
    <Fragment>
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
        <div className="p-4" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-3" style={{ color: '#999999' }} />
              <input
                type="text"
                placeholder="Tìm kiếm ngữ pháp..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPageNumber(0);
                }}
                className="w-full pl-10 pr-10 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF' }}
                onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setPageNumber(0);
                  }}
                  className="absolute right-3 text-xl font-bold transition-colors"
                  style={{ color: '#999999' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#999999'}
                  aria-label="Xóa tìm kiếm"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-2" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
          <span className="font-semibold" style={{ color: '#333333' }}>
            📖 Tổng số ngữ pháp: <strong>{items.length}</strong>
          </span>
          <div className="flex items-center space-x-2 md:justify-end mt-2 md:mt-0">
            <button
              className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
              disabled={pageNumber === 0}
              onClick={() => setPageNumber((prev) => prev - 1)}
            >
              Trước
            </button>
            {paginationPages.map((p, index) =>
              p === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2" style={{ color: '#999999' }}>…</span>
              ) : (
                <button
                  key={`page-${p}`}
                  className="px-3 py-1.5 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: (p as number) === pageNumber + 1 ? '#FF6B35' : '#FFFFFF',
                    color: (p as number) === pageNumber + 1 ? '#FFFFFF' : '#FF6B35',
                    border: '1px solid #FF6B35'
                  }}
                  onClick={() => setPageNumber((p as number) - 1)}
                >
                  {p}
                </button>
              )
            )}
            <button
              className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
              disabled={pageNumber >= totalPages - 1}
              onClick={() => setPageNumber((prev) => prev + 1)}
            >
              Sau
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ tableLayout: 'fixed' }}>
            <thead style={{ backgroundColor: '#FFE8DC' }}>
              <tr>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '150px' }}>Tiêu đề</th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '40%' }}>Nội dung</th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '25%' }}>Ví dụ</th>
                <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35', width: '120px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={4} className="text-center py-12" style={{ color: '#C62828' }}>
                    <div className="text-4xl mb-2">⚠️</div>
                    {error}
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 rounded-full animate-spin mb-3" 
                           style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
                      <span style={{ color: '#666666' }}>Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((grammar) => (
                  <tr
                    key={grammar.grammarId}
                    className="border-t transition-colors"
                    style={{ borderColor: '#FFE8DC' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="px-4 py-4 font-semibold" style={{ color: '#333333', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <span className="block">{grammar.grammarTitle}</span>
                    </td>
                    <td className="px-4 py-4" style={{ color: '#666666', wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                      <span className="block">{grammar.grammarContent}</span>
                    </td>
                    <td className="px-4 py-4" style={{ color: '#666666', wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                      <span className="block">{grammar.grammarExample || "—"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(grammar)}
                          className="px-3 py-1.5 rounded-lg font-medium transition-all text-sm"
                          style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFDCC8'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFE8DC'}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(grammar.grammarId, grammar.grammarTitle)}
                          className="px-3 py-1.5 rounded-lg font-medium transition-all text-sm"
                          style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFCDD2'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFEBEE'}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="text-6xl mb-4">📖</div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>Không có dữ liệu</h3>
                    <p style={{ color: '#666666' }}>Chưa có ngữ pháp nào trong bài học này</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddGrammarModal
        lessonId={lessonId}
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editData={editingGrammar}
      />
    </Fragment>
  );
}