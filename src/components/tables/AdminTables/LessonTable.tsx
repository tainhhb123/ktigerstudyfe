// src/components/tables/AdminTables/LessonTable.tsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";

interface Lesson {
  lessonId: number;
  lessonName: string;
  lessonDescription: string;
}

interface Paged<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // zero-based
  size: number;
}

export interface LessonTableProps {
  levelId: number;
  keyword: string;
}

export default function LessonTable({ levelId, keyword }: LessonTableProps) {
  const pageSize = 5;
  const [data, setData] = useState<Paged<Lesson>>({
    content: [],
    totalElements: 0,
    totalPages: 1,
    number: 0,
    size: pageSize,
  });
  const [loading, setLoading] = useState(false);

  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ lessonName: string; lessonDescription: string }>({
    lessonName: "",
    lessonDescription: "",
  });

  // Fetch data helper
  const fetchData = () => {
    setLoading(true);
    const { number: page } = data;
    axios
      .get<Paged<Lesson>>("/api/lessons/paged", {
        params: { page, size: pageSize, levelId, keyword: keyword.trim() || undefined },
      })
      .then((res) => setData(res.data))
      .catch(() =>
        setData({ content: [], totalElements: 0, totalPages: 1, number: 0, size: pageSize })
      )
      .finally(() => setLoading(false));
  };

  // Initial load & on pagination/filter change
  useEffect(() => {
    setData((d) => ({ ...d, number: 0 }));
  }, [levelId, keyword]);

  useEffect(() => {
    fetchData();
  }, [data.number, levelId, keyword]);

  // Start inline edit
  const handleEditClick = (lesson: Lesson) => {
    setEditingId(lesson.lessonId);
    setEditValues({
      lessonName: lesson.lessonName,
      lessonDescription: lesson.lessonDescription,
    });
  };

  // Cancel inline edit
  const handleCancel = () => {
    setEditingId(null);
  };

  // Handle field change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  // Submit inline update
  const handleUpdate = (id: number) => {
    setLoading(true);
    axios
      .put(`/api/lessons/${id}`, {
        lessonName: editValues.lessonName,
        lessonDescription: editValues.lessonDescription,
      })
      .then(() => {
        setEditingId(null);
        fetchData();
      })
      .finally(() => setLoading(false));
  };

  const { content: lessons, totalElements, totalPages, number: currentPage } = data;

  // Pagination array with ellipsis
  const pages = useMemo<(number | string)[]>(() => {
    const arr: (number | string)[] = [];
    const curr = currentPage + 1;
    const delta = 1;
    const left = Math.max(2, curr - delta);
    const right = Math.min(totalPages - 1, curr + delta);
    arr.push(1);
    if (left > 2) arr.push("...");
    for (let i = left; i <= right; i++) arr.push(i);
    if (right < totalPages - 1) arr.push("...");
    if (totalPages > 1) arr.push(totalPages);
    return arr;
  }, [currentPage, totalPages]);

  const goToPage = (idx: number) => setData((d) => ({ ...d, number: idx }));

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 overflow-x-auto">
      {/* Header & Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          Tổng số bài: {totalElements}
        </span>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <Button size="sm" variant="outline" disabled={currentPage === 0} onClick={() => goToPage(currentPage - 1)}>
            Trước
          </Button>
          {pages.map((p, i) =>
            p === "..." ? (
              <span key={i} className="px-2 text-gray-500 dark:text-gray-400">
                …
              </span>
            ) : (
              <Button
                key={i}
                size="sm"
                variant={p === currentPage + 1 ? "primary" : "outline"}
                onClick={() => goToPage((p as number) - 1)}
              >
                {p}
              </Button>
            )
          )}
          <Button size="sm" variant="outline" disabled={currentPage + 1 >= totalPages} onClick={() => goToPage(currentPage + 1)}>
            Sau
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <TableRow>
            <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-gray-600 font-bold text-gray-800 dark:text-gray-200">
              Tên bài
            </TableCell>
            <TableCell isHeader className="px-5 py-3 border-r border-gray-200 dark:border-gray-600 font-bold text-gray-800 dark:text-gray-200">
              Mô tả
            </TableCell>
            <TableCell isHeader className="px-5 py-3 font-bold text-gray-800 dark:text-gray-200">
              Hành động
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <td colSpan={3} className="py-6 text-center text-gray-500 dark:text-gray-400">
                Đang tải…
              </td>
            </TableRow>
          ) : lessons.length > 0 ? (
            lessons.map((l) => (
              <TableRow key={l.lessonId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {/* Inline edit or static view */}
                <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                  {editingId === l.lessonId ? (
                    <input
                      name="lessonName"
                      value={editValues.lessonName}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    l.lessonName
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                  {editingId === l.lessonId ? (
                    <textarea
                      name="lessonDescription"
                      value={editValues.lessonDescription}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    l.lessonDescription
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 text-center">
                  {editingId === l.lessonId ? (
                    <div className="flex space-x-2 justify-center">
                      <Button size="sm" variant="primary" onClick={() => handleUpdate(l.lessonId)}>
                        Cập nhật
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEditClick(l)}>
                      Sửa
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <td colSpan={3} className="py-6 text-center text-gray-500 dark:text-gray-400">
                Không có bài học
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
