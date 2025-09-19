import { useState, useEffect } from "react";
import axios from "axios";

interface Lesson {
  lessonId?: number;
  lessonName: string;
  lessonDescription: string;
  levelId: number;
}

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Lesson | null;
  levelId?: number;
}

export default function AddLessonModal({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
  levelId: propLevelId = 1,
}: AddLessonModalProps) {
  const [lesson, setLesson] = useState<Lesson>({
    lessonName: "",
    lessonDescription: "",
    levelId: propLevelId || 1,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && editData) {
      setLesson({
        lessonId: editData.lessonId,
        lessonName: editData.lessonName ?? "",
        lessonDescription: editData.lessonDescription ?? "",
        levelId: (editData.levelId ?? propLevelId) || 1,
      });
    } else if (isOpen && !editData) {
      setLesson({
        lessonName: "",
        lessonDescription: "",
        levelId: propLevelId || 1,
      });
    }
  }, [isOpen, editData, propLevelId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLesson((prev) => ({
      ...prev,
      [name]: name === "levelId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson.lessonName.trim() || !lesson.lessonDescription.trim()) {
      alert("Vui lòng nhập đầy đủ tên bài học và mô tả!");
      return;
    }
    setIsLoading(true);
    try {
      const submitData = {
        lessonName: lesson.lessonName.trim(),
        lessonDescription: lesson.lessonDescription.trim(),
        levelId: lesson.levelId,
      };

      if (!submitData.levelId || isNaN(submitData.levelId)) {
        alert("LevelId không hợp lệ! Hãy chọn lại level.");
        setIsLoading(false);
        return;
      }

      if (editData && lesson.lessonId) {
        await axios.put(`/api/lessons/${lesson.lessonId}`, submitData);
        alert("Cập nhật bài học thành công!");
      } else {
        await axios.post("/api/lessons", submitData);
        alert("Thêm bài học thành công!");
      }

      onSuccess();
      setLesson({
        lessonName: "",
        lessonDescription: "",
        levelId: propLevelId || 1,
      });
    } catch (error: unknown) {
      let message = "Lỗi không xác định";

      type AxiosErrorResponse = {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      const err = error as AxiosErrorResponse;

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof err.response?.data?.message === "string"
      ) {
        message = err.response!.data!.message!;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof err.message === "string"
      ) {
        message = err.message!;
      }
      alert(`Lỗi ${editData ? "cập nhật" : "thêm"} bài học: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-x-0 top-[64px] bottom-0 z-50 flex items-start justify-center overflow-y-auto">
        <div className="relative w-full max-w-2xl mx-auto my-6 p-4">
          <div className="relative bg-white dark:bg-zinc-800 rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editData ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="w-6 h-6"
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
            <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên bài học *
                  </label>
                  <input
                    type="text"
                    name="lessonName"
                    value={lesson.lessonName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    required
                    placeholder="Nhập tên bài học"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mô tả *
                  </label>
                  <textarea
                    name="lessonDescription"
                    value={lesson.lessonDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    required
                    placeholder="Nhập mô tả bài học"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cấp độ *
                  </label>
                  <select
                    name="levelId"
                    value={lesson.levelId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    required
                  >
                    <option value={1}>1 - Bắt đầu làm quen (TOPIK 1)</option>
                    <option value={2}>2 - Nền tảng vững chắc (TOPIK 2)</option>
                    <option value={3}>3 - Giao tiếp tự nhiên (TOPIK 3)</option>
                    <option value={4}>4 - Hiểu sâu văn bản (TOPIK 4)</option>
                    <option value={5}>5 - Thành thạo tiếng Hàn (TOPIK 5)</option>
                    <option value={6}>6 - Chuyên sâu học thuật (TOPIK 6)</option>
                  </select>
                </div>
              </div>
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
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {editData ? "Đang cập nhật..." : "Đang thêm..."}
                    </>
                  ) : editData ? "Cập nhật" : "Thêm bài học"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
