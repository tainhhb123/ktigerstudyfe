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
      <div className="rounded-lg bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10 overflow-x-auto">
        {/* Thanh tìm kiếm */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent">
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-3 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm từ vựng..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPageNumber(0);
                }}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setPageNumber(0);
                  }}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                  aria-label="Xóa tìm kiếm"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Header: Tổng số, phân trang */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b border-gray-200 dark:border-gray-700 gap-2">
          <span className="font-semibold text-gray-700 dark:text-white">
            Tổng số thuật ngữ: {filteredItems.length}
          </span>
          <div className="flex items-center space-x-2 md:justify-end mt-2 md:mt-0">
            <Button size="sm" variant="outline" disabled={pageNumber === 0} onClick={() => setPageNumber(pageNumber - 1)}>
              Trước
            </Button>
            {paginationPages.map((p, index) =>
              p === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500 dark:text-gray-400">…</span>
              ) : (
                <Button
                  key={p as number}
                  size="sm"
                  variant={p === pageNumber + 1 ? "primary" : "outline"}
                  onClick={() => setPageNumber((p as number) - 1)}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              size="sm"
              variant="outline"
              disabled={pageNumber + 1 >= totalPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Sau
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader className="bg-gray-50 border-b border-gray-200 dark:bg-white/5 dark:border-gray-700">
            <TableRow>
              <TableCell isHeader className="px-3 py-2 border-r border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-white text-sm w-[150px]">
                Thuật ngữ
              </TableCell>
              <TableCell isHeader className="px-3 py-2 border-r border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-white text-sm w-[200px]">
                Nghĩa
              </TableCell>
              <TableCell isHeader className="px-3 py-2 border-r border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-white text-sm w-[180px]">
                Ví dụ
              </TableCell>
              <TableCell isHeader className="px-3 py-2 border-r border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-white text-sm w-[60px] text-center">
                Ảnh
              </TableCell>
              <TableCell isHeader className="px-3 py-2 font-bold text-gray-700 dark:text-white text-sm w-[120px] text-center">
                Hành động
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key={`loading-vocab-${lessonId}`}>
                <td colSpan={5} className="py-4 text-center text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 text-sm">
                  Đang tải…
                </td>
              </TableRow>
            ) : filteredItems.length > 0 ? (
              filteredItems
                .slice(pageNumber * 10, (pageNumber + 1) * 10)
                .map((v) => (
                  <TableRow
                    key={v.vocabId}
                    className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/10"
                  >
                    <TableCell className="px-3 py-3 border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white text-sm">
                      <span className="block truncate">{v.word}</span>
                    </TableCell>
                    <TableCell className="px-3 py-3 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                      <span className="block truncate">{v.meaning}</span>
                    </TableCell>
                    <TableCell className="px-3 py-3 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                      <span className="block truncate">{v.example || "—"}</span>
                    </TableCell>
                    <TableCell className="px-3 py-3 border-r border-gray-200 dark:border-gray-700 text-center">
                      <div className="flex justify-center">
                        <MediaDisplay 
                          imageUrl={v.image} 
                          onImageClick={() => v.image && v.image.match(/\.(jpeg|jpg|gif|png|webp)$/i) && setPreviewSrc(v.image)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-3 text-center">
                      <div className="flex space-x-1 justify-center">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditClick(v)} 
                          className="text-xs px-2 py-1"
                        >
                          Sửa
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(v.vocabId, v.word)} 
                          className="text-xs px-2 py-1"
                        >
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow key={`no-data-vocab-${lessonId}`}>
                <td colSpan={5} className="py-4 text-center text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 text-sm">
                  Không có thuật ngữ
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
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