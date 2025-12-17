import React, { useState, useRef } from 'react';

interface TopikWritingGridProps {
  questionNumber: number;
  maxCharacters: number; // 300 cho câu 53, 700 cho câu 54
  minCharacters?: number; // 200 cho câu 53, 600 cho câu 54
  prompt: string; // Đề bài
  imageUrl?: string; // Hình ảnh/biểu đồ nếu có
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const CHARS_PER_ROW = 20; // Số ký tự mỗi hàng theo chuẩn TOPIK

export default function TopikWritingGrid({
  questionNumber,
  maxCharacters,
  minCharacters = 0,
  prompt,
  imageUrl,
  value,
  onChange,
  readOnly = false
}: TopikWritingGridProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  // Tính số hàng cần thiết
  const totalRows = Math.ceil(maxCharacters / CHARS_PER_ROW);
  const charCount = value.length;

  // Handle text change - đơn giản, không can thiệp cursor
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxCharacters) {
      onChange(newValue);
    }
  };

  // Click vào grid container để focus textarea
  const handleGridContainerClick = () => {
    if (!readOnly && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Render grid cells - CHỈ HIỂN THỊ, không có logic cursor phức tạp
  const renderGridCells = () => {
    const cells = [];
    
    for (let row = 0; row < totalRows; row++) {
      const rowCells = [];
      for (let col = 0; col < CHARS_PER_ROW; col++) {
        const index = row * CHARS_PER_ROW + col;
        const char = value[index] || '';
        const isNewLine = char === '\n';
        const hasChar = index < value.length;
        
        rowCells.push(
          <div
            key={`${row}-${col}`}
            className={`
              w-7 h-7 md:w-8 md:h-8 border flex items-center justify-center 
              text-sm md:text-base font-medium select-none
              ${hasChar ? 'bg-white border-gray-300' : 'bg-gray-50/30 border-gray-200'}
              ${isNewLine ? 'text-gray-400' : 'text-gray-800'}
            `}
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            {isNewLine ? '↵' : char}
          </div>
        );
      }
      
      cells.push(
        <div key={row} className="flex items-center">
          {/* Row number indicator - every 5 rows */}
          <div className="w-8 text-right pr-2 text-xs text-gray-400 select-none">
            {(row + 1) % 5 === 0 ? (row + 1) * CHARS_PER_ROW : ''}
          </div>
          <div className="flex">{rowCells}</div>
        </div>
      );
    }
    
    return cells;
  };

  // Character count status
  const getCountStatus = () => {
    if (charCount < minCharacters) {
      return { color: '#FF5252', text: `Tối thiểu ${minCharacters} ký tự`, bgColor: '#FFEBEE' };
    }
    if (charCount >= minCharacters && charCount <= maxCharacters) {
      return { color: '#4CAF50', text: 'Đạt yêu cầu', bgColor: '#E8F5E9' };
    }
    return { color: '#FFC107', text: 'Gần đạt giới hạn', bgColor: '#FFF8E1' };
  };

  const status = getCountStatus();

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
      {/* Header */}
      <div className="p-4 md:p-6" style={{ backgroundColor: '#FFF8F0', borderBottom: '1px solid #BDBDBD' }}>
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: '#FF6B35' }}
          >
            {questionNumber}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold" style={{ color: '#333333' }}>
                {questionNumber === 53 ? '짧은 글 쓰기' : '긴 글 쓰기'}
              </span>
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
              >
                {minCharacters}-{maxCharacters}자
              </span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#666666' }}>
              {prompt}
            </p>
          </div>
        </div>
        
        {/* Image/Chart if available */}
        {imageUrl && (
          <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
            <img 
              src={imageUrl} 
              alt="Question reference" 
              className="max-w-full h-auto mx-auto rounded-lg"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}
      </div>

      {/* Toggle View */}
      <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E0E0E0' }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid(true)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ 
              backgroundColor: showGrid ? '#FF6B35' : 'transparent',
              color: showGrid ? '#FFFFFF' : '#666666'
            }}
          >
            📝 Ô viết TOPIK
          </button>
          <button
            onClick={() => setShowGrid(false)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ 
              backgroundColor: !showGrid ? '#FF6B35' : 'transparent',
              color: !showGrid ? '#FFFFFF' : '#666666'
            }}
          >
            ✏️ Soạn thảo
          </button>
        </div>
        
        {/* Character Counter */}
        <div 
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ backgroundColor: status.bgColor }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
          <span className="text-sm font-medium" style={{ color: status.color }}>
            {charCount}/{maxCharacters}자
          </span>
        </div>
      </div>

      {/* Writing Area */}
      <div className="p-4">
        {showGrid ? (
          /* Grid View với textarea nhập liệu riêng */
          <div className="space-y-4">
            {/* Grid hiển thị - chỉ để xem, không nhập trực tiếp */}
            <div 
              className="overflow-x-auto cursor-pointer"
              onClick={handleGridContainerClick}
            >
              <div 
                className={`inline-block p-4 rounded-xl transition-all ${
                  isFocused ? 'ring-2 ring-[#FF6B35]' : ''
                }`}
                style={{ 
                  backgroundColor: '#FEFEFE', 
                  border: isFocused ? '2px solid #FF6B35' : '2px solid #E0E0E0'
                }}
              >
                {/* Grid Header */}
                <div className="flex items-center mb-2">
                  <div className="w-8"></div>
                  <div className="flex">
                    {Array.from({ length: CHARS_PER_ROW }, (_, i) => (
                      <div 
                        key={i}
                        className="w-7 h-5 md:w-8 text-center text-xs select-none"
                        style={{ color: '#BDBDBD' }}
                      >
                        {(i + 1) % 5 === 0 ? i + 1 : ''}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Grid Cells */}
                <div className="space-y-0.5">
                  {renderGridCells()}
                </div>
                
                {/* Grid Footer */}
                <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px dashed #E0E0E0' }}>
                  <span className="text-xs" style={{ color: '#999999' }}>
                    💡 Mỗi hàng {CHARS_PER_ROW} ký tự • Tổng {totalRows} hàng
                  </span>
                  <span className="text-xs font-medium" style={{ color: status.color }}>
                    {status.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Textarea nhập liệu - hiển thị rõ ràng */}
            <div className="relative">
              <div 
                className="absolute left-3 top-3 text-sm font-medium flex items-center gap-2 pointer-events-none"
                style={{ color: '#FF6B35' }}
              >
                ⌨️ Nhập văn bản tại đây:
              </div>
              <textarea
                ref={textareaRef}
                value={value}
                onChange={handleTextareaChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                readOnly={readOnly}
                placeholder="Gõ tiếng Hàn vào đây, nội dung sẽ hiển thị trong ô kẻ phía trên..."
                className="w-full pt-10 px-4 pb-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-base leading-relaxed"
                style={{ 
                  minHeight: '120px',
                  backgroundColor: '#FFF8F0',
                  border: '2px solid #FFE8DC',
                  color: '#333333',
                  fontFamily: "'Noto Sans KR', sans-serif"
                }}
                rows={4}
              />
            </div>
          </div>
        ) : (
          /* Text Editor View - Chế độ soạn thảo thuần */
          <div className="relative">
            <textarea
              value={value}
              onChange={handleTextareaChange}
              readOnly={readOnly}
              placeholder="여기에 답을 작성하세요... (Viết câu trả lời ở đây...)"
              className="w-full p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-base leading-relaxed"
              style={{ 
                minHeight: questionNumber === 53 ? '250px' : '450px',
                backgroundColor: '#FAFAFA',
                border: '2px solid #E0E0E0',
                color: '#333333',
                fontFamily: "'Noto Sans KR', sans-serif"
              }}
              rows={questionNumber === 53 ? 12 : 22}
            />
            
            <div 
              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ backgroundColor: status.bgColor, color: status.color }}
            >
              {charCount}/{maxCharacters}자
            </div>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="px-4 pb-4">
        <div 
          className="p-4 rounded-xl"
          style={{ backgroundColor: '#E8F5E9', border: '1px solid #4CAF50' }}
        >
          <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#2E7D32' }}>
            💡 Mẹo viết {questionNumber === 53 ? 'đoạn văn ngắn' : 'bài luận'}
          </h4>
          <ul className="text-sm space-y-1" style={{ color: '#333333' }}>
            {questionNumber === 53 ? (
              <>
                <li>• Viết đủ {minCharacters}-{maxCharacters} ký tự (bao gồm cả dấu cách)</li>
                <li>• Cấu trúc: Mở bài → Thân bài → Kết luận ngắn gọn</li>
                <li>• Sử dụng các liên từ: 그리고, 그래서, 하지만, 그런데...</li>
                <li>• Chú ý ngữ pháp và chính tả tiếng Hàn</li>
              </>
            ) : (
              <>
                <li>• Viết đủ {minCharacters}-{maxCharacters} ký tự</li>
                <li>• Cấu trúc rõ ràng: 서론 (Mở) → 본론 (Thân) → 결론 (Kết)</li>
                <li>• Đưa ra luận điểm, ví dụ cụ thể và lý do</li>
                <li>• Sử dụng các cấu trúc nâng cao: -기 때문에, -ㄴ/는다면, -ㄹ 뿐만 아니라...</li>
                <li>• Kết bài nên tóm tắt và nêu ý kiến cá nhân</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
