// src/components/tables/AdminTables/DocumentItemTable.tsx
import React, { useEffect, useState, useMemo, Fragment } from "react";
import axios from "axios";
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
    axios
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
      <div className="rounded-lg bg-white shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-x-auto">

        {/* Header + phân trang */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Tổng số từ: {filtered.length}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => goToPage(currentPage - 1)}
            >
              Trước
            </Button>
            {pages.map((p, idx) =>
              p === "..." ? (
                <span key={idx} className="px-2 text-gray-500 dark:text-gray-400">…</span>
              ) : (
                <Button
                  key={idx}
                  size="sm"
                  variant={p === currentPage + 1 ? "primary" : "outline"}
                  onClick={() => goToPage((p as number) - 1)}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage + 1 >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Sau
            </Button>
          </div>
        </div>

        {/* Bảng từ vựng */}
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <TableRow>
              <TableCell
                isHeader
                className="px-4 py-2 font-bold dark:text-gray-200 border-r border-gray-200 dark:border-gray-700"
              >
                Từ vựng
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-2 font-bold dark:text-gray-200 border-r border-gray-200 dark:border-gray-700"
              >
                Nghĩa
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-2 font-bold dark:text-gray-200 border-r border-gray-200 dark:border-gray-700"
              >
                Ví dụ
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-2 text-center font-bold dark:text-gray-200"
              >
                Ảnh
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={4} className="py-6 text-center text-gray-500 dark:text-gray-400">
                  Đang tải…
                </td>
              </TableRow>
            ) : filtered.length > 0 ? (
              filtered.map(i => (
                <TableRow
                  key={i.wordId}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell className="px-4 py-2 border-r dark:text-gray-200">{i.word}</TableCell>
                  <TableCell className="px-4 py-2 border-r dark:text-gray-200">{i.meaning}</TableCell>
                  <TableCell className="px-4 py-2 border-r dark:text-gray-200">{i.example || "-"}</TableCell>
                  <TableCell className="px-4 py-2 text-center dark:text-gray-200">
                    {i.vocabImage ? (
                      <img
                        src={i.vocabImage}
                        alt={i.word}
                        className="h-6 w-6 rounded cursor-pointer inline-block"
                        onClick={() => setPreviewSrc(i.vocabImage!)}
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={4} className="py-6 text-center text-gray-500 dark:text-gray-400">
                  Không có từ nào
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal preview ảnh */}
      {previewSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Nội dung ảnh */}
          <div className="relative bg-transparent rounded-lg p-4 max-w-2xl max-h-[80vh] overflow-hidden">
            {/* nút đóng */}
            <button
              className="absolute top-2 right-2 text-black hover:text-gray-300"
              onClick={() => setPreviewSrc(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* ảnh chính */}
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
