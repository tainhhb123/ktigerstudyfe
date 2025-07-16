import { useState, useEffect } from "react";
import axios from "axios";

// 🔍 Interface khớp với database fields
interface Grammar {
  grammarId?: number;
  grammarTitle: string;     // Khớp với grammar_title
  grammarContent: string;   // Khớp với grammar_content  
  grammarExample?: string;  // Khớp với grammar_example
  lessonId: number;         // Khớp với lessonid
}

interface AddGrammarModalProps {
  lessonId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Grammar | null;
}

export default function AddGrammarModal({
  lessonId,
  isOpen,
  onClose,
  onSuccess,
  editData = null,
}: AddGrammarModalProps) {
  const [grammar, setGrammar] = useState<Grammar>({
    grammarTitle: "",
    grammarContent: "",
    grammarExample: "",
    lessonId,
  });
  const [isLoading, setIsLoading] = useState(false);

  // 🔍 Load edit data với debug logs
  useEffect(() => {
    console.log("Modal opened - isOpen:", isOpen, "editData:", editData);
    
    if (isOpen && editData) {
      console.log("Loading edit data:", editData);
      setGrammar({
        grammarId: editData.grammarId,
        grammarTitle: editData.grammarTitle || "",
        grammarContent: editData.grammarContent || "",
        grammarExample: editData.grammarExample || "",
        lessonId: editData.lessonId || lessonId,
      });
    } else if (isOpen && !editData) {
      console.log("Resetting form for new grammar");
      setGrammar({
        grammarTitle: "",
        grammarContent: "",
        grammarExample: "",
        lessonId,
      });
    }
  }, [isOpen, editData, lessonId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log("Field changed:", name, "=", value); // 🔍 Debug log
    setGrammar((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!grammar.grammarTitle.trim() || !grammar.grammarContent.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }

    setIsLoading(true);

    try {
      // 🔍 Đảm bảo gửi đúng field names
      const submitData = {
        grammarTitle: grammar.grammarTitle.trim(),
        grammarContent: grammar.grammarContent.trim(),
        grammarExample: grammar.grammarExample?.trim() || "",
        lessonId: lessonId, // Sử dụng lessonId từ props
      };

      console.log("Submit data:", submitData);
      console.log("Edit mode:", !!editData);
      console.log("Grammar ID:", grammar.grammarId);

      if (editData && grammar.grammarId) {
        // Update existing grammar
        console.log("Making PUT request to:", `/api/grammar-theories/${grammar.grammarId}`);
        
        const response = await axios.put(
          `/api/grammar-theories/${grammar.grammarId}`,
          submitData
        );
        
        console.log("PUT response:", response.data);
        alert("Cập nhật ngữ pháp thành công!");
      } else {
        // Create new grammar
        console.log("Making POST request to:", "/api/grammar-theories");
        
        const response = await axios.post("/api/grammar-theories", submitData);
        
        console.log("POST response:", response.data);
        alert("Thêm ngữ pháp thành công!");
      }

      onSuccess();

      // Reset form
      setGrammar({
        grammarTitle: "",
        grammarContent: "",
        grammarExample: "",
        lessonId,
      });

    } catch (error: unknown) {
      console.error("API Error:", error);
      
      if (axios.isAxiosError(error)) {
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
        console.error("Request URL:", error.config?.url);
        console.error("Request method:", error.config?.method);
        console.error("Request data:", error.config?.data);
        
        const errorMessage = error.response?.data?.message || error.message || "Lỗi không xác định";
        alert(`Lỗi ${editData ? "cập nhật" : "thêm"} ngữ pháp: ${errorMessage}`);
      } else if (error instanceof Error) {
        alert(`Lỗi ${editData ? "cập nhật" : "thêm"} ngữ pháp: ${error.message}`);
      } else {
        alert(`Lỗi ${editData ? "cập nhật" : "thêm"} ngữ pháp: Lỗi không xác định`);
      }
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
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editData ? "Chỉnh sửa ngữ pháp" : "Thêm ngữ pháp mới"}
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
              <div className="px-6 py-4 space-y-4">
                {/* Tiêu đề */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    name="grammarTitle"
                    value={grammar.grammarTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    required
                    placeholder="Nhập tiêu đề ngữ pháp"
                  />
                </div>

                {/* Nội dung */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nội dung *
                  </label>
                  <textarea
                    name="grammarContent"
                    value={grammar.grammarContent}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    required
                    placeholder="Nhập nội dung ngữ pháp"
                  />
                </div>

                {/* Ví dụ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ví dụ
                  </label>
                  <textarea
                    name="grammarExample"
                    value={grammar.grammarExample}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    placeholder="Nhập ví dụ (không bắt buộc)"
                  />
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
                    editData ? "Cập nhật" : "Thêm ngữ pháp"
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