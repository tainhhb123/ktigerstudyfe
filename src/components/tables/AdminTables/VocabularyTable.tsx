// src/components/tables/AdminTables/VocabularyTable.tsx
import { useEffect, useState, useMemo } from "react"; // Remove useCallback
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";
import { FaSearch } from 'react-icons/fa';

interface Vocabulary {
  vocabId: number;
  word: string;
  meaning: string;
  example?: string;
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
  // Remove unused totalElements state
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ word: "", meaning: "", example: "" });

  // Fetch vocabulary data
  const fetchVocabulary = async () => {
    if (!lessonId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Add logging to debug
      console.log('Fetching vocabulary for lesson:', lessonId);
      
      const response = await axios.get('/api/vocabulary-theories', {
        params: {
          lessonId: lessonId
        }
      });
      
      // Log the response to see what we're getting
      console.log('API Response:', response.data);
      
      // Verify the data matches our lessonId
      const filteredData = response.data.filter((item: Vocabulary) => 
        item.lessonId === lessonId
      );
      
      console.log('Filtered data:', filteredData);
      
      if (filteredData.length > 0) {
        setItems(filteredData);
      } else {
        setItems([]);
        console.warn('No vocabulary found for lesson:', lessonId);
      }
      
      setTotalPages(Math.ceil(filteredData.length / 10));
    } catch (error: unknown) {
      console.error('Error details:', error);
      setError('Failed to fetch vocabulary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabulary();
  }, [lessonId]);

  // Handle edit click
  const handleEditClick = (vocab: Vocabulary) => {
    setEditingId(vocab.vocabId);
    setEditValues({
      word: vocab.word,
      meaning: vocab.meaning,
      example: vocab.example || ""
    });
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle update
  const handleUpdate = async (vocabId: number) => {
    try {
      await axios.put(`/api/vocabulary-theories/${vocabId}`, {
        ...editValues,
        lessonId
      });
      setEditingId(null);
      fetchVocabulary();
    } catch (error) {
      console.error('Error updating vocabulary:', error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditingId(null);
    setEditValues({ word: "", meaning: "", example: "" });
  };

  // Handle delete
  const handleDelete = async (vocabId: number, word: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa từ vựng "${word}"?`)) {
      try {
        await axios.delete(`/api/vocabulary-theories/${vocabId}`);
        fetchVocabulary();
      } catch (error) {
        console.error('Error deleting vocabulary:', error);
      }
    }
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

  if (loading) {
    return <div>Loading vocabulary...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="rounded-lg bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10 overflow-x-auto">
      {/* Thanh tìm kiếm nằm trên cùng */}
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
            <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-white">
              Thuật ngữ
            </TableCell>
            <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-white">
              Nghĩa
            </TableCell>
            <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-white">
              Ví dụ
            </TableCell>
            <TableCell isHeader className="px-5 py-3 font-bold text-gray-700 dark:text-white">
              Hành động
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow key={`loading-vocab-${lessonId}`}>
              <td colSpan={4} className="py-6 text-center text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
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
                  <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                    {editingId === v.vocabId ? (
                      <input
                        name="word"
                        value={editValues.word}
                        onChange={handleInputChange}
                        className="w-full border rounded shadow-sm focus:ring focus:border-blue-500 bg-white text-gray-900 dark:bg-zinc-700 dark:text-gray-100 dark:border-zinc-600"
                      />
                    ) : (
                      v.word
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                    {editingId === v.vocabId ? (
                      <textarea
                        name="meaning"
                        value={editValues.meaning}
                        onChange={handleInputChange}
                        className="w-full border rounded shadow-sm focus:ring focus:border-blue-500 h-20 resize-y bg-white text-gray-900 dark:bg-zinc-700 dark:text-gray-100 dark:border-zinc-600"
                      />
                    ) : (
                      v.meaning
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                    {editingId === v.vocabId ? (
                      <textarea
                        name="example"
                        value={editValues.example}
                        onChange={handleInputChange}
                        className="w-full border rounded shadow-sm focus:ring focus:border-blue-500 h-20 resize-y bg-white text-gray-900 dark:bg-zinc-700 dark:text-gray-100 dark:border-zinc-600"
                      />
                    ) : (
                      v.example || "—"
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    {editingId === v.vocabId ? (
                      <div className="flex space-x-2 justify-center">
                        <Button size="sm" variant="primary" onClick={() => handleUpdate(v.vocabId)}>
                          Cập nhật
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          Hủy
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-2 justify-center">
                        <Button size="sm" variant="outline" onClick={() => handleEditClick(v)}>
                          Sửa
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(v.vocabId, v.word)}>
                          Xóa
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow key={`no-data-vocab-${lessonId}`}>
              <td colSpan={4} className="py-6 text-center text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                Không có thuật ngữ
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}