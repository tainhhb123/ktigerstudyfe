import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface StudentProgress {
  id: number;
  avatar: string;
  fullName: string;
  joinDate: string;     // Ngày tham gia (yyyy-mm-dd)
  level: string;        // Cấp độ
  currentLesson: string; // Bài học hiện tại
  exp: number;          // Điểm kinh nghiệm
}

// Dữ liệu mẫu
const progressData: StudentProgress[] = [
  {
    id: 1,
    avatar: "/images/user/user-1.jpg",
    fullName: "Nguyễn Văn A",
    joinDate: "2023-09-15",
    level: "Nâng cao",
    currentLesson: "Bài 20: Viết đoạn văn",
    exp: 1250,
  },
  {
    id: 2,
    avatar: "/images/user/user-2.jpg",
    fullName: "Lê Thị B",
    joinDate: "2023-10-01",
    level: "Trung cấp",
    currentLesson: "Bài 12: Từ vựng gia đình",
    exp: 940,
  },
  {
    id: 3,
    avatar: "/images/user/user-3.jpg",
    fullName: "Trần Văn C",
    joinDate: "2024-01-07",
    level: "Sơ cấp",
    currentLesson: "Bài 3: Chào hỏi",
    exp: 230,
  },
  {
    id: 4,
    avatar: "/images/user/user-4.jpg",
    fullName: "Phạm Thị D",
    joinDate: "2024-02-11",
    level: "Nâng cao",
    currentLesson: "Bài 19: Viết thư",
    exp: 1500,
  },
];

export default function UserProgressTable() {
  const [progress] = useState(progressData);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Ảnh đại diện
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tên đầy đủ
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Ngày tham gia
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Cấp độ
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Bài học hiện tại
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Điểm kinh nghiệm
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {progress.map((stu) => (
              <TableRow key={stu.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="w-10 h-10 overflow-hidden rounded-full">
                    <img
                      width={40}
                      height={40}
                      src={stu.avatar}
                      alt={stu.fullName}
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-800 text-theme-sm font-medium dark:text-white/90">
                  {stu.fullName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {stu.joinDate}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {stu.level}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {stu.currentLesson}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {stu.exp.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
