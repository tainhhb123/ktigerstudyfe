# AI Writing Grading - Setup Guide

## 🎯 Architecture

```
Frontend (React)
    ↓ POST /api/ai-grading/grade-writing
Backend (Spring Boot)
    ↓ Call Groq API with API key
Groq AI (Llama 3.3 70B)
    ↓ Return grading result
Backend → Frontend → Display UI
```

**✅ API Key nằm ở Backend** - Không expose trên frontend!

## Tính năng
Hệ thống chấm điểm tự động cho phần Writing của TOPIK sử dụng **Groq AI** (Llama 3.3 70B).

### Tiêu chí chấm điểm:
- **Nội dung (40 điểm)**: Trả lời đầy đủ yêu cầu, ý tưởng rõ ràng
- **Ngữ pháp (30 điểm)**: Sử dụng đúng ngữ pháp, cấu trúc câu
- **Từ vựng (20 điểm)**: Từ vựng phong phú, phù hợp ngữ cảnh
- **Tổ chức (10 điểm)**: Bố cục logic, mạch lạc

## Setup Backend

### 1. Tạo tài khoản Groq
1. Truy cập: https://console.groq.com/
2. Đăng ký/Đăng nhập với Google
3. **FREE** - Không cần thẻ tín dụng

### 2. Lấy API Key
1. Vào trang Keys: https://console.groq.com/keys
2. Click "Create API Key"
3. Đặt tên: `KTigerStudy-Writing-Grading`
4. Copy API key (chỉ hiển thị 1 lần!)

### 3. Cấu hình Backend
```properties
# application.properties
groq.api.key=gsk_xxxxxxxxxxxxxxxxxxxxx
```

### 4. Add Backend Files
Copy các files từ `backend-code/`:
- ✅ AIGradingController.java
- ✅ AIGradingService.java
- ✅ AIGradingServiceImpl.java
- ✅ WritingGradingRequest.java
- ✅ WritingGradingResult.java

Xem chi tiết: [backend-code/BACKEND-AI-GRADING-SETUP.md](backend-code/BACKEND-AI-GRADING-SETUP.md)

## Setup Frontend (Already Done ✅)

Frontend đã sẵn sàng:
- ✅ [src/services/aiGradingService.ts](src/services/aiGradingService.ts) - Gọi backend API
- ✅ [src/pages/Learn/TopikExamResult.tsx](src/pages/Learn/TopikExamResult.tsx) - Hiển thị kết quả
- ✅ [src/types/exam.ts](src/types/exam.ts) - Types định nghĩa

## Cách hoạt động

### Flow chấm điểm:
1. Học sinh làm bài thi TOPIK → Nộp bài
2. Backend lưu câu trả lời vào DB
3. Backend tự động chấm MCQ/SHORT
4. **Backend gọi Groq AI để chấm ESSAY (Q53 & Q54)**
5. Frontend fetch kết quả
6. Hiển thị:
   - Điểm chi tiết (Content/Grammar/Vocabulary/Organization)
   - Nhận xét tổng quan
   - Gợi ý cải thiện

### Logic chấm điểm:
- So sánh với **câu trả lời mẫu** (từ DB - trường `correctAnswer`)
- Kiểm tra **số ký tự** (Q53: 200-300, Q54: 600-700)
- Đánh giá theo tiêu chí TOPIK
- Trả về JSON với điểm số và feedback

## File structure

### Frontend (✅ Done)
```
src/services/
  aiGradingService.ts    # Gọi backend API
  ExamApi.ts             # Added aiGradingApi

src/pages/Learn/
  TopikExamResult.tsx    # Display AI grading results
  
src/types/
  exam.ts                # WritingGradingResult types
```

### Backend (Need to Add)
```
controller/
  AIGradingController.java

service/aiGrading/
  AIGradingService.java
  AIGradingServiceImpl.java
  
dto/req/
  WritingGradingRequest.java
  
dto/resp/
  WritingGradingResult.java
```

## API Endpoints

### Backend → Groq
```
POST /api/ai-grading/grade-writing
Body: WritingGradingRequest
Response: WritingGradingResult
```

### Frontend → Backend
```typescript
// Frontend
const result = await aiGradingService.gradeWriting({
  questionNumber: 53,
  questionText: "...",
  studentAnswer: "...",
  referenceAnswer: "...",
  minChars: 200,
  maxChars: 300
});
```

## API Rate Limits (Groq Free Tier)

- **Requests per minute**: 30
- **Tokens per minute**: 14,400
- **Tokens per day**: 14,400

**Lưu ý**: Đủ để chấm ~100 bài Writing/ngày. Nếu cần nhiều hơn, upgrade lên Pro ($10/month).

## Fallback Strategy

Nếu Groq API lỗi hoặc hết quota:
- Backend tự động fallback về chấm điểm cơ bản (based on length)
- Hiển thị thông báo "Hệ thống AI tạm thời không khả dụng"
- Vẫn lưu bài viết của học sinh

## Testing

### Test Case 1: Bài đạt yêu cầu
- Viết 250 ký tự (Q53) hoặc 650 ký tự (Q54)
- Nội dung rõ ràng, ngữ pháp đúng
- Expected: Điểm ≥ 70/100

### Test Case 2: Bài thiếu số ký tự
- Viết < 200 ký tự (Q53)
- Expected: Điểm 0, thông báo lỗi

### Test Case 3: Không làm bài
- Bỏ trống
- Expected: "Không có bài làm"

## Prompt Engineering

File: `backend-code/AIGradingServiceImpl.java`

Prompt được thiết kế để:
- Vai trò: Giáo viên tiếng Hàn chuyên nghiệp
- Ngữ cảnh: Chấm thi TOPIK Writing
- Output: JSON format chính xác
- Temperature: 0.3 (deterministic, ít sáng tạo)

## Troubleshooting

### Lỗi: "Không thể kết nối với AI grading service"
- ✅ Kiểm tra `groq.api.key` trong `application.properties`
- ✅ Kiểm tra API key còn hạn hay không
- ✅ Kiểm tra rate limit

### Lỗi: "Failed to parse AI response"
- ✅ Model trả về không phải JSON
- ✅ Có thể do prompt không rõ ràng
- ✅ Kiểm tra backend logs để xem raw response

### AI chấm điểm quá cao/thấp
- ✅ Điều chỉnh prompt trong `AIGradingServiceImpl.java`
- ✅ Thêm ví dụ mẫu vào prompt
- ✅ Tăng temperature để linh hoạt hơn (0.3 → 0.5)

## Next Steps (Optional)

1. **Save AI scores to DB**: Lưu kết quả AI vào bảng `ai_grading_result`
2. **Teacher override**: Cho phép giáo viên sửa điểm AI
3. **History tracking**: Theo dõi độ chính xác của AI
4. **Multi-language**: Support chấm bài tiếng Việt
5. **Export report**: Xuất báo cáo PDF với feedback

## Support
- Groq Docs: https://console.groq.com/docs
- Model: Llama 3.3 70B Versatile
- Speed: ~500 tokens/second (very fast!)
