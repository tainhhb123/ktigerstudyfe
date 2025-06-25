// src/pages/admin/LessonDetailPage.tsx

import { useState } from "react";
import { useParams } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import VocabularyTable from "../../../components/tables/AdminTables/VocabularyTable";
import GrammarTable from "../../../components/tables/AdminTables/GrammarTable";
import Button from "../../../components/ui/button/Button";
import AddVocabularyModal from "../../../components/modals/AddVocabularyModal";
import AddGrammarModal from "../../../components/modals/AddGrammarModal";
import MultipleChoiceTable from "../../../components/tables/AdminTables/MultipleChoiceTable";
import SentenceRewritingQuestionTable from "../../../components/tables/AdminTables/SentenceRewritingQuestionTable";

type TabType = 'vocabulary' | 'grammar' | 'exercise';

export default function LessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('vocabulary');
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);
  const [isGrammarModalOpen, setIsGrammarModalOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [questionTab, setQuestionTab] = useState<"multiple_choice" | "sentence_rewriting">("multiple_choice");

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
            <button
              className={`py-2 px-4 border-b-2 font-medium transition-colors ${
                activeTab === 'exercise'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('exercise')}
            >
              Bài tập
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

        {activeTab === 'exercise' && (
          <ComponentCard title="Bài tập">
            <div className="flex gap-2 mb-4">
              <Button
                variant={questionTab === "multiple_choice" ? "primary" : "outline"}
                onClick={() => setQuestionTab("multiple_choice")}
              >
                Trắc nghiệm
              </Button>
              <Button
                variant={questionTab === "sentence_rewriting" ? "primary" : "outline"}
                onClick={() => setQuestionTab("sentence_rewriting")}
              >
                Viết lại câu
              </Button>
            </div>
            {questionTab === "multiple_choice" && lessonId && (
              <MultipleChoiceTable lessonId={Number(lessonId)} />
            )}
            {questionTab === "sentence_rewriting" && lessonId && (
              <SentenceRewritingQuestionTable lessonId={Number(lessonId)} />
            )}
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
