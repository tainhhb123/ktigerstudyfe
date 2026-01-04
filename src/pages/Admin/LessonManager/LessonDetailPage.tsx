// src/pages/admin/LessonDetailPage.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../services/axiosConfig";
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

interface Exercise {
  exerciseId: number;
  exerciseName: string;
  lessonId: number;
}

export default function LessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('vocabulary');
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);
  const [isGrammarModalOpen, setIsGrammarModalOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [questionTab, setQuestionTab] = useState<"multiple_choice" | "sentence_rewriting">("multiple_choice");
  
  // ✅ States cho exercise management
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [loadingExercise, setLoadingExercise] = useState(false);

  // ✅ Fetch hoặc tạo exercise cho lesson
  useEffect(() => {
    const fetchOrCreateExercise = async () => {
      if (!lessonId) return;
      
      setLoadingExercise(true);
      try {
        // ✅ Lấy danh sách exercises cho lesson
        console.log(`Fetching exercises for lesson ${lessonId}...`);
        const response = await axiosInstance.get(`/api/exercises/lesson/${lessonId}`);
        const exercises = response.data;
        
        console.log("Exercises found:", exercises);
        
        if (exercises && exercises.length > 0) {
          // ✅ Nếu có exercises, lấy cái đầu tiên
          const firstExercise = exercises[0];
          setCurrentExercise(firstExercise);
          console.log("Using existing exercise:", firstExercise);
        } else {
          // ✅ Chỉ tạo exercise mới nếu thực sự chưa có
          console.log("No exercises found for lesson", lessonId);
          console.log("Creating default exercise...");
          await createDefaultExercise();
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        // ❌ KHÔNG tạo exercise khi có lỗi fetch - có thể là network issue
        setCurrentExercise(null);
      } finally {
        setLoadingExercise(false);
      }
    };

    const createDefaultExercise = async () => {
      try {
        // ✅ Double-check lần nữa trước khi tạo
        const checkResponse = await axiosInstance.get(`/api/exercises/lesson/${lessonId}`);
        if (checkResponse.data && checkResponse.data.length > 0) {
          console.log("Exercise found during double-check, using existing one");
          setCurrentExercise(checkResponse.data[0]);
          return;
        }

        console.log("Creating new exercise for lesson", lessonId);
        const createResponse = await axiosInstance.post('/api/exercises', {
          exerciseName: `Bài tập - Lesson ${lessonId}`,
          exerciseDescription: `Bài tập mặc định cho bài học ${lessonId}`,
          exerciseType: "MIXED", // hoặc loại exercise phù hợp
          lessonId: Number(lessonId),
        });
        
        const newExercise = createResponse.data;
        setCurrentExercise(newExercise);
        console.log("Successfully created new exercise:", newExercise);
        
      } catch (createError) {
        console.error('Error creating exercise:', createError);
        if (axiosInstance.isAxiosError(createError)) {
          console.error("Create error details:", createError.response?.data);
        }
        
        // ✅ Fallback: tạo object tạm thời (không lưu DB)
        console.log("Using fallback exercise object");
        setCurrentExercise({
          exerciseId: Date.now(), // Temporary ID
          exerciseName: `Bài tập tạm thời - Lesson ${lessonId}`,
          lessonId: Number(lessonId)
        });
      }
    };

    // ✅ Chỉ chạy khi lessonId thay đổi và khi activeTab là 'exercise'
    if (activeTab === 'exercise') {
      fetchOrCreateExercise();
    }
  }, [lessonId, activeTab]); // ✅ Thêm activeTab vào dependency

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
            {loadingExercise ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2">Đang tải bài tập...</span>
              </div>
            ) : currentExercise ? (
              <div className="space-y-4">
                

                {/* Question Type Tabs */}
                <div className="flex gap-2">
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

                {/* Question Tables với exerciseId cố định */}
                {questionTab === "multiple_choice" && (
                  <MultipleChoiceTable 
                    lessonId={Number(lessonId)} 
                    exerciseId={currentExercise.exerciseId}  // ✅ Truyền exerciseId từ currentExercise
                    key={`mcq-${currentExercise.exerciseId}`}
                  />
                )}
                {questionTab === "sentence_rewriting" && (
                  <SentenceRewritingQuestionTable 
                    lessonId={Number(lessonId)} 
                    exerciseId={currentExercise.exerciseId}  // ✅ Nếu component này cũng cần
                    key={`srq-${currentExercise.exerciseId}`}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Không thể tải bài tập cho bài học này.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Thử lại
                </Button>
              </div>
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
