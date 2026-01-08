// src/pages/admin/LessonDetailPage.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../services/axiosConfig";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import VocabularyTable from "../../../components/tables/AdminTables/VocabularyTable";
import GrammarTable from "../../../components/tables/AdminTables/GrammarTable";
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

      <div className="p-6 space-y-6" style={{ backgroundColor: '#FFF8F0', minHeight: '100vh' }}>
        {/* Tab Navigation */}
        <div style={{ borderBottom: '2px solid #FFE8DC' }}>
          <nav className="-mb-px flex gap-4">
            <button
              className="py-3 px-6 font-semibold transition-all duration-200 rounded-t-lg"
              style={{
                borderBottom: activeTab === 'vocabulary' ? '3px solid #FF6B35' : '3px solid transparent',
                color: activeTab === 'vocabulary' ? '#FF6B35' : '#666666',
                backgroundColor: activeTab === 'vocabulary' ? '#FFE8DC' : 'transparent',
              }}
              onClick={() => setActiveTab('vocabulary')}
            >
              📚 Từ vựng
            </button>
            <button
              className="py-3 px-6 font-semibold transition-all duration-200 rounded-t-lg"
              style={{
                borderBottom: activeTab === 'grammar' ? '3px solid #FF6B35' : '3px solid transparent',
                color: activeTab === 'grammar' ? '#FF6B35' : '#666666',
                backgroundColor: activeTab === 'grammar' ? '#FFE8DC' : 'transparent',
              }}
              onClick={() => setActiveTab('grammar')}
            >
              📖 Ngữ pháp
            </button>
            <button
              className="py-3 px-6 font-semibold transition-all duration-200 rounded-t-lg"
              style={{
                borderBottom: activeTab === 'exercise' ? '3px solid #FF6B35' : '3px solid transparent',
                color: activeTab === 'exercise' ? '#FF6B35' : '#666666',
                backgroundColor: activeTab === 'exercise' ? '#FFE8DC' : 'transparent',
              }}
              onClick={() => setActiveTab('exercise')}
            >
              ✏️ Bài tập
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'vocabulary' && (
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
            <div className="flex items-center justify-between p-4" style={{ backgroundColor: '#FFE8DC', borderBottom: '1px solid #BDBDBD' }}>
              <h3 className="text-lg font-semibold" style={{ color: '#FF6B35' }}>📚 Từ vựng</h3>
              <button
                onClick={() => setIsVocabModalOpen(true)}
                className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#FF6B35', color: '#FFFFFF' }}
              >
                + Thêm từ vựng
              </button>
            </div>
            <VocabularyTable
              lessonId={Number(lessonId)}
              key={`vocab-${shouldRefetch}`}
            />
          </div>
        )}

        {activeTab === 'grammar' && (
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
            <div className="flex items-center justify-between p-4" style={{ backgroundColor: '#FFE8DC', borderBottom: '1px solid #BDBDBD' }}>
              <h3 className="text-lg font-semibold" style={{ color: '#FF6B35' }}>📖 Ngữ pháp</h3>
              <button
                onClick={() => setIsGrammarModalOpen(true)}
                className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#FF6B35', color: '#FFFFFF' }}
              >
                + Thêm ngữ pháp
              </button>
            </div>
            <GrammarTable
              lessonId={Number(lessonId)}
              key={`grammar-${shouldRefetch}`}
            />
          </div>
        )}

        {activeTab === 'exercise' && (
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
            <div className="p-4" style={{ backgroundColor: '#FFE8DC', borderBottom: '1px solid #BDBDBD' }}>
              <h3 className="text-lg font-semibold" style={{ color: '#FF6B35' }}>✏️ Bài tập</h3>
            </div>
            {loadingExercise ? (
              <div className="flex items-center justify-center py-8" style={{ backgroundColor: '#FFF8F0' }}>
                <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
                <span className="ml-2" style={{ color: '#666666' }}>Đang tải bài tập...</span>
              </div>
            ) : currentExercise ? (
              <div className="space-y-4 p-4">
                

                {/* Question Type Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setQuestionTab("multiple_choice")}
                    className="px-4 py-2 rounded-lg font-medium transition-all"
                    style={{
                      backgroundColor: questionTab === "multiple_choice" ? '#FF6B35' : '#FFFFFF',
                      color: questionTab === "multiple_choice" ? '#FFFFFF' : '#FF6B35',
                      border: '1px solid #FF6B35'
                    }}
                  >
                    Trắc nghiệm
                  </button>
                  <button
                    onClick={() => setQuestionTab("sentence_rewriting")}
                    className="px-4 py-2 rounded-lg font-medium transition-all"
                    style={{
                      backgroundColor: questionTab === "sentence_rewriting" ? '#FF6B35' : '#FFFFFF',
                      color: questionTab === "sentence_rewriting" ? '#FFFFFF' : '#FF6B35',
                      border: '1px solid #FF6B35'
                    }}
                  >
                    Viết lại câu
                  </button>
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
              <div className="text-center py-12" style={{ backgroundColor: '#FFF8F0' }}>
                <div className="text-4xl mb-4">📝</div>
                <p className="mb-4" style={{ color: '#666666' }}>
                  Không thể tải bài tập cho bài học này.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-lg font-medium transition-all"
                  style={{ backgroundColor: '#FF6B35', color: '#FFFFFF' }}
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>
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
