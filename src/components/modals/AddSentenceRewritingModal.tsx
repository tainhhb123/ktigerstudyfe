import { useState, useEffect } from "react";
import axios from "axios";
import Dropzone from "../form/form-elements/DropZone";

interface SentenceRewritingQuestion {
  questionId?: number;
  exerciseId: number;
  lessonId: number;
  originalSentence: string;
  rewrittenSentence: string;
  linkMedia?: string;
}

interface AddSentenceRewritingModalProps {
  lessonId: number;
  exerciseId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: SentenceRewritingQuestion | null;
}

export default function AddSentenceRewritingModal({
  lessonId,
  exerciseId,
  isOpen,
  onClose,
  onSuccess,
  editData = null,
}: AddSentenceRewritingModalProps) {
  const [question, setQuestion] = useState<SentenceRewritingQuestion>({
    exerciseId,
    lessonId,
    originalSentence: "",
    rewrittenSentence: "",
    linkMedia: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // States cho media handling
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
        originalSentence: editData.originalSentence,
        rewrittenSentence: editData.rewrittenSentence,
        linkMedia: originalMediaUrl,
      });
      setHasMediaChanged(false);
    } else if (isOpen && !editData) {
      // Reset form cho add new
      setOriginalMedia("");
      setQuestion({
        exerciseId,
        lessonId,
        originalSentence: "",
        rewrittenSentence: "",
        linkMedia: "",
      });
      setHasMediaChanged(false);
    }
  }, [isOpen, editData, lessonId, exerciseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({ ...prev, [name]: value }));
  };

  // Media handlers
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

    if (!question.originalSentence.trim() || !question.rewrittenSentence.trim()) {
      alert("Vui lòng nhập đầy đủ câu gốc và câu viết lại!");
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        exerciseId: question.exerciseId,
        lessonId: question.lessonId,
        originalSentence: question.originalSentence.trim(),
        rewrittenSentence: question.rewrittenSentence.trim(),
        linkMedia: question.linkMedia?.trim() || "",
      };

      console.log("Submit data:", submitData);
      console.log("Edit mode:", !!editData);
      console.log("Question ID:", question.questionId);

      if (editData && question.questionId) {
        // Update existing question
        console.log("Making PUT request to:", `/api/sentence-rewriting/${question.questionId}`);
        
        const response = await axios.put(
          `/api/sentence-rewriting/${question.questionId}`,
          submitData
        );
        
        console.log("PUT response:", response.data);
        alert("Cập nhật câu hỏi thành công!");
      } else {
        // Create new question
        console.log("Making POST request to:", "/api/sentence-rewriting");
        
        const response = await axios.post("/api/sentence-rewriting", submitData);
        
        console.log("POST response:", response.data);
        alert("Thêm câu hỏi thành công!");
      }

      onSuccess();

      // Reset form
      setQuestion({
        exerciseId,
        lessonId,
        originalSentence: "",
        rewrittenSentence: "",
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

  // Component hiển thị media preview
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
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-x-0 top-[64px] bottom-0 z-50 flex items-start justify-center overflow-y-auto">
        <div className="relative w-full max-w-3xl mx-auto my-6 p-4">
          <div className="relative bg-white dark:bg-zinc-800 rounded-lg shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editData ? "Chỉnh sửa câu hỏi viết lại câu" : "Thêm câu hỏi viết lại câu mới"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="px-6 py-4 space-y-6">
                {/* Câu gốc */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Câu gốc *
                  </label>
                  <textarea
                    name="originalSentence"
                    value={question.originalSentence}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    required
                    placeholder="Nhập câu gốc cần viết lại"
                  />
                </div>

                {/* Câu viết lại */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Câu viết lại *
                  </label>
                  <textarea
                    name="rewrittenSentence"
                    value={question.rewrittenSentence}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    required
                    placeholder="Nhập câu viết lại"
                  />
                </div>

                {/* Media Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Media đính kèm (không bắt buộc)
                  </label>
                  
                  {question.linkMedia ? (
                    <div className="space-y-3">
                      {/* Media Preview */}
                      <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <MediaPreview mediaUrl={question.linkMedia} />
                      </div>
                      
                      {/* Media Actions */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleRemoveMedia}
                          className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                        >
                          Xóa media
                        </button>
                        
                        {editData && originalMedia && hasMediaChanged && (
                          <button
                            type="button"
                            onClick={handleRestoreOriginalMedia}
                            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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
              <div className="flex items-center space-x-2 px-6 py-4 bg-gray-50 dark:bg-zinc-700/50 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-300 dark:hover:bg-zinc-600"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
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