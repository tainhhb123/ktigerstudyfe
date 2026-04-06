import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../services/axiosConfig";
import Dropzone from "../../components/form/form-elements/DropZone";

interface MultipleChoice {
  questionId?: number;
  exerciseId: number;
  lessonId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  linkMedia?: string; // Đây sẽ là URL ảnh
}

interface AddMultipleChoiceModalProps {
  lessonId: number;
  exerciseId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: MultipleChoice | null;
}

export default function AddMultipleChoiceModal({
  lessonId,
  exerciseId,
  isOpen,
  onClose,
  onSuccess,
  editData = null,
}: AddMultipleChoiceModalProps) {
  const [question, setQuestion] = useState<MultipleChoice>({
    exerciseId,
    lessonId,
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    linkMedia: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // 🔍 States cho media handling (giống vocabulary)
  const [originalMedia, setOriginalMedia] = useState("");
  const [hasMediaChanged, setHasMediaChanged] = useState(false);

  // Load edit data khi modal mở
  useEffect(() => {
    if (isOpen && editData) {
      const originalMediaUrl = editData.linkMedia || "";
      setOriginalMedia(originalMediaUrl);
      setQuestion({
        questionId: editData.questionId,
        exerciseId: editData.exerciseId,
        lessonId: editData.lessonId,
        questionText: editData.questionText,
        optionA: editData.optionA,
        optionB: editData.optionB,
        optionC: editData.optionC,
        optionD: editData.optionD,
        correctAnswer: editData.correctAnswer,
        linkMedia: originalMediaUrl, // Load ảnh hiện có
      });
      setHasMediaChanged(false);
    } else if (isOpen && !editData) {
      // Reset form cho add new
      setOriginalMedia("");
      setQuestion({
        exerciseId,
        lessonId,
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        linkMedia: "",
      });
      setHasMediaChanged(false);
    }
  }, [isOpen, editData, lessonId, exerciseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({ ...prev, [name]: value }));
  };

  // 🔍 Media handlers (giống vocabulary)
  const handleUploaded = (url: string) => {
    console.log("New media uploaded:", url);
    setQuestion((prev) => ({
      ...prev,
      linkMedia: url,
    }));
    setHasMediaChanged(true);
  };

  const handleRemoveMedia = () => {
    console.log("Media removed");
    setQuestion((prev) => ({ ...prev, linkMedia: "" }));
    setHasMediaChanged(true);
  };

  const handleRestoreOriginalMedia = () => {
    if (editData && originalMedia) {
      console.log("Restoring original media:", originalMedia);
      setQuestion((prev) => ({ ...prev, linkMedia: originalMedia }));
      setHasMediaChanged(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.questionText.trim() || !question.optionA.trim() || !question.optionB.trim() || 
        !question.optionC.trim() || !question.optionD.trim() || !question.correctAnswer.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin câu hỏi!");
      return;
    }

    // Validate correct answer
    if (!["A", "B", "C", "D"].includes(question.correctAnswer.toUpperCase())) {
      alert("Đáp án đúng phải là A, B, C hoặc D!");
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        exerciseId: question.exerciseId,
        lessonId: question.lessonId,
        questionText: question.questionText.trim(),
        optionA: question.optionA.trim(),
        optionB: question.optionB.trim(),
        optionC: question.optionC.trim(),
        optionD: question.optionD.trim(),
        correctAnswer: question.correctAnswer.toUpperCase(),
        linkMedia: question.linkMedia?.trim() || "", // Gửi URL ảnh
      };

      console.log("Submit data:", submitData);
      console.log("Edit mode:", !!editData);
      console.log("Question ID:", question.questionId);

      if (editData && question.questionId) {
        // Update existing question
        console.log("Making PUT request to:", `/api/mcq/${question.questionId}`);
        
        const response = await axiosInstance.put(
          `/api/mcq/${question.questionId}`,
          submitData
        );
        
        console.log("PUT response:", response.data);
        alert("Cập nhật câu hỏi thành công!");
      } else {
        // Create new question
        console.log("Making POST request to:", "/api/mcq");
        
        const response = await axiosInstance.post("/api/mcq", submitData);
        
        console.log("POST response:", response.data);
        alert("Thêm câu hỏi thành công!");
      }

      onSuccess();

      // Reset form
      setQuestion({
        exerciseId,
        lessonId,
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        linkMedia: "",
      });
      setOriginalMedia("");
      setHasMediaChanged(false);

    } catch (error: unknown) {
      console.error("API Error:", error);
      
      if (axios.isAxiosError(error)) {
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
        const errorMessage = error.response?.data?.message || error.message || "Lỗi không xác định";
        alert(`Lỗi ${editData ? "cập nhật" : "thêm"} câu hỏi: ${errorMessage}`);
      } else if (error instanceof Error) {
        alert(`Lỗi ${editData ? "cập nhật" : "thêm"} câu hỏi: ${error.message}`);
      } else {
        alert(`Lỗi ${editData ? "cập nhật" : "thêm"} câu hỏi: Lỗi không xác định`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔍 Component hiển thị media preview (giống vocabulary)
  const MediaPreview = ({ mediaUrl }: { mediaUrl: string }) => {
    if (mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      return (
        <img
          src={mediaUrl}
          alt="Question media"
          className="max-w-full h-auto max-h-48 rounded-lg shadow-sm"
        />
      );
    } else if (mediaUrl.match(/\.(mp3|wav|ogg)$/i)) {
      return (
        <audio controls className="w-full">
          <source src={mediaUrl} />
          Trình duyệt của bạn không hỗ trợ audio.
        </audio>
      );
    } else if (mediaUrl.match(/\.(mp4|webm|mov)$/i)) {
      return (
        <video controls className="max-w-full h-auto max-h-48 rounded-lg shadow-sm">
          <source src={mediaUrl} />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      );
    } else {
      return (
        <a
          href={mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {mediaUrl}
        </a>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={onClose} />
      <div className="fixed inset-x-0 top-[64px] bottom-0 z-50 flex items-start justify-center overflow-y-auto">
        <div className="relative w-full max-w-4xl mx-auto my-6 p-4">
          <div className="relative rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-6" style={{ backgroundColor: '#FFE8DC', borderBottom: '1px solid #BDBDBD' }}>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: '#FF6B35' }}>
                  📝 {editData ? "Chỉnh sửa câu hỏi trắc nghiệm" : "Thêm câu hỏi trắc nghiệm mới"}
                </h3>
                
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: '#FFFFFF', color: '#666666' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFEBEE'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="px-6 py-4 space-y-6" style={{ backgroundColor: '#FFF8F0' }}>
                {/* Câu hỏi */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>
                    Câu hỏi <span style={{ color: '#C62828' }}>*</span>
                  </label>
                  <textarea
                    name="questionText"
                    value={question.questionText}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors resize-none"
                    style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                    onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
                    required
                    placeholder="Nhập nội dung câu hỏi"
                  />
                </div>

                {/* Các lựa chọn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>
                      Lựa chọn A <span style={{ color: '#C62828' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="optionA"
                      value={question.optionA}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                      style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                      onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                      onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
                      required
                      placeholder="Nhập lựa chọn A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>
                      Lựa chọn B <span style={{ color: '#C62828' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="optionB"
                      value={question.optionB}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                      style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                      onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                      onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
                      required
                      placeholder="Nhập lựa chọn B"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>
                      Lựa chọn C <span style={{ color: '#C62828' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="optionC"
                      value={question.optionC}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                      style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                      onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                      onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
                      required
                      placeholder="Nhập lựa chọn C"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>
                      Lựa chọn D <span style={{ color: '#C62828' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="optionD"
                      value={question.optionD}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                      style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                      onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                      onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
                      required
                      placeholder="Nhập lựa chọn D"
                    />
                  </div>
                </div>

                {/* Đáp án đúng */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>
                    Đáp án đúng <span style={{ color: '#C62828' }}>*</span>
                  </label>
                  <select
                    name="correctAnswer"
                    value={question.correctAnswer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                    style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                    onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
                    required
                  >
                    <option value="">Chọn đáp án đúng</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                {/* Media Upload Section */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                    📷 Media đính kèm (không bắt buộc)
                  </label>
                  
                  {question.linkMedia ? (
                    <div className="space-y-3">
                      {/* Media Preview */}
                      <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F5E9', border: '1px solid #81C784' }}>
                        <MediaPreview mediaUrl={question.linkMedia} />
                      </div>
                      
                      {/* Media Actions */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleRemoveMedia}
                          className="px-3 py-2 text-sm rounded-lg font-medium transition-colors"
                          style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFCDD2'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFEBEE'}
                        >
                          Xóa media
                        </button>
                        
                        {editData && originalMedia && hasMediaChanged && (
                          <button
                            type="button"
                            onClick={handleRestoreOriginalMedia}
                            className="px-3 py-2 text-sm rounded-lg font-medium transition-colors"
                            style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BBDEFB'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E3F2FD'}
                          >
                            Khôi phục media gốc
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Dropzone onUploaded={handleUploaded} />
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ backgroundColor: '#FFE8DC', borderTop: '1px solid #BDBDBD' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: '#FFFFFF', color: '#666666', border: '1px solid #BDBDBD' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50"
                  style={{ backgroundColor: '#FF6B35', color: '#FFFFFF' }}
                  onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#E85A2A')}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 rounded-full animate-spin mr-2" style={{ borderColor: '#FFFFFF', borderTopColor: 'transparent' }}></div>
                      {editData ? "Đang cập nhật..." : "Đang thêm..."}
                    </>
                  ) : (
                    editData ? "Cập nhật" : "Thêm câu hỏi"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}