// src/pages/admin/StudentDocumentPage.tsx
import { useState } from "react";
import axiosInstance from "../../../services/axiosConfig";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import DocumentListTable from "../../../components/tables/AdminTables/DocumentListTable";
import DocumentItemTable from "../../../components/tables/AdminTables/DocumentItemTable";

export default function StudentDocumentPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [itemKeyword, setItemKeyword] = useState<string>("");

  const handleDeleteList = (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài liệu này?")) return;
    axiosInstance.delete(`/api/document-lists/${id}`)
      .then(() => {
        if (selectedListId === id) setSelectedListId(null);
        // Gọi lại fetch hoặc trigger reload nếu cần
        setKeyword((k) => k); // hoặc setKeyword("") để reload
      })
      .catch(() => alert("Xóa thất bại"));
  };

  return (
    <>
      <PageMeta title="Quản lý tài liệu chia sẻ" description="Trang quản lý tài liệu học viên chia sẻ" />
      <PageBreadcrumb pageTitle="Quản lý tài liệu chia sẻ" />

      <div className="space-y-6">
        <ComponentCard title="Danh sách tài liệu chia sẻ">
          {/* Search only when not viewing details */}
          {selectedListId == null && (
            <div className="mb-4">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm theo tiêu đề hoặc tên người tạo..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500/20 focus:border-brand-300 dark:bg-gray-900 dark:border-gray-800 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          )}
          <DocumentListTable
            keyword={keyword}
            selectedListId={selectedListId}
            onSelectList={setSelectedListId}
            onDeleteList={handleDeleteList}
            compact={selectedListId != null}
          />
        </ComponentCard>

        {selectedListId !== null && (
          <>
            <ComponentCard title="Tìm kiếm từ vựng">
              <input
                type="text"
                value={itemKeyword}
                onChange={(e) => setItemKeyword(e.target.value)}
                placeholder="Tìm từ hoặc nghĩa..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500/20 focus:border-brand-300 dark:bg-gray-900 dark:border-gray-800 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </ComponentCard>
            <ComponentCard title="Chi tiết tài liệu">
              <DocumentItemTable listId={selectedListId} keyword={itemKeyword} />
            </ComponentCard>
          </>
        )}
      </div>
    </>
  );
}
