// src/pages/admin/LessonListPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import LessonTable from "../../../components/tables/AdminTables/LessonTable";
import AddLessonModal from "../../../components/modals/AddLessonModal";

export default function LessonListPage() {
  const navigate = useNavigate();
  const [group, setGroup] = useState<"basic" | "intermediate" | "advanced">("basic");
  const [levelId, setLevelId] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);

  // Các level từng nhóm
  const levels = group === "basic" ? [1, 2] : group === "intermediate" ? [3, 4] : [5, 6];

  // Khi đổi nhóm, cập nhật ngay levelId về item đầu tiên
  useEffect(() => {
    setLevelId(levels[0]);
  }, [group]);

  const handleViewDetail = (lessonId: number) => {
    console.log('Navigating to lesson:', lessonId);
    navigate(`/admin/lessons/${lessonId}`);
  };

  const handleAddSuccess = () => {
    setRefreshTable(prev => !prev);
    setShowAddModal(false);
  };

  return (
    <>
      <PageMeta title="Quản lý bài học" description="Danh sách bài học theo cấp độ" />
      <PageBreadcrumb pageTitle="Quản lý bài học" />

      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nhóm cấp độ</label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value as "basic" | "intermediate" | "advanced")}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="basic">Sơ cấp</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Cao cấp</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
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
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tìm kiếm</label>
            <form
              className="relative"
              onSubmit={e => { e.preventDefault(); }}
              autoComplete="off"
            >
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập tên bài..."
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                tabIndex={-1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 fill-current text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  />
                </svg>
              </button>
            </form>
          </div>
          <div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
              onClick={() => setShowAddModal(true)}
            >
              Thêm bài học mới
            </button>
          </div>
        </div>
        <ComponentCard title="Danh sách bài học">
          <LessonTable 
            levelId={levelId}
            keyword={keyword}
            onViewDetail={handleViewDetail}
            key={refreshTable ? "refresh-true" : "refresh-false"}
          />
        </ComponentCard>
        <AddLessonModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
          levelId={levelId}
        />
      </div>
    </>
  );
}
