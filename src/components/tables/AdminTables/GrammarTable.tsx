import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";
import { FaSearch } from 'react-icons/fa';

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({
    grammarTitle: '',
    grammarContent: '',
    grammarExample: ''
  });

  const fetchGrammar = async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/grammar-theories/lessons/${lessonId}/grammar/paged`, {
        params: {
          searchTerm,
          page: pageNumber,
          size: 10
        }
      });
      
      setItems(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching grammar:', error);
      setError('Failed to load grammar items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrammar();
  }, [lessonId, pageNumber, searchTerm]);

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
    setEditingId(grammar.grammarId);
    setEditValues({
      grammarTitle: grammar.grammarTitle,
      grammarContent: grammar.grammarContent,
      grammarExample: grammar.grammarExample || ''
    });
  };

  const handleUpdate = async (grammarId: number) => {
    try {
      await axios.put(`/api/grammar-theories/${grammarId}`, {
        ...editValues,
        lessonId
      });
      setEditingId(null);
      fetchGrammar(); // Refresh data after update
    } catch (error) {
      console.error('Error updating grammar:', error);
      alert('Failed to update grammar');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({
      grammarTitle: '',
      grammarContent: '',
      grammarExample: ''
    });
  };

  // Add handleDelete function
  const handleDelete = async (grammarId: number, grammarTitle: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa ngữ pháp "${grammarTitle}"?`)) {
      try {
        await axios.delete(`/api/grammar-theories/${grammarId}`);
        // Refresh the data after successful deletion
        fetchGrammar();
      } catch (error) {
        console.error('Error deleting grammar:', error);
        alert('Failed to delete grammar');
      }
    }
  };

  return (
    <div className="rounded-lg bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10 overflow-x-auto">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent">
        <div className="relative w-full max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <FaSearch className="absolute left-3 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm ngữ pháp..."
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

      {/* Pagination Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b border-gray-200 dark:border-gray-700 gap-2">
        <span className="font-semibold text-gray-700 dark:text-white">
          Tổng số ngữ pháp: {items.length}
        </span>
        <div className="flex items-center space-x-2 md:justify-end mt-2 md:mt-0">
          <Button 
            size="sm" 
            variant="outline" 
            disabled={pageNumber === 0} 
            onClick={() => setPageNumber(prev => prev - 1)}
          >
            Trước
          </Button>
          {paginationPages.map((p, index) =>
            p === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500 dark:text-gray-400">
                …
              </span>
            ) : (
              <Button
                key={`page-${p}`}
                size="sm"
                variant={(p as number) === pageNumber + 1 ? "primary" : "outline"}
                onClick={() => setPageNumber((p as number) - 1)}
              >
                {p}
              </Button>
            )
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={pageNumber >= totalPages - 1}
            onClick={() => setPageNumber(prev => prev + 1)}
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
              Tiêu đề
            </TableCell>
            <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-white">
              Nội dung
            </TableCell>
            <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-white">
              Ví dụ
            </TableCell>
            <TableCell isHeader className="px-5 py-3 font-bold text-gray-700 dark:text-white">
              Thao tác
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                Đang tải...
              </TableCell>
            </TableRow>
          ) : items.length > 0 ? (
            items.map((grammar) => (
              <TableRow key={grammar.grammarId} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/10">
                <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                  {editingId === grammar.grammarId ? (
                    <input
                      type="text"
                      name="grammarTitle"
                      value={editValues.grammarTitle}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    />
                  ) : (
                    grammar.grammarTitle
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                  {editingId === grammar.grammarId ? (
                    <textarea
                      name="grammarContent"
                      value={editValues.grammarContent}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-2 py-1 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    />
                  ) : (
                    grammar.grammarContent
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                  {editingId === grammar.grammarId ? (
                    <textarea
                      name="grammarExample"
                      value={editValues.grammarExample}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-2 py-1 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    />
                  ) : (
                    grammar.grammarExample || "—"
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    {editingId === grammar.grammarId ? (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleUpdate(grammar.grammarId)}
                        >
                          Cập nhật
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(grammar)}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(grammar.grammarId, grammar.grammarTitle)}
                        >
                          Xóa
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">
                Không có dữ liệu ngữ pháp
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}