import { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosConfig";

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
        
        const response = await axiosInstance.put(
          `/api/grammar-theories/${grammar.grammarId}`,
          submitData
        );
        
        console.log("PUT response:", response.data);
        alert("Cập nhật ngữ pháp thành công!");
      } else {
        // Create new grammar
        console.log("Making POST request to:", "/api/grammar-theories");
        
        const response = await axiosInstance.post("/api/grammar-theories", submitData);
        
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
      
      if (axiosInstance.isAxiosError(error)) {
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
      <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={onClose} />
      <div className="fixed inset-x-0 top-[64px] bottom-0 z-50 flex items-start justify-center overflow-y-auto">
        <div className="relative w-full max-w-2xl mx-auto my-6 p-4">
          <div className="relative rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-6" style={{ backgroundColor: '#FFE8DC', borderBottom: '1px solid #BDBDBD' }}>
              <h3 className="text-lg font-semibold" style={{ color: '#FF6B35' }}>
                📖 {editData ? "Chỉnh sửa ngữ pháp" : "Thêm ngữ pháp mới"}
              </h3>
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
              <div className="px-6 py-4 space-y-4" style={{ backgroundColor: '#FFF8F0' }}>
                {/* Tiêu đề */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>
                    Tiêu đề <span style={{ color: '#C62828' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="grammarTitle"
                    value={grammar.grammarTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                    style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                    onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
                    required
                    placeholder="Nhập tiêu đề ngữ pháp"
                  />
                </div>

                {/* Nội dung */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>
                    Nội dung <span style={{ color: '#C62828' }}>*</span>
                  </label>
                  <textarea
                    name="grammarContent"
                    value={grammar.grammarContent}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors resize-none"
                    style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                    onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
                    required
                    placeholder="Nhập nội dung ngữ pháp"
                  />
                </div>

                {/* Ví dụ */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>
                    Ví dụ
                  </label>
                  <textarea
                    name="grammarExample"
                    value={grammar.grammarExample}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors resize-none"
                    style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF', color: '#333333' }}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                    onBlur={(e) => e.target.style.borderColor = '#BDBDBD'}
                    placeholder="Nhập ví dụ (không bắt buộc)"
                  />
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