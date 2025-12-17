import { useEffect, useState } from "react";
import { getGrammarByLessonId } from "../../services/GrammarApi";

interface GrammarTheory {
  grammarId: number;
  grammarTitle: string;
  grammarContent: string;
  grammarExample: string;
}

interface GrammarProps {
  lessonId: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}

export default function Grammar({ lessonId, setActiveTab: setLessonTab }: GrammarProps) {
  const [grammars, setGrammars] = useState<GrammarTheory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "learning" | "completed">("all");
  // Thêm state để theo dõi các mục ngữ pháp đã học
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  useEffect(() => {
    getGrammarByLessonId(lessonId)
      .then((data) => {
        setGrammars(data);
        // Mở grammar đầu tiên tự động
        if (data.length > 0) {
          setExpandedId(data[0].grammarId);
        }
      })
      .catch((err) => console.error("Failed to fetch grammar:", err))
      .finally(() => setLoading(false));
    
    // Lấy danh sách ID đã hoàn thành từ localStorage
    const savedCompletedIds = localStorage.getItem(`grammar_completed_${lessonId}`);
    if (savedCompletedIds) {
      setCompletedIds(JSON.parse(savedCompletedIds));
    }
  }, [lessonId]);

  // Hàm xử lý khi nhấn nút "Đánh dấu đã học"
  const handleMarkAsCompleted = (grammarId: number) => {
    let newCompletedIds: number[];
    
    if (completedIds.includes(grammarId)) {
      // Nếu đã học rồi, bỏ đánh dấu
      newCompletedIds = completedIds.filter(id => id !== grammarId);
    } else {
      // Nếu chưa học, thêm vào danh sách đã học
      newCompletedIds = [...completedIds, grammarId];
    }
    
    // Cập nhật state
    setCompletedIds(newCompletedIds);
    
    // Lưu vào localStorage
    localStorage.setItem(`grammar_completed_${lessonId}`, JSON.stringify(newCompletedIds));
    
    // Gửi API để cập nhật trạng thái trên server (giả định)
    // markGrammarAsCompleted(grammarId, !completedIds.includes(grammarId))
    //   .then(() => console.log("Cập nhật trạng thái thành công"))
    //   .catch(err => console.error("Lỗi khi cập nhật trạng thái:", err));
  };

  // Lọc grammars dựa vào tab đang chọn
  const filteredGrammars = grammars.filter(grammar => {
    if (activeTab === "all") return true;
    if (activeTab === "completed") return completedIds.includes(grammar.grammarId);
    if (activeTab === "learning") return !completedIds.includes(grammar.grammarId);
    return true;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#FF6B35' }}></div>
      </div>
    );
  }

  // Tính phần trăm tiến độ hoàn thành
  const completionPercentage = grammars.length > 0 
    ? Math.round((completedIds.length / grammars.length) * 100) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs để lọc nội dung */}
      <div className="mb-6" style={{ borderBottom: '1px solid #BDBDBD' }}>
        <div className="flex space-x-4">
          <button 
            className="py-3 px-4 font-medium transition-all"
            style={{
              borderBottom: activeTab === "all" ? '3px solid #FF6B35' : '3px solid transparent',
              color: activeTab === "all" ? '#FF6B35' : '#666666'
            }}
            onClick={() => setActiveTab("all")}
          >
            Tất cả
          </button>
          <button 
            className="py-3 px-4 font-medium transition-all"
            style={{
              borderBottom: activeTab === "learning" ? '3px solid #FF6B35' : '3px solid transparent',
              color: activeTab === "learning" ? '#FF6B35' : '#666666'
            }}
            onClick={() => setActiveTab("learning")}
          >
            Đang học
          </button>
          <button 
            className="py-3 px-4 font-medium transition-all flex items-center"
            style={{
              borderBottom: activeTab === "completed" ? '3px solid #FF6B35' : '3px solid transparent',
              color: activeTab === "completed" ? '#FF6B35' : '#666666'
            }}
            onClick={() => setActiveTab("completed")}
          >
            Đã hoàn thành
            {completedIds.length > 0 && (
              <span className="ml-2 rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}>
                {completedIds.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {filteredGrammars.length === 0 && (
        <div className="text-center py-10 rounded-xl" style={{ backgroundColor: '#FFF8F0', border: '1px solid #BDBDBD' }}>
          <div className="text-4xl mb-3">
            {activeTab === "completed" ? "🎉" : "🔍"}
          </div>
          <p style={{ color: '#666666' }}>
            {activeTab === "completed" 
              ? "Bạn chưa hoàn thành nội dung ngữ pháp nào" 
              : "Không có dữ liệu ngữ pháp cho bài học này."}
          </p>
          <p className="text-sm mt-2" style={{ color: '#999999' }}>
            {activeTab === "completed" 
              ? "Hãy đánh dấu đã học khi bạn hiểu rõ nội dung" 
              : "Vui lòng chọn bài học khác hoặc quay lại sau."}
          </p>
        </div>
      )}

      {/* Thanh tiến độ học tập */}
      {grammars.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium" style={{ color: '#333333' }}>Tiến độ học ngữ pháp</span>
            <span className="text-sm font-medium" style={{ color: '#FF6B35' }}>{completedIds.length}/{grammars.length}</span>
          </div>
          <div className="w-full rounded-full h-2.5" style={{ backgroundColor: '#E0E0E0' }}>
            <div 
              className="h-2.5 rounded-full transition-all duration-500"
              style={{ backgroundColor: '#FF6B35' }} 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {filteredGrammars.map((g, index) => {
          const isCompleted = completedIds.includes(g.grammarId);
          
          return (
            <div
              key={g.grammarId}
              className="rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
              style={{
                backgroundColor: expandedId === g.grammarId ? '#FFF8F0' : '#FFFFFF',
                border: expandedId === g.grammarId ? '2px solid #FF6B35' : '1px solid #BDBDBD',
                borderLeft: isCompleted ? '4px solid #4CAF50' : undefined
              }}
            >
              {/* Header - Luôn hiển thị */}
              <div 
                className="p-5 flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(g.grammarId)}
              >
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold"
                    style={{
                      backgroundColor: isCompleted ? '#E8F5E9' : '#FFE8DC',
                      color: isCompleted ? '#4CAF50' : '#FF6B35'
                    }}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: '#333333' }}>{g.grammarTitle}</h3>
                  {isCompleted && (
                    <span className="ml-3 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#E8F5E9', color: '#4CAF50' }}>
                      Đã học
                    </span>
                  )}
                </div>
                <button className="p-2 rounded-full transition-colors" style={{ color: '#FF6B35' }}>
                  {expandedId === g.grammarId ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </button>
              </div>

              {/* Nội dung chi tiết - Chỉ hiển thị khi được mở */}
              {expandedId === g.grammarId && (
                <div className="px-5 pb-5 space-y-4">
                  {/* Nội dung */}
                  <div className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
                    <div className="flex items-center mb-3">
                      <span className="w-8 h-8 rounded-full text-white flex items-center justify-center mr-2" style={{ backgroundColor: '#FF6B35' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                      </span>
                      <h4 className="text-md font-semibold" style={{ color: '#FF6B35' }}>Nội dung</h4>
                    </div>
                    <div className="whitespace-pre-line leading-relaxed pl-10" style={{ color: '#333333' }}>
                      {g.grammarContent}
                    </div>
                  </div>

                  {/* Ví dụ */}
                  <div className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
                    <div className="flex items-center mb-3">
                      <span className="w-8 h-8 rounded-full text-white flex items-center justify-center mr-2" style={{ backgroundColor: '#4CAF50' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </span>
                      <h4 className="text-md font-semibold" style={{ color: '#4CAF50' }}>Ví dụ</h4>
                    </div>
                    <div className="whitespace-pre-line leading-relaxed pl-10" style={{ color: '#333333' }}>
                      {g.grammarExample}
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="flex justify-between items-center mt-4 pt-3" style={{ borderTop: '1px solid #E0E0E0' }}>
                    <div>
                      <button 
                        className="inline-flex items-center px-3 py-1.5 mr-2 rounded-full text-sm transition-colors"
                        style={{ border: '1px solid #FF6B35', color: '#FF6B35' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Ghi chú
                      </button>
                      <button 
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm transition-colors"
                        style={{ border: '1px solid #BDBDBD', color: '#666666' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Hỏi đáp
                      </button>
                    </div>
                    
                    {/* Nút đánh dấu đã học - thay đổi dựa vào trạng thái */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsCompleted(g.grammarId);
                      }}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm shadow-sm transition-all"
                      style={{
                        backgroundColor: isCompleted ? '#E0E0E0' : '#4CAF50',
                        color: isCompleted ? '#666666' : '#FFFFFF'
                      }}
                    >
                      {isCompleted ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                          </svg>
                          Đánh dấu chưa học
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                          </svg>
                          Đánh dấu đã học
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Phần gợi ý tiếp theo */}
      {grammars.length > 0 && (
        <div 
          className="mt-12 p-6 rounded-xl flex justify-between items-center"
          style={{ backgroundColor: '#FFF8F0', border: '1px solid #FF6B35' }}
        >
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#FF6B35' }}>Bước tiếp theo</h3>
            <p style={{ color: '#666666' }}>Sau khi học xong ngữ pháp, hãy làm bài tập để củng cố kiến thức!</p>
          </div>
          <button 
            className="px-5 py-2 text-white rounded-lg shadow-sm flex items-center transition-colors"
            style={{ backgroundColor: '#FF6B35' }}
            onClick={() => setLessonTab && setLessonTab("exercise")}
          >
            Làm bài tập
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}