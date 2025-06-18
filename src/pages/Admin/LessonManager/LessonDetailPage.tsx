// src/pages/admin/LessonDetailPage.tsx

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import VocabularyTable from "../../../components/tables/AdminTables/VocabularyTable";
import GrammarTable from "../../../components/tables/AdminTables/GrammarTable";
import Button from "../../../components/ui/button/Button";
import AddVocabularyModal from "../../../components/modals/AddVocabularyModal";
import AddGrammarModal from "../../../components/modals/AddGrammarModal";

type TabType = 'vocabulary' | 'grammar';

export default function LessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('vocabulary');
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);
  const [isGrammarModalOpen, setIsGrammarModalOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  return (
    <>
      <PageBreadcrumb pageTitle={`Chi tiết bài học ${lessonId}`} />
      
      <div className="p-6 space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-4">
            <button
              className={`py-2 px-4 border-b-2 font-medium transition-colors ${
                activeTab === 'vocabulary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('vocabulary')}
            >
              Từ vựng
            </button>
            <button
              className={`py-2 px-4 border-b-2 font-medium transition-colors ${
                activeTab === 'grammar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('grammar')}
            >
              Ngữ pháp
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'vocabulary' && (
          <ComponentCard
            title="Từ vựng"
            action={
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsVocabModalOpen(true)}
              >
                Thêm từ vựng
              </Button>
            }
          >
            <VocabularyTable
              lessonId={Number(lessonId)}
              key={`vocab-${shouldRefetch}`}
            />
          </ComponentCard>
        )}

        {activeTab === 'grammar' && (
          <ComponentCard
            title="Ngữ pháp"
            action={
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsGrammarModalOpen(true)}
              >
                Thêm ngữ pháp
              </Button>
            }
          >
            <GrammarTable
              lessonId={Number(lessonId)}
              key={`grammar-${shouldRefetch}`}
            />
          </ComponentCard>
        )}

        {/* Modals */}
        <AddGrammarModal
          lessonId={Number(lessonId)}
          isOpen={isGrammarModalOpen}
          onClose={() => setIsGrammarModalOpen(false)}
          onSuccess={() => {
            setShouldRefetch(prev => !prev);
            setIsGrammarModalOpen(false);
          }}
        />

        <AddVocabularyModal
          lessonId={Number(lessonId)}
          isOpen={isVocabModalOpen}
          onClose={() => setIsVocabModalOpen(false)}
          onSuccess={() => {
            setShouldRefetch(prev => !prev);
            setIsVocabModalOpen(false);
          }}
        />
      </div>
    </>
  );
}
