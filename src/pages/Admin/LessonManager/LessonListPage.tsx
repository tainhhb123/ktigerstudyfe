// src/pages/admin/LessonListPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import LessonTable from "../../../components/tables/AdminTables/LessonTable";

export default function LessonListPage() {
  const navigate = useNavigate();
  const [group, setGroup] = useState<"basic" | "intermediate">("basic");
  const [levelId, setLevelId] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>("");

  // Các level từng nhóm
  const levels = group === "basic" ? [1, 2] : [3, 4];

  // Khi đổi nhóm, cập nhật ngay levelId về item đầu tiên
  useEffect(() => {
    setLevelId(levels[0]);
  }, [group]);

  const handleViewDetail = (lessonId: number) => {
    console.log('Navigating to lesson:', lessonId);
    navigate(`/admin/lessons/${lessonId}`);
  };

  return (
    <>
      <PageMeta title="Quản lý bài học" description="Danh sách bài học theo cấp độ" />
      <PageBreadcrumb pageTitle="Danh sách bài học" />

      <div className="space-y-6 p-6">
        <ComponentCard title="Bộ lọc bài học">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chọn Nhóm cấp độ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nhóm cấp độ
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value as "basic" | "intermediate")}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="basic">Sơ cấp</option>
                <option value="intermediate">Trung cấp</option>
              </select>
            </div>

            {/* Chọn Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Level
              </label>
              <select
                value={levelId}
                onChange={(e) => setLevelId(Number(e.target.value))}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    Level {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Tìm kiếm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập tên bài..."
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Danh sách bài học">
          <LessonTable 
            levelId={levelId}
            keyword={keyword}
            onViewDetail={handleViewDetail}
          />
        </ComponentCard>
      </div>
    </>
  );
}
