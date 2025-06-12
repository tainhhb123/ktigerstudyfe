import React, { useEffect, useState } from "react";
import axios from "axios";

interface UserProgress {
  userId: number;
  avatarImage: string;
  fullName: string;
  joinDate: string;
  levelName: string;
  lessonName: string;
}

interface StudentProgressTableProps {
  keyword: string; // để mở rộng search, hiện tại chưa cần truyền lên API
}

export default function StudentProgressTable({ keyword }: StudentProgressTableProps) {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get<UserProgress[]>("http://localhost:8080/api/user-progress")
      .then((res) => setProgress(res.data))
      .catch(() => setProgress([]))
      .finally(() => setLoading(false));
  }, [keyword]);

  // Nếu muốn search phía client, dùng filter ở đây
  const filtered = keyword.trim().length
    ? progress.filter(
        (u) =>
          u.fullName.toLowerCase().includes(keyword.toLowerCase()) ||
          u.levelName.toLowerCase().includes(keyword.toLowerCase()) ||
          u.lessonName.toLowerCase().includes(keyword.toLowerCase())
      )
    : progress;

  return (
    <div className="rounded-xl bg-white shadow border border-gray-200 dark:bg-white/[0.03] dark:border-white/10">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
        <span className="font-semibold text-gray-700 dark:text-white">
          Tổng số tiến trình học viên: {filtered.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
            <thead>
            <tr className="bg-gray-50 dark:bg-white/5">
                <th className="font-bold px-5 py-3 text-center align-middle">Ảnh</th>
                <th className="font-bold px-5 py-3 text-center align-middle">Họ&nbsp;tên</th>
                <th className="font-bold px-5 py-3 text-center align-middle">Ngày&nbsp;tham&nbsp;gia</th>
                <th className="font-bold px-5 py-3 text-center align-middle">Cấp&nbsp;độ</th>
                <th className="font-bold px-5 py-3 text-center align-middle">Bài&nbsp;học&nbsp;hiện&nbsp;tại</th>
            </tr>
            </thead>

        <tbody>
        {loading && (
            <tr>
            <td colSpan={5} className="py-6 text-center text-sm text-gray-500 align-middle">
                Đang tải…
            </td>
            </tr>
        )}
        {!loading && filtered.length === 0 && (
            <tr>
            <td colSpan={5} className="py-6 text-center text-sm text-gray-500 align-middle">
                Không có dữ liệu
            </td>
            </tr>
        )}
        {!loading &&
            filtered.map((u) => (
            <tr key={u.userId} className="hover:bg-gray-50 dark:hover:bg-white/10">
                <td className="px-5 py-4 align-middle text-center">
                <img
                    src={u.avatarImage}
                    alt={u.fullName}
                    className="h-10 w-10 rounded-full object-cover mx-auto"
                />
                </td>
                <td className="px-5 py-4 font-medium text-gray-800 dark:text-white align-middle text-center">
                {u.fullName}
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400 align-middle text-center">
                {u.joinDate}
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400 align-middle text-center">
                {u.levelName}
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400 align-middle text-center">
                {u.lessonName}
                </td>
            </tr>
            ))}
        </tbody>

        </table>
      </div>
    </div>
  );
}
