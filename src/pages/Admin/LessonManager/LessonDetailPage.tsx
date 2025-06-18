// src/pages/admin/LessonDetailPage.tsx (No changes needed, included for completeness)

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import VocabularyTable from "../../../components/tables/AdminTables/VocabularyTable";
import Button from "../../../components/ui/button/Button";
import AddVocabularyModal from "../../../components/modals/AddVocabularyModal";

export default function LessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  // Add effect to debug lessonId changes
  useEffect(() => {
    console.log("LessonDetailPage - lessonId:", lessonId);
  }, [lessonId]);

  return (
    <>
      <PageBreadcrumb pageTitle={`Chi tiết bài học ${lessonId}`} />
      <div className="p-6 space-y-6">
        <ComponentCard
          title={`Từ vựng - Bài ${lessonId}`}
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              Thêm từ vựng
            </Button>
          }
        >
          <VocabularyTable
            lessonId={Number(lessonId)}
            key={`vocab-table-${lessonId}-${shouldRefetch}`}
          />
        </ComponentCard>
      </div>

      <AddVocabularyModal
        lessonId={Number(lessonId)}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setShouldRefetch((prev) => !prev);
        }}
      />
    </>
  );
}
