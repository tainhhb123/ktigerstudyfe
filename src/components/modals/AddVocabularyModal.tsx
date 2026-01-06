import { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosConfig";
import DropzoneComponent from "../../components/form/form-elements/DropZone";

interface AddVocabularyModalProps {
  lessonId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Vocabulary | null;
}

interface Vocabulary {
  vocabId?: number;
  word: string;
  meaning: string;
  example?: string;
  media?: string;
  image?: string;
  lessonId: number;
}

export default function AddVocabularyModal({
  lessonId,
  isOpen,
  onClose,
  onSuccess,
  editData = null,
}: AddVocabularyModalProps) {
  const [vocabulary, setVocabulary] = useState<Vocabulary>({
    word: "",
    meaning: "",
    example: "",
    media: "",
    lessonId,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [originalMedia, setOriginalMedia] = useState<string>(""); // Lưu media gốc
  const [hasMediaChanged, setHasMediaChanged] = useState(false); // Track xem media có thay đổi không

  // Load edit data khi modal mở
  useEffect(() => {
    if (isOpen && editData) {
      const originalMediaUrl = editData.image || "";
      setOriginalMedia(originalMediaUrl);
      setVocabulary({
        vocabId: editData.vocabId,
        word: editData.word,
        meaning: editData.meaning,
        example: editData.example || "",
        media: originalMediaUrl, // Load ảnh hiện có vào media field
        lessonId: editData.lessonId,
      });
      setHasMediaChanged(false);
    } else if (isOpen && !editData) {
      // Reset form cho add new
      setOriginalMedia("");
      setVocabulary({
        word: "",
        meaning: "",
        example: "",
        media: "",
        lessonId,
      });
      setHasMediaChanged(false);
    }
  }, [isOpen, editData, lessonId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVocabulary((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vocabulary.word.trim() || !vocabulary.meaning.trim()) {
      alert("Vui lòng nhập từ vựng và nghĩa!");
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        word: vocabulary.word.trim(),
        meaning: vocabulary.meaning.trim(),
        example: vocabulary.example?.trim() || "",
        image: vocabulary.media || "", // 🔍 Đảm bảo gửi đúng field image
        lessonId,
      };

      // 🔍 Debug để kiểm tra
      console.log("Original media:", originalMedia);
      console.log("Current media:", vocabulary.media);
      console.log("Has media changed:", hasMediaChanged);
      console.log("Submit data:", submitData);
      console.log("Edit mode:", !!editData);
      console.log("Vocabulary ID:", vocabulary.vocabId);

      if (editData && vocabulary.vocabId) {
        // Update existing vocabulary
        console.log("Making PUT request to:", `/api/vocabulary-theories/${vocabulary.vocabId}`);
        
        // 🔍 Thêm thêm debug info
        console.log("PUT payload:", JSON.stringify(submitData, null, 2));
        
        const response = await axiosInstance.put(
          `/api/vocabulary-theories/${vocabulary.vocabId}`,
          submitData
        );

        console.log("PUT response:", response.data);
        alert("Cập nhật từ vựng thành công!");
      } else {
        // Create new vocabulary
        console.log("Making POST request to:", "/api/vocabulary-theories");
        
        const response = await axiosInstance.post("/api/vocabulary-theories", submitData);

        console.log("POST response:", response.data);
        alert("Thêm từ vựng thành công!");
      }

      onSuccess();

      // Reset form
      setVocabulary({
        word: "",
        meaning: "",
        example: "",
        media: "",
        lessonId,
      });
      setOriginalMedia("");
      setHasMediaChanged(false);
    } catch (error: unknown) {
      console.error("API Error:", error);

      if (axiosInstance.isAxiosError(error)) {
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
        console.error("Request URL:", error.config?.url);
        console.error("Request method:", error.config?.method);
        console.error("Request data:", error.config?.data);

        // 🔍 Log chi tiết request payload
        if (error.config?.data) {
          console.error("Sent payload:", JSON.parse(error.config.data));
        }

        const errorMessage =
          error.response?.data?.message || error.message || "Lỗi không xác định";
        alert(`Lỗi ${editData ? "cập nhật" : "thêm"} từ vựng: ${errorMessage}`);
      } else if (error instanceof Error) {
        alert(`Lỗi ${editData ? "cập nhật" : "thêm"} từ vựng: ${error.message}`);
      } else {
        alert(`Lỗi ${editData ? "cập nhật" : "thêm"} từ vựng: Đã xảy ra lỗi không xác định`);
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
          alt="Preview"
          className="max-h-40 max-w-full object-contain rounded-md mx-auto"
        />
      );
    } else if (mediaUrl.match(/\.(mp3|wav|ogg)$/i)) {
      return (
        <audio controls className="w-full">
          <source src={mediaUrl} />
          Your browser does not support audio playback.
        </audio>
      );
    } else if (mediaUrl.match(/\.(mp4|webm|mov)$/i)) {
      return (
        <video controls className="w-full max-h-40">
          <source src={mediaUrl} />
          Your browser does not support video playback.
        </video>
      );
    }
    return (
      <p className="text-gray-500 text-center py-4">
        Media đã upload thành công
      </p>
    );
  };

  if (!isOpen) return null;

  function handleRemoveMedia(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    setVocabulary((prev) => ({
      ...prev,
      media: "",
    }));
    // Nếu đang edit và đã có media gốc, đánh dấu đã thay đổi
    if (editData) {
      setHasMediaChanged(true);
    }
  }

  function handleRestoreOriginalMedia(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    setVocabulary((prev) => ({
      ...prev,
      media: originalMedia,
    }));
    setHasMediaChanged(false);
  }

  function handleUploaded(url: string): void {
    setVocabulary((prev) => ({
      ...prev,
      media: url,
    }));
    // Nếu đang edit, đánh dấu đã thay đổi media
    if (editData) {
      setHasMediaChanged(true);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={onClose} />
      <div className="fixed inset-x-0 top-[64px] bottom-0 z-50 flex items-start justify-center overflow-y-auto">
        <div className="relative w-full max-w-2xl mx-auto my-6 p-4">
          <div className="relative rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-6" style={{ backgroundColor: '#FFE8DC', borderBottom: '1px solid #BDBDBD' }}>
              <h3 className="text-lg font-semibold" style={{ color: '#FF6B35' }}>
                📚 {editData ? "Chỉnh sửa từ vựng" : "Thêm từ vựng mới"}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: '#FFFFFF', color: '#666666' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFEBEE'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              <div className="px-6 py-4 space-y-4" style={{ backgroundColor: '#FFF8F0' }}>
                {/* Từ vựng */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>
                    Từ vựng <span style={{ color: '#C62828' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="word"
                    value={vocabulary.word}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                    style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                    onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
                    required
                    placeholder="Nhập từ vựng"
                  />
                </div>

                {/* Nghĩa */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>
                    Nghĩa <span style={{ color: '#C62828' }}>*</span>
                  </label>
                  <textarea
                    name="meaning"
                    value={vocabulary.meaning}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors resize-none"
                    style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                    onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
                    required
                    placeholder="Nhập nghĩa của từ vựng"
                  />
                </div>

                {/* Ví dụ */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>
                    Ví dụ
                  </label>
                  <textarea
                    name="example"
                    value={vocabulary.example}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors resize-none"
                    style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                    onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
                    placeholder="Nhập ví dụ (không bắt buộc)"
                  />
                </div>

                {/* Media Section */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                    📷 Upload Media
                  </label>

                  {/* Hiển thị media hiện có (nếu có) */}
                  {vocabulary.media && (
                    <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#E8F5E9', border: '1px solid #81C784' }}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium flex items-center" style={{ color: '#2E7D32' }}>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {editData && !hasMediaChanged
                            ? "Media hiện có:"
                            : "Media đã tải lên:"}
                        </p>

                        {/* Hiển thị trạng thái thay đổi */}
                        {editData && hasMediaChanged && (
                          <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}>
                            Đã thay đổi
                          </span>
                        )}
                      </div>

                      <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
                        <MediaPreview mediaUrl={vocabulary.media} />
                      </div>

                      <div className="flex justify-between items-center mt-3 space-x-2">
                        <a
                          href={vocabulary.media}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm flex items-center transition-colors"
                          style={{ color: '#FF6B35' }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Xem trong tab mới
                        </a>

                        <div className="flex space-x-2">
                          {/* Nút khôi phục media gốc (chỉ hiện khi edit và đã thay đổi) */}
                          {editData && hasMediaChanged && originalMedia && (
                            <button
                              type="button"
                              className="text-sm flex items-center transition-colors"
                              style={{ color: '#1976D2' }}
                              onClick={handleRestoreOriginalMedia}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#1565C0'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#1976D2'}
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                />
                              </svg>
                              Khôi phục
                            </button>
                          )}

                          <button
                            type="button"
                            className="text-sm flex items-center transition-colors"
                            style={{ color: '#C62828' }}
                            onClick={handleRemoveMedia}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#B71C1C'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#C62828'}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Xóa media
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dropzone để upload media mới */}
                  <div className={vocabulary.media ? "mt-4" : ""}>
                    {vocabulary.media && (
                      <p className="text-sm mb-2" style={{ color: '#666666' }}>
                        {editData
                          ? "Tải lên media mới để thay thế:"
                          : "Hoặc tải lên media khác:"}
                      </p>
                    )}
                    <DropzoneComponent onUploaded={handleUploaded} />
                  </div>
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
                    editData ? "Cập nhật" : "Thêm từ vựng"
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
