// src/pages/admin/DocumentReports.tsx
import React, { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import DocumentReportTable from "../../../components/tables/AdminTables/DocumentReportTable";

export default function DocumentReports() {
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <PageMeta
        title="Quản lý báo cáo tài liệu"
        description="Trang quản lý báo cáo của người dùng"
      />
      <PageBreadcrumb pageTitle="Báo cáo tài liệu" />
      <div className="space-y-6 p-6">
        <ComponentCard title="Danh sách báo cáo tài liệu">
          {/* Tìm kiếm */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative w-full xl:w-[430px]">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm báo cáo"
                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 pr-12 text-sm text-gray-800
                  placeholder:text-gray-400 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-500/20
                  dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center
                  h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
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
            </div>
          </form>
          {/* Bảng báo cáo với paging */}
          <DocumentReportTable keyword={keyword} />
        </ComponentCard>
      </div>
    </>
  );
}
