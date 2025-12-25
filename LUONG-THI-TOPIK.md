# 📝 LUỒNG THI TOPIK I/II - KTigerStudy

## 📚 Tổng quan

Website cung cấp hệ thống thi thử TOPIK hoàn chỉnh với **tự động chấm điểm** và **chấm bài viết bằng AI**. Hai loại đề thi:

### **TOPIK I** (Sơ cấp)
- ⏱️ 100 phút
- 📝 2 phần thi, tổng 200 điểm
  - **Nghe hiểu (듣기)**: 30 câu x 2đ = 60đ
  - **Đọc hiểu (읽기)**: 40 câu x 2đ = 80đ

### **TOPIK II** (Trung-Cao cấp)  
- ⏱️ 180 phút
- 📝 3 phần thi, tổng 300 điểm
  - **Nghe hiểu (듣기)**: 50 câu x 2đ = 100đ
  - **Viết (쓰기)**: 4 câu = 100đ
    - Câu 51-52: Điền từ (10đ/câu)
    - Câu 53: Luận ngắn 200-300 từ (30đ)
    - Câu 54: Luận dài 600-700 từ (50đ)
  - **Đọc hiểu (읽기)**: 50 câu x 2đ = 100đ

---

## 🎯 LUỒNG CHI TIẾT

### **BƯỚC 1: Chọn đề thi** 
📍 **Trang:** `/learn/topik` - [TopikExamList.tsx](src/pages/Learn/TopikExamList.tsx)

**Người dùng thấy:**
```
┌─────────────────────────────────────────────┐
│  🎯 THI THỬ TOPIK                           │
├─────────────────────────────────────────────┤
│  [TẤT CẢ] [TOPIK I] [TOPIK II]             │
├─────────────────────────────────────────────┤
│                                             │
│  📋 TOPIK II 91회 기출                      │
│  🔹 TOPIK II • 104 câu • 180 phút           │
│  [Làm bài ngay] [Xem chi tiết]             │
│                                             │
│  📋 TOPIK I 87회 기출                       │
│  🔹 TOPIK I • 70 câu • 100 phút             │
│  [Làm bài ngay] [Xem chi tiết]             │
│                                             │
└─────────────────────────────────────────────┘
```

**Chức năng:**
- ✅ Lọc theo TOPIK I / TOPIK II
- ✅ Hiển thị số câu hỏi, thời gian
- ✅ **Banner bài thi đang làm dở** (nếu có)
- ✅ Lưu bài thi chưa hoàn thành vào localStorage

**API call:**
```typescript
GET /api/exams/active  // Lấy danh sách đề thi
```

---

### **BƯỚC 2: Xem chi tiết đề thi** 
📍 **Trang:** `/learn/topik/:examId` - [TopikExamDetail.tsx](src/pages/Learn/TopikExamDetail.tsx)

**Người dùng thấy:**
```
┌─────────────────────────────────────────────┐
│  ← Quay lại danh sách                       │
├─────────────────────────────────────────────┤
│  🎯 TOPIK II 91회 기출                      │
│  [TOPIK II]                                 │
│                                             │
│  📊 104 câu hỏi  |  ⏱️ 180 phút  |  📝 3 phần │
│                                             │
│  [▶️ BẮT ĐẦU LÀM BÀI]                       │
├─────────────────────────────────────────────┤
│  📚 CẤU TRÚC ĐỀ THI:                        │
│                                             │
│  🎧 PHẦN 1: NGHE HIỂU (듣기)                │
│  • 50 câu hỏi x 2 điểm = 100 điểm          │
│  • 60 phút                                  │
│  • Phát audio tự động                       │
│                                             │
│  ✍️ PHẦN 2: VIẾT (쓰기)                     │
│  • 4 câu hỏi = 100 điểm                    │
│    - Câu 51-52: Điền từ (mỗi câu 10đ)     │
│    - Câu 53: Luận ngắn (30đ) - AI chấm    │
│    - Câu 54: Luận dài (50đ) - AI chấm     │
│  • 50 phút                                  │
│                                             │
│  📖 PHẦN 3: ĐỌC HIỂU (읽기)                 │
│  • 50 câu hỏi x 2 điểm = 100 điểm          │
│  • 70 phút                                  │
│  • Đọc đoạn văn, chọn đáp án                │
│                                             │
└─────────────────────────────────────────────┘
```

**Chức năng:**
- ✅ Hiển thị thông tin chi tiết từng phần thi
- ✅ Nút **"Bắt đầu làm bài"** → Tạo exam attempt

**API call:**
```typescript
GET /api/exams/:examId                        // Lấy thông tin đề thi
GET /api/exam-sections/exam/:examId           // Lấy các phần thi
POST /api/exam-attempts/start                 // Tạo attempt mới
  Body: { examId: number, userId: number }
  Response: { attemptId: 123, ... }
```

**Khi nhấn "Bắt đầu":**
1. Check đăng nhập → Nếu chưa → `/signin`
2. Tạo `ExamAttempt` với status = `IN_PROGRESS`
3. Lưu vào localStorage:
   ```json
   {
     "attemptId": "123",
     "examTitle": "TOPIK II 91회 기출",
     "startedAt": "2025-12-25T10:00:00Z",
     "currentSectionIndex": 0,
     "currentQuestionIndex": 0,
     "timeLeft": 3600
   }
   ```
4. Navigate → `/learn/topik/attempt/:attemptId`

---

### **BƯỚC 3: Làm bài thi** 
📍 **Trang:** `/learn/topik/attempt/:attemptId` - [ExamAttempt.tsx](src/pages/Learn/ExamAttempt.tsx)

#### **3.1. Giao diện làm bài**

```
┌─────────────────────────────────────────────┐
│  🎯 TOPIK II 91회 기출                      │
│  PHẦN 1: NGHE HIỂU                  ⏱️ 58:32 │
├─────────────────────────────────────────────┤
│  [Đề bài]    Câu 1-50                       │
├─────────────────────────────────────────────┤
│                                             │
│  [1][2][3][4][5][6][7][8][9][10]           │  ← Palette điều hướng
│  [●][○][●][○][○][○][○][○][○][○]           │     ● = đã làm
│                                             │     ○ = chưa làm
│                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│                                             │
│  🎧 NGHE ĐÁP ÁN                            │
│  [▶️ Phát audio]  (00:00 / 01:23)          │
│                                             │
│  Câu 1. 다음을 듣고 이어질 수 있는 말을      │
│         고르십시오.                          │
│                                             │
│  ○ 1) 네, 괜찮습니다.                       │
│  ● 2) 아니요, 안 바쁩니다.                  │
│  ○ 3) 네, 시간이 없습니다.                  │
│  ○ 4) 아니요, 오늘 안 갑니다.               │
│                                             │
│  [← Câu trước]        [Câu sau →]          │
│  [Nộp bài]                                 │
└─────────────────────────────────────────────┘
```

#### **3.2. Các loại câu hỏi**

**A. MCQ (Multiple Choice)** - Câu trắc nghiệm
```tsx
// Hiển thị 4 lựa chọn A, B, C, D
// Click để chọn, click lại để bỏ chọn
// Lưu ngay khi chọn
```

**B. SHORT (Fill in blank)** - Điền từ
```tsx
// Câu 51-52 trong Writing (mỗi câu 10 điểm)
// Textarea nhỏ, giới hạn 100 ký tự
// Tự động lưu sau 2 giây không gõ
// Backend chấm bằng keyword matching
```

**C. ESSAY (Writing)** - Bài luận
```tsx
// Câu 53: Luận ngắn 200-300 từ (30 điểm) - AI chấm
// Câu 54: Luận dài 600-700 từ (50 điểm) - AI chấm
// Component TopikWritingGrid - Ô viết với số ký tự
// Đếm số ký tự real-time
// Tự động lưu sau 2 giây không gõ
// Hiển thị "Đang lưu..." khi save
```

#### **3.3. Tính năng khi làm bài**

✅ **Auto-save answers**
```typescript
// MCQ → Lưu ngay khi click
handleAnswerSelect(questionId, choiceId)
  → POST /api/user-answers
  
// Text/Essay → Debounce 2s
handleTextAnswerChange(questionId, text)
  → setTimeout 2s
  → POST /api/user-answers
```

✅ **Timer đếm ngược**
```typescript
// Mỗi phần có thời gian riêng
// Hết giờ → Tự động submit → Chuyển phần tiếp
// Lưu timeLeft vào localStorage mỗi 5 giây
```

✅ **Resume từ vị trí cũ**
```typescript
// localStorage lưu:
// - currentSectionIndex (phần đang làm)
// - currentQuestionIndex (câu đang làm)
// - timeLeft (thời gian còn lại)
// - selectedAnswers (câu đã chọn)

// Khi quay lại → Restore tất cả
```

✅ **Audio player (Listening section)**
```tsx
// Phát audio đề bài
// Có nút play/pause, progress bar
// Không bắt buộc phải nghe hết mới làm bài
```

✅ **Question palette**
```tsx
// Danh sách nút 1,2,3...50
// Màu sắc:
//  - Xanh: Đã làm
//  - Trắng: Chưa làm
// Click để nhảy đến câu đó
```

✅ **Navigation**
```tsx
// [← Câu trước] [Câu sau →]
// Group questions (nhóm câu) → Nhảy cả nhóm
// [Nộp bài] → Hiện ở cuối mỗi phần
```

#### **3.4. Cấu trúc dữ liệu**

**State quản lý:**
```typescript
const [attempt, setAttempt] = useState<ExamAttemptResponse | null>(null);
const [sections, setSections] = useState<ExamSectionResponse[]>([]);
const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
const [questions, setQuestions] = useState<QuestionResponse[]>([]);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

// MCQ answers: questionId → choiceId
const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number>>(new Map());

// Text/Essay answers: questionId → text
const [textAnswers, setTextAnswers] = useState<Map<number, string>>(new Map());

// Timer
const [timeLeft, setTimeLeft] = useState(0); // seconds
```

**API calls khi làm bài:**
```typescript
// 1. Load attempt info
GET /api/exam-attempts/:attemptId

// 2. Load sections
GET /api/exam-sections/exam/:examId

// 3. Load questions for current section
GET /api/questions/section/:sectionId

// 4. Load saved answers (nếu resume)
GET /api/user-answers/attempt/:attemptId

// 5. Save answer
POST /api/user-answers
  Body: {
    attemptId: number,
    questionId: number,
    choiceId?: number,      // MCQ
    answerText?: string     // SHORT/ESSAY
  }
```

#### **3.5. Chuyển phần thi**

```typescript
// Khi nhấn "Chuyển phần tiếp"
handleNextSection() {
  // 1. Dừng timer phần hiện tại
  clearInterval(timerRef.current);
  
  // 2. currentSectionIndex++
  setCurrentSectionIndex(currentSectionIndex + 1);
  
  // 3. Reset về câu đầu tiên của phần mới
  setCurrentQuestionIndex(0);
  
  // 4. Load questions phần mới
  fetchQuestionsForSection(sections[newIndex].sectionId);
  
  // 5. Khởi động timer phần mới
  setTimeLeft(sections[newIndex].durationMinutes * 60);
  startTimer();
}

// Lưu ý: KHÔNG THỂ quay lại phần đã làm xong
```

---

### **BƯỚC 4: Nộp bài** 
📍 **Action:** Nhấn nút "Nộp bài" ở phần cuối cùng

```typescript
// Frontend gọi API
handleSubmitExam = async () => {
  // 1. Confirm với user
  if (!confirm('Bạn chắc chắn muốn nộp bài?')) return;
  
  // 2. Call backend
  await examAttemptApi.submitExam(attemptId);
  
  // 3. Clear localStorage
  localStorage.removeItem('topik_in_progress');
  
  // 4. Navigate to result
  navigate(`/learn/topik/result/${attemptId}`);
}
```

**Backend xử lý (tự động):**
```java
// File: ExamAttemptController.java
@PostMapping("/{attemptId}/submit")
public ResponseEntity<ExamAttemptResponse> submitExam(@PathVariable Long attemptId) {
    // 1. Set status = COMPLETED
    // 2. Set completedAt = now()
    // 3. Chấm điểm MCQ/SHORT
    //    - So sánh với đáp án đúng
    //    - Tính điểm từng câu
    //    - Cộng tổng điểm
    // 4. Chấm bài ESSAY (Writing) bằng AI
    //    - Gọi Groq API
    //    - Prompt: Grade TOPIK writing
    //    - Parse điểm Content/Grammar/Vocab/Organization
    // 5. Tính tổng điểm toàn bài
    // 6. Save to database
    // 7. Return ExamAttemptResponse
    
    return ResponseEntity.ok(response);
}
```

**Flow chấm điểm AI (Backend):**
```
1. Filter ESSAY questions (questionType = ESSAY)
   → Thường là Q53, Q54 trong TOPIK II

2. Loop qua từng ESSAY question:
   a. Lấy userAnswer.answerText
   b. Build prompt:
      - Đề bài (questionText + passageText)
      - Bài viết của học sinh
      - Yêu cầu chấm theo 4 tiêu chí
   c. Call Groq API (model: llama-3.3-70b-versatile)
   d. Parse JSON response:
      {
        "content_score": 7.5,
        "grammar_score": 8.0,
        "vocabulary_score": 7.0,
        "organization_score": 8.5,
        "feedback": "...",
        "suggestions": [...]
      }
   e. Tính total_score = sum(4 scores) * (maxPoints / 40)
   f. Save vào database (UserAnswer table)

3. Return full result với AI grading
```

---

### **BƯỚC 5: Xem kết quả** 
📍 **Trang:** `/learn/topik/result/:attemptId` - [TopikExamResult.tsx](src/pages/Learn/TopikExamResult.tsx)

```
┌─────────────────────────────────────────────┐
│  🏆 KẾT QUẢ BÀI THI TOPIK                   │
│  TOPIK II 91회 기출                         │
├─────────────────────────────────────────────┤
│                                             │
│  🎯 TỔNG ĐIỂM                               │
│     185 / 300                               │
│     ⭐ CẤP ĐỘ: TOPIK 4                     │
│                                             │
├─────────────────────────────────────────────┤
│  [Tổng quan] [Nghe] [Viết] [Đọc]           │
├─────────────────────────────────────────────┤
│                                             │
│  📊 CHI TIẾT TỪNG PHẦN:                     │
│                                             │
│  🎧 NGHE HIỂU:  70/100                      │
│  ✅ Đúng: 35/50 câu (35 x 2đ = 70đ)        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━              │
│                                             │
│  ✍️ VIẾT:  60/100                           │
│  • Câu 51 (Điền từ): ✅ 10/10đ             │
│  • Câu 52 (Điền từ): ❌ 0/10đ              │
│  • Câu 53 (Luận ngắn): 🤖 AI: 23/30đ       │
│    Content: 7.5/10                         │
│    Grammar: 8.0/10                         │
│    Vocabulary: 7.0/10                      │
│    Organization: 8.5/10                    │
│    💬 Nhận xét: Bài viết có cấu trúc tốt...│
│    💡 Gợi ý: Nên dùng thêm từ nối...       │
│  • Câu 54 (Luận dài): 🤖 AI: 27/50đ        │
│    (Tương tự, chấm theo 4 tiêu chí)       │
│                                             │
│  📖 ĐỌC HIỂU:  50/100                       │
│  ✅ Đúng: 25/50 câu (25 x 2đ = 50đ)        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━              │
│                                             │
├─────────────────────────────────────────────┤
│  CHI TIẾT TỪNG CÂU:                         │
│                                             │
│  Q1. 다음을 듣고...                         │
│  [▼ Xem chi tiết]                          │
│                                             │
│  ┌─────────────────────────────┐           │
│  │ 🎧 Audio: [▶️ Phát lại]     │           │
│  │                             │           │
│  │ Bạn chọn: ② 아니요...       │           │
│  │ Đáp án đúng: ① 네...        │           │
│  │ ❌ SAI (-2 điểm)            │           │
│  │                             │           │
│  │ 💡 Giải thích: ...          │           │
│  └─────────────────────────────┘           │
│                                             │
│  [Lọc: Chỉ câu sai] [Thu gọn tất cả]      │
│                                             │
├─────────────────────────────────────────────┤
│  [🏠 Về trang chủ] [📝 Thi lại]            │
└─────────────────────────────────────────────┘
```

#### **5.1. Chức năng trang kết quả**

✅ **Tổng điểm & Level**
```typescript
// Tính level dựa trên tổng điểm
const getTopikLevel = (totalScore: number, examType: string) => {
  if (examType === 'TOPIK_II') {
    // TOPIK II: Tổng 300 điểm (Nghe 100 + Viết 100 + Đọc 100)
    if (totalScore >= 230) return { level: "6급", color: "#9C27B0" }; // ≥230/300
    if (totalScore >= 190) return { level: "5급", color: "#673AB7" }; // 190-229
    if (totalScore >= 150) return { level: "4급", color: "#3F51B5" }; // 150-189
    if (totalScore >= 120) return { level: "3급", color: "#2196F3" }; // 120-149
    return { level: "Chưa đạt", color: "#9E9E9E" }; // <120
  } else {
    // TOPIK I: Tổng 200 điểm (Nghe 60 + Đọc 140)
    if (totalScore >= 140) return { level: "2급", color: "#4CAF50" }; // ≥140/200
    if (totalScore >= 80)  return { level: "1급", color: "#8BC34A" }; // 80-139
    return { level: "Chưa đạt", color: "#9E9E9E" }; // <80
  }
}
```

✅ **Breakdown từng phần**
```tsx
// TOPIK II (tổng 300 điểm):
// - Listening: X/100 (Y/50 câu đúng, mỗi câu 2đ)
// - Writing: X/100 (4 câu: 10đ + 10đ + 30đ + 50đ, có AI grading)
// - Reading: X/100 (Y/50 câu đúng, mỗi câu 2đ)

// TOPIK I (tổng 200 điểm):
// - Listening: X/60 (Y/30 câu đúng, mỗi câu 2đ)  
// - Reading: X/140 (Y/40 câu đúng, mỗi câu 2đ)
```

✅ **AI Grading Details (Writing)**
```tsx
// Mỗi câu ESSAY hiển thị:
// - 4 điểm thành phần (Content/Grammar/Vocab/Org)
// - Tổng điểm: X/30
// - Feedback chi tiết
// - Suggestions cải thiện
// - UI: Purple gradient card đẹp
```

✅ **Chi tiết từng câu**
```tsx
// Tabs: [Nghe] [Viết] [Đọc]
// Mỗi câu:
//  - Đề bài
//  - Đáp án của bạn
//  - Đáp án đúng
//  - Trạng thái: ✅ Đúng / ❌ Sai
//  - [Xem giải thích] (collapsible)

// Nút lọc:
//  - [Chỉ câu sai] → Filter isCorrect = false
//  - [Thu gọn tất cả] / [Mở rộng tất cả]
```

✅ **Actions**
```tsx
// [🏠 Về trang chủ] → /learn/topik
// [📝 Thi lại] → Tạo attempt mới, redirect /attempt/:newId
```

**API call:**
```typescript
GET /api/exam-attempts/:attemptId/result
  Response: {
    attemptId: number,
    examTitle: string,
    examType: "TOPIK_I" | "TOPIK_II",
    totalScore: number,
    completedAt: string,
    sectionResults: [
      {
        sectionType: "LISTENING",
        sectionScore: 75,
        maxScore: 100,
        correctAnswers: 35,
        totalQuestions: 50
      },
      {
        sectionType: "WRITING",
        sectionScore: 55,
        maxScore: 100,
        correctAnswers: 1,
        totalQuestions: 4
      },
      ...
    ],
    questions: [
      {
        questionId: 1,
        questionNumber: 1,
        questionType: "MCQ",
        questionText: "...",
        sectionType: "LISTENING",
        userAnswer: "②",
        correctAnswer: "①",
        isCorrect: false,
        pointsEarned: 0,
        maxPoints: 2,
        // AI grading (nếu là ESSAY)
        aiGrading?: {
          contentScore: 7.5,
          grammarScore: 8.0,
          vocabularyScore: 7.0,
          organizationScore: 8.5,
          totalScore: 23.0,
          feedback: "...",
          suggestions: [...]
        }
      },
      ...
    ]
  }
```

---

## 🔄 FLOW DIAGRAM TỔNG QUÁT

```
┌─────────────────┐
│  1. Danh sách   │  GET /api/exams/active
│   đề thi        │
└────────┬────────┘
         │ Click "Xem chi tiết"
         ↓
┌─────────────────┐
│  2. Chi tiết    │  GET /api/exams/:examId
│   đề thi        │  GET /api/exam-sections/exam/:examId
└────────┬────────┘
         │ Click "Bắt đầu"
         ↓
         POST /api/exam-attempts/start
         → Create ExamAttempt (status = IN_PROGRESS)
         ↓
┌─────────────────┐
│  3. Làm bài     │  GET /api/questions/section/:sectionId
│   (ExamAttempt) │  POST /api/user-answers (save mỗi câu)
└────────┬────────┘
         │ Loop: Phần 1 → Phần 2 → Phần 3
         │ (mỗi phần có timer riêng)
         ↓
         Nhấn "Nộp bài"
         ↓
         POST /api/exam-attempts/:attemptId/submit
         Backend:
         1. Chấm MCQ/SHORT
         2. Chấm ESSAY bằng AI (Groq API)
         3. Tính tổng điểm
         4. Set status = COMPLETED
         ↓
┌─────────────────┐
│  4. Kết quả     │  GET /api/exam-attempts/:attemptId/result
│   chi tiết      │  → Hiển thị điểm, AI grading, chi tiết câu
└─────────────────┘
```

---

## 💾 DATABASE & LOCAL STORAGE

### **Backend Database (MySQL)**

**Bảng `exam_attempt`:**
```sql
- attemptId (PK)
- examId (FK)
- userId (FK)
- status (IN_PROGRESS / COMPLETED / ABANDONED)
- totalScore (tổng điểm)
- startedAt (timestamp)
- completedAt (timestamp)
```

**Bảng `user_answer`:**
```sql
- answerId (PK)
- attemptId (FK)
- questionId (FK)
- choiceId (FK, nullable) -- MCQ answer
- answerText (TEXT, nullable) -- SHORT/ESSAY answer
- isCorrect (boolean)
- pointsEarned (decimal)
- aiGradingJson (JSON, nullable) -- AI grading result
```

### **Frontend LocalStorage**

**Key: `topik_in_progress`**
```json
{
  "attemptId": "123",
  "examTitle": "TOPIK II 91회 기출",
  "startedAt": "2025-12-25T10:00:00Z",
  "currentSectionIndex": 1,      // Đang làm phần 2
  "currentQuestionIndex": 15,    // Đang ở câu 16
  "timeLeft": 1823               // 30 phút 23 giây còn lại
}
```

**Xóa khi:**
- Nộp bài thành công
- Hết giờ (auto-submit)

---

## 🎯 TÍNH NĂNG ĐẶC BIỆT

### ✨ **1. Resume bài thi**
```
User làm dở → Đóng trình duyệt
→ Quay lại → Hiện banner "Bài thi đang làm dở"
→ Click "Tiếp tục" → Resume đúng vị trí
```

### ✨ **2. Auto-save**
```
MCQ: Save ngay khi click
Text/Essay: Debounce 2s → Save tự động
→ Không lo mất dữ liệu
```

### ✨ **3. AI Grading (Writing)**
```
Backend call Groq API (llama-3.3-70b-versatile)
→ Chấm bài ESSAY theo 4 tiêu chí
→ Trả về điểm chi tiết + feedback + suggestions
→ Frontend hiển thị UI đẹp
```

### ✨ **4. Question Palette**
```
Grid buttons 1-2-3...50
Màu xanh: Đã làm
Màu trắng: Chưa làm
Click để nhảy nhanh đến câu
```

### ✨ **5. Timer & Auto-submit**
```
Mỗi phần có timer riêng
Hết giờ → Auto submit → Chuyển phần
Hoặc hết bài → Auto submit toàn bộ
```

---

## 🔐 SECURITY & VALIDATION

✅ **Authentication:**
- Phải đăng nhập mới thi
- JWT token trong API header

✅ **Validation:**
- Backend check `attemptId` thuộc về `userId`
- Không cho submit bài của người khác
- Check `status = IN_PROGRESS` trước khi submit

✅ **Rate Limiting:**
- Limit số lần thi mỗi ngày (nếu cần)

---

## 📱 RESPONSIVE DESIGN

✅ Desktop: Giao diện đầy đủ
✅ Tablet: Layout 2 cột → 1 cột
✅ Mobile: 
  - Question palette → Bottom drawer
  - Timer → Sticky top
  - Writing grid → Vertical scroll

---

## 🚀 PERFORMANCE

✅ **Lazy Loading:**
```typescript
// Chỉ load questions của section hiện tại
// Không load hết 104 câu cùng lúc
```

✅ **Debounce Save:**
```typescript
// Text answer: Chờ 2s mới save
// Tránh spam API khi user đang gõ
```

✅ **LocalStorage Cache:**
```typescript
// Cache attempt info, timeLeft
// Giảm API calls khi refresh
```

---

## 🎨 UI/UX HIGHLIGHTS

- 🎨 **Color scheme:** Orange (#FF6B35) primary, Purple cho TOPIK II, Blue cho TOPIK I
- ✨ **Smooth transitions:** Fade in/out, slide animations
- 🎯 **Clear visual feedback:** 
  - Đáp án đã chọn: Border xanh
  - Đang lưu: Loading spinner
  - AI grading: Purple gradient card
- 📱 **Mobile-friendly:** Touch-optimized buttons, swipe gestures
- ♿ **Accessibility:** ARIA labels, keyboard navigation support

---

## 🔧 TECH STACK

### **Frontend:**
- ⚛️ React + TypeScript
- 🎨 TailwindCSS (custom colors)
- 🗺️ React Router (navigation)
- 🔄 Axios (API calls)
- 💾 LocalStorage (state persistence)

### **Backend:**
- ☕ Spring Boot (Java)
- 🗄️ MySQL (database)
- 🔐 JWT (authentication)
- 🤖 Groq API (AI grading)
- 🔧 JPA/Hibernate (ORM)

---

## 📝 KẾT LUẬN

Luồng thi TOPIK trên KTigerStudy được thiết kế **hoàn chỉnh** và **user-friendly**:

1. ✅ **Chọn đề** → Chi tiết đầy đủ
2. ✅ **Bắt đầu** → Tạo attempt, lưu localStorage
3. ✅ **Làm bài** → Auto-save, timer, resume được
4. ✅ **Nộp bài** → Backend chấm tự động (MCQ + AI Essay)
5. ✅ **Xem kết quả** → Chi tiết, AI feedback, UI đẹp

**Điểm mạnh:**
- 🚀 Tự động chấm điểm (kể cả bài viết)
- 💾 Không lo mất dữ liệu (auto-save + localStorage)
- 🎯 Feedback chi tiết (AI grading cho Writing)
- 📱 Responsive, hoạt động tốt mọi thiết bị

**Phù hợp cho:**
- 🎓 Học sinh luyện thi TOPIK
- 🏫 Trung tâm tiếng Hàn tổ chức thi thử
- 📊 Theo dõi tiến độ học tập qua thống kê

---

🎉 **Chúc bạn thành công với hệ thống thi TOPIK của KTigerStudy!**
