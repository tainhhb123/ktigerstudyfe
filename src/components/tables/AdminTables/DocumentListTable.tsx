import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";
import Button from "../../ui/button/Button";

export interface DocumentListResponse {
  listId: number;
  fullName: string;
  title: string;
  createdAt: string;
}

interface Paged<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // zero-based
  size: number;
}

interface DocumentListTableProps {
  keyword: string;
  selectedListId: number | null;
  onSelectList: (id: number | null) => void;
  onDeleteList: (id: number) => void;
  compact?: boolean; // hide header/pagination
}

export default function DocumentListTable({
  keyword,
  selectedListId,
  onSelectList,
  onDeleteList,
  compact = false,
}: DocumentListTableProps) {
  const pageSize = 5;
  const [data, setData] = useState<Paged<DocumentListResponse>>({
    content: [],
    totalElements: 0,
    totalPages: 1,
    number: 0,
    size: pageSize,
  });
  const [loading, setLoading] = useState(false);

  // Reset về page 0 khi đổi từ khóa tìm kiếm hoặc đổi tài liệu đang xem
  useEffect(() => {
    setData((d) => ({ ...d, number: 0 }));
  }, [keyword, selectedListId]);

  // Hàm fetch dữ liệu phân trang
  const fetchData = () => {
    setLoading(true);
    
    // Sử dụng API mới: chỉ có /public/paged (tìm kiếm tất cả tài liệu)
    const baseUrl = `/api/document-lists/public/paged`;
    
    axios
      .get<Paged<DocumentListResponse>>(baseUrl, {
        params: {
          keyword: keyword.trim(), // Tìm kiếm theo title hoặc tên tác giả
          page: data.number,
          size: pageSize,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Lỗi khi fetch dữ liệu:", err);
        // Hiển thị thông báo lỗi cho user
        alert("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!");
      })
      .finally(() => setLoading(false));
  };

  // Fetch khi thay đổi keyword hoặc page
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [keyword, data.number]);

  // Trigger refetch khi có thay đổi (sau khi xóa)
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [selectedListId]); // Refetch khi selectedListId thay đổi

  const { content, totalElements, totalPages, number: currentPage } = data;

  // Hiển thị 1 tài liệu nếu đang xem chi tiết, ngược lại hiển thị tất cả
  const lists = useMemo(
    () =>
      selectedListId != null
        ? content.filter((l) => l.listId === selectedListId)
        : content,
    [content, selectedListId]
  );

  // Pagination logic
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

  const goToPage = (i: number) => setData((d) => ({ ...d, number: i }));

  return (
    <div className="rounded-lg bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10 overflow-x-auto">
      {/* Header & pagination */}
      {!compact && (
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="font-semibold text-gray-700 dark:text-white">
            Tổng số tài liệu: {totalElements}
            {keyword && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                (Tìm kiếm: "{keyword}")
              </span>
            )}
          </span>
          {selectedListId == null && (
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
                  <span
                    key={idx}
                    className="px-2 text-gray-500 dark:text-gray-400"
                  >
                    …
                  </span>
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
          )}
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-700">
          <TableRow>
            <TableCell
              isHeader
              className="px-4 py-2 text-center font-bold dark:text-white border-r border-gray-200 dark:border-gray-700"
            >
              Học viên
            </TableCell>
            <TableCell
              isHeader
              className="px-4 py-2 font-bold dark:text-white border-r border-gray-200 dark:border-gray-700"
            >
              Tiêu đề
            </TableCell>
            <TableCell
              isHeader
              className="px-4 py-2 text-center font-bold dark:text-white border-r border-gray-200 dark:border-gray-700"
            >
              Ngày chia sẻ
            </TableCell>
            <TableCell
              isHeader
              className="px-4 py-2 text-center font-bold dark:text-white"
            >
              Hành động
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              <td
                colSpan={4}
                className="py-6 text-center text-gray-500 dark:text-gray-400"
              >
                Đang tải…
              </td>
            </TableRow>
          ) : lists.length > 0 ? (
            lists.map((l) => (
              <TableRow
                key={l.listId}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10"
              >
                <TableCell className="px-4 py-2 text-center border-r dark:text-white">
                  {l.fullName}
                </TableCell>
                <TableCell className="px-4 py-2 border-r dark:text-white">
                  {l.title}
                </TableCell>
                <TableCell className="px-4 py-2 text-center border-r dark:text-white">
                  {new Date(l.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-4 py-2 flex justify-center space-x-2 dark:text-white">
                  {selectedListId === l.listId ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSelectList(null)}
                    >
                      Đóng chi tiết
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSelectList(l.listId)}
                    >
                      Chi tiết
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteList(l.listId)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              <td
                colSpan={4}
                className="py-6 text-center text-gray-500 dark:text-gray-400"
              >
                {keyword ? `Không tìm thấy tài liệu nào với từ khóa "${keyword}"` : "Không có tài liệu"}
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
