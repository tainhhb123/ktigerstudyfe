import React, { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import StudentProgressTable from "../../../components/tables/AdminTables/ProgressTable";

export default function StudentProgressPage() {
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Đã set keyword, component con sẽ tự filter lại
  };

  return (
    <>
      <PageMeta
        title="Quản lý tiến trình học tập"
        description="Bảng quản lý tiến trình học viên"
      />
      <PageBreadcrumb pageTitle="Quản lý tiến trình học viên" />
      <div className="space-y-6">
        <ComponentCard title="Bảng tiến trình học viên">
          {/* Form tìm kiếm */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                <svg className="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Tìm kiếm theo tên, cấp độ, bài học..."
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-[14px] py-[4.5px] text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
          {/* Bảng tiến trình học viên, truyền props keyword */}
          <StudentProgressTable keyword={keyword} />
        </ComponentCard>
      </div>
    </>
  );
}
