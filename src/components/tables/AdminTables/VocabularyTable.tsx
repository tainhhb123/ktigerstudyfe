// src/components/tables/AdminTables/VocabularyTable.tsx
import { useEffect, useState, useMemo, Fragment } from "react";
import axiosInstance from "../../../services/axiosConfig";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";
import { FaSearch } from 'react-icons/fa';
import AddVocabularyModal from "../../modals/AddVocabularyModal"; // Import modal

interface Vocabulary {
  vocabId: number;
  word: string;
  meaning: string;
  example?: string;
  image?: string;
  lessonId: number;
}

export interface VocabularyTableProps {
  lessonId: number;
}

export default function VocabularyTable({ lessonId }: VocabularyTableProps) {
  const [items, setItems] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  
  // States cho edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVocab, setEditingVocab] = useState<Vocabulary | null>(null);

  // Fetch vocabulary data
  const fetchVocabulary = async () => {
    if (!lessonId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching vocabulary for lesson:', lessonId);
      
      // 🔍 Sử dụng relative path như DocumentReportTable
      const response = await axiosInstance.get(`/api/vocabulary-theories/lesson/${lessonId}`);
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.length > 0) {
        setItems(response.data);
        setTotalPages(Math.ceil(response.data.length / 10));
      } else {
        setItems([]);
        setTotalPages(1);
        console.warn('No vocabulary found for lesson:', lessonId);
      }
      
    } catch (error: unknown) {
      console.error('Error details:', error);
      if (axiosInstance.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
      setError('Failed to fetch vocabulary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabulary();
  }, [lessonId]);

  // Handle edit click - mở modal thay vì edit inline
  const handleEditClick = (vocab: Vocabulary) => {
    setEditingVocab(vocab);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (vocabId: number, word: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa từ vựng "${word}"?`)) {
      try {
        console.log("Deleting vocabulary ID:", vocabId);
        
        // 🔍 Sử dụng relative path
        await axiosInstance.delete(`/api/vocabulary-theories/${vocabId}`);
        
        console.log("Delete successful");
        alert("Xóa từ vựng thành công!");
        fetchVocabulary(); // Refresh data
      } catch (error) {
        console.error('Error deleting vocabulary:', error);
        if (axiosInstance.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || error.message;
          alert(`Lỗi xóa từ vựng: ${errorMessage}`);
        } else {
          alert("Lỗi xóa từ vựng!");
        }
      }
    }
  };

  // Handle modal success
  const handleModalSuccess = () => {
    setIsEditModalOpen(false);
    setEditingVocab(null);
    fetchVocabulary(); // Refresh data
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setEditingVocab(null);
  };

  // Calculate pagination pages
  const paginationPages = useMemo(() => {
    const pages = [];
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

  // Filter items based on search
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  // Component để hiển thị media với khả năng click để preview
  const MediaDisplay = ({ imageUrl, onImageClick }: { imageUrl?: string; onImageClick?: () => void }) => {
    if (!imageUrl) {
      return <span className="text-gray-400 text-xs">Không có</span>;
    }

    const isImage = imageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i);
    const isAudio = imageUrl.match(/\.(mp3|wav|ogg)$/i);
    const isVideo = imageUrl.match(/\.(mp4|webm|mov)$/i);

    if (isImage) {
      return (
        <img
          src={imageUrl}
          alt="Media"
          className="w-8 h-8 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onImageClick}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      );
    } else if (isAudio) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98L12 3.75v11.5a3 3 0 11-1-2.25V4.25L7.804 3.02A1 1 0 006 4v11.5a3 3 0 101 2.25V4a1 1 0 00-.804-.98z"/>
            </svg>
          </div>
        </div>
      );
    } else if (isVideo) {
      return (
        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
          </svg>
        </div>
      );
    }

    return (
      <span className="text-blue-500 text-xs">Ảnh</span>
    );
  };

  if (loading) {
    return <div>Loading vocabulary...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Fragment>
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
        {/* Thanh tìm kiếm */}
        <div className="p-4" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-3" style={{ color: '#999999' }} />
              <input
                type="text"
                placeholder="Tìm kiếm từ vựng..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPageNumber(0);
                }}
                className="w-full pl-10 pr-10 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
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

        {/* Header: Tổng số, phân trang */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-2" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #FFE8DC' }}>
          <span className="font-semibold" style={{ color: '#333333' }}>
            📚 Tổng số từ vựng: <strong>{filteredItems.length}</strong>
          </span>
          <div className="flex items-center space-x-2 md:justify-end mt-2 md:mt-0">
            <button
              className="px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#FFE8DC', color: '#FF6B35', border: '1px solid #FF6B35' }}
              disabled={pageNumber === 0}
              onClick={() => setPageNumber(pageNumber - 1)}
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
              disabled={pageNumber + 1 >= totalPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Sau
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full" style={{ tableLayout: 'fixed' }}>
            <thead style={{ backgroundColor: '#FFE8DC' }}>
              <tr>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '120px' }}>Từ vựng</th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '180px' }}>Nghĩa</th>
                <th className="px-4 py-3 text-left font-bold" style={{ color: '#FF6B35', width: '200px' }}>Ví dụ</th>
                <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35', width: '60px' }}>Ảnh</th>
                <th className="px-4 py-3 text-center font-bold" style={{ color: '#FF6B35', width: '120px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 rounded-full animate-spin mb-3" 
                           style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
                      <span style={{ color: '#666666' }}>Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems
                  .slice(pageNumber * 10, (pageNumber + 1) * 10)
                  .map((v) => (
                    <tr
                      key={v.vocabId}
                      className="border-t transition-colors"
                      style={{ borderColor: '#FFE8DC' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="px-4 py-4 font-semibold" style={{ color: '#333333' }}>
                        <span className="block" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{v.word}</span>
                      </td>
                      <td className="px-4 py-4" style={{ color: '#666666' }}>
                        <span className="block" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{v.meaning}</span>
                      </td>
                      <td className="px-4 py-4" style={{ color: '#666666' }}>
                        <span className="block" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{v.example || "—"}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <MediaDisplay 
                            imageUrl={v.image} 
                            onImageClick={() => v.image && v.image.match(/\.(jpeg|jpg|gif|png|webp)$/i) && setPreviewSrc(v.image)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(v)}
                            className="px-3 py-1.5 rounded-lg font-medium transition-all text-sm"
                            style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFDCC8'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFE8DC'}
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(v.vocabId, v.word)}
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
                  <td colSpan={5} className="text-center py-12">
                    <div className="text-4xl mb-2">📚</div>
                    <span style={{ color: '#666666' }}>Không có từ vựng</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit/Add Vocabulary */}
      <AddVocabularyModal
        lessonId={lessonId}
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editData={editingVocab} // Truyền data để edit
      />

      {/* 🔍 Image Preview Modal - CHỈ GIỮ CÁI NÀY */}
      {previewSrc && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewSrc(null)}
        >
          <div className="relative">
            <button
              onClick={() => setPreviewSrc(null)}
              className="absolute -top-8 right-0 text-gray-600 hover:text-gray-800 text-2xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
            >
              ×
            </button>
            <img
              src={previewSrc}
              alt="Preview"
              className="w-96 h-96 object-contain rounded-lg shadow-xl bg-white border"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}