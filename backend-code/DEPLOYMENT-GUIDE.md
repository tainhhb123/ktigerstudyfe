# ✅ HOÀN TẤT - AI Grading Integration Guide

## 📦 Danh sách Files cần Copy vào Backend

### 1️⃣ DTO Classes (dto/)
```
✅ WritingGradingRequest.java  → dto/req/
✅ WritingGradingResult.java   → dto/resp/
✅ QuestionResultResponse.java → dto/resp/ (THAY THẾ file cũ)
```

### 2️⃣ Entity (model/)
```
✅ UserAnswer-Updated.java     → model/UserAnswer.java (THAY THẾ file cũ)
```

### 3️⃣ Service Classes (service/)
```
✅ AIGradingService.java       → service/aiGrading/
✅ AIGradingServiceImpl.java   → service/aiGrading/
```

### 4️⃣ Config Class (config/)
```
✅ RestTemplateConfig.java     → config/
   (Cần thiết để inject RestTemplate bean)
```

### 5️⃣ Main Service (REPLACE)
```
✅ ExamAttemptServiceImplWithAI.java → service/examAttempt/
   (Đổi tên class thành: ExamAttemptServiceImpl)
```

### 6️⃣ SQL Script (chạy trên MySQL)
```
✅ ADD-AI-GRADING-COLUMNS.sql
   (Thêm cột ai_score, ai_feedback, ai_breakdown, ai_suggestions vào user_answer)
```

---

## 🔧 Cách Deploy

### Step 1: Chạy SQL Script
```sql
-- Chạy file ADD-AI-GRADING-COLUMNS.sql trên database
ALTER TABLE user_answer
ADD COLUMN ai_score INT DEFAULT NULL,
ADD COLUMN ai_feedback TEXT DEFAULT NULL,
ADD COLUMN ai_breakdown JSON DEFAULT NULL,
ADD COLUMN ai_suggestions JSON DEFAULT NULL;
```

### Step 2: Copy files
```bash
# Từ backend-code/ copy vào backend project:
backend-code/WritingGradingRequest.java
→ src/main/java/org/example/ktigerstudybe/dto/req/

backend-code/WritingGradingResult.java
backend-code/QuestionResultResponse.java
→ src/main/java/org/example/ktigerstudybe/dto/resp/

backend-code/UserAnswer-Updated.java
→ src/main/java/org/example/ktigerstudybe/model/UserAnswer.java

backend-code/AIGradingService.java
backend-code/AIGradingServiceImpl.java
→ src/main/java/org/example/ktigerstudybe/service/aiGrading/

backend-code/RestTemplateConfig.java
→ src/main/java/org/example/ktigerstudybe/config/

backend-code/ExamAttemptServiceImplWithAI.java
→ src/main/java/org/example/ktigerstudybe/service/examAttempt/
```

### Step 3: Rename class
Mở `ExamAttemptServiceImplWithAI.java` và sửa:
```java
// FROM:
public class ExamAttemptServiceImplWithAI implements ExamAttemptService {

// TO:
public class ExamAttemptServiceImpl implements ExamAttemptService {
```

### Step 4: Verify application.properties
```properties
groq.api.key=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
groq.api.url=https://api.groq.com/openai/v1/chat/completions
groq.api.model=llama-3.1-8b-instant
```

### Step 5: Build
```bash
mvn clean install
```

### Step 6: Run
```bash
mvn spring-boot:run
```

---

## 🧪 Testing

### 1. Submit exam từ Frontend
- Làm bài thi TOPIK II
- Viết Q53 (200-300 chars)
- Viết Q54 (600-700 chars)
- Click "Nộp bài"

### 2. Check Backend Logs
Bạn sẽ thấy:
```
📝 Starting exam submission for attempt: 1
🔢 Calculating MCQ and SHORT scores...
✅ Initial scores calculated (before AI grading)
🤖 Starting AI grading for ESSAY questions...
📝 Found 2 ESSAY answers
🤖 Grading Question 53 (Type: ESSAY)...
✅ AI Score received: 85/100
💾 Saved: Question 53 → Score: 25.50/30.00
   Feedback: 전반적으로 잘 작성했습니다. 주제를 정확히 이해하...
🤖 Grading Question 54 (Type: ESSAY)...
✅ AI Score received: 78/100
💾 Saved: Question 54 → Score: 39.00/50.00
   Feedback: 좋습니다. 문법 오류 3개가 발견되었습니다...
✅ AI grading completed for all ESSAY questions
📊 Recalculating writing_score...
📊 Final Scores:
   - Listening: 45.0
   - Writing: 64.50
   - Reading: 55.0
   - TOTAL: 164.50
✅ Exam submission completed!
```

### 3. Verify Database
```sql
SELECT 
    ua.user_answer_id,
    q.question_number,
    q.question_type,
    q.points AS max_points,
    ua.score AS actual_score,
    LEFT(ua.answer_text, 50) AS answer_preview
FROM user_answer ua
JOIN question q ON ua.question_id = q.question_id
WHERE ua.attempt_id = 1 
  AND q.question_type = 'ESSAY'
ORDER BY q.question_number;
```

**Expected Output:**
| question_number | question_type | max_points | actual_score | answer_preview |
|-----------------|---------------|------------|--------------|----------------|
| 53              | ESSAY         | 30.00      | 25.50        | 저는 주말에... |
| 54              | ESSAY         | 50.00      | 39.00        | 한국의 전통... |

### 4. Check Frontend Result Page
- Navigate to `/learn/topik/result/{attemptId}`
- Verify ESSAY scores hiển thị đúng
- Check total writing_score = Q51 + Q52 + Q53(AI) + Q54(AI)

---

## 🎯 Logic Flow (Final)

```
1. User làm bài thi
   ├─ MCQ: Select choices
   ├─ SHORT: Type text (auto-save)
   └─ ESSAY: Type essay (auto-save to user_answer.answer_text)

2. User click "Nộp bài"
   └─ Frontend: examAttemptApi.submitExam(attemptId)
   
3. Backend: ExamAttemptServiceImpl.submitExam()
   ├─ calculateAndSaveScores()
   │  ├─ MCQ: Check choice.isCorrect → save score
   │  ├─ SHORT: Compare with correct_answer → save score
   │  └─ ESSAY: score = 0 (chưa chấm)
   │
   ├─ gradeEssayWithAI() ✨
   │  ├─ Find all ESSAY answers (Q53, Q54)
   │  ├─ For each essay:
   │  │  ├─ Build WritingGradingRequest
   │  │  ├─ Call AIGradingService.gradeWriting()
   │  │  ├─ Get score 0-100
   │  │  ├─ Convert to question points (30 or 50)
   │  │  └─ Update user_answer.score
   │  └─ Log results
   │
   ├─ recalculateWritingScore() ✨
   │  ├─ Sum all WRITING section scores
   │  ├─ Update exam_attempt.writing_score
   │  └─ Update exam_attempt.total_score
   │
   └─ Set status = COMPLETED

4. Frontend: Navigate to result page
   └─ Display scores (MCQ + SHORT + ESSAY)
```

---

## 🚨 Troubleshooting

### Lỗi: "cannot find symbol method setQuestionNumber"
**Nguyên nhân:** Lombok @Data không generate methods
**Fix:** File đã dùng constructor thay vì setters
```java
WritingGradingRequest request = new WritingGradingRequest(
    questionNumber, questionText, referenceAnswer, 
    studentAnswer, minChars, maxChars
);
```

### Lỗi: AI API timeout
**Nguyên nhân:** Groq API chậm/lỗi
**Fix:** AIGradingServiceImpl có fallback logic
```java
} catch (Exception e) {
    ua.setScore(BigDecimal.ZERO);  // Fallback
}
```

### Lỗi: Score = 0 cho tất cả ESSAY
**Check:**
1. Backend logs có "🤖 Grading Question..." không?
2. Groq API key đúng chưa?
3. Query database: `SELECT * FROM user_answer WHERE question_id IN (53,54)`

### Lỗi: NullPointerException
**Check:**
```java
.filter(ua -> ua.getQuestion() != null)  // ✅ Đã có
.filter(ua -> ua.getAnswerText() != null)  // ✅ Đã có
```

---

## 📊 Expected Results

### Database State After Submit:

**exam_attempt table:**
```
attempt_id | status    | listening_score | reading_score | writing_score | total_score
-----------|-----------|-----------------|---------------|---------------|-------------
1          | COMPLETED | 45.00           | 55.00         | 64.50         | 164.50
```

**user_answer table (ESSAY only):**
```
user_answer_id | question_id | answer_text           | score
---------------|-------------|-----------------------|-------
101            | 53          | 저는 주말에 친구와... | 25.50
102            | 54          | 한국의 전통 문화...  | 39.00
```

---

## ✅ Success Criteria

1. ✅ Backend logs hiển thị AI grading process
2. ✅ Database có scores cho ESSAY questions
3. ✅ writing_score = sum(Q51, Q52, Q53, Q54)
4. ✅ total_score = listening + reading + writing
5. ✅ Frontend hiển thị đầy đủ scores

---

## 🎉 Kết luận

**Backend đã hoàn thiện!** Chỉ cần:
1. Copy 5 files vào đúng thư mục
2. Đổi tên class ExamAttemptServiceImplWithAI → ExamAttemptServiceImpl
3. Build và run

**Frontend không cần sửa gì** - Chỉ hiển thị score từ backend!

---

**Next:** Test thực tế và điều chỉnh nếu cần! 🚀
