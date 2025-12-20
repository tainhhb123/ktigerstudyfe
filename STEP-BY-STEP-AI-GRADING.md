# 🎯 HƯỚNG DẪN TỪNG BƯỚC: AI Chấm Điểm Writing

## 📊 Phân tích Database Structure

### 1. Các bảng liên quan:

```sql
exam
  ├── exam_id (PK)
  ├── title
  ├── exam_type (TOPIK_I | TOPIK_II)
  ├── total_question
  └── duration_minutes

exam_section
  ├── section_id (PK)
  ├── exam_id (FK → exam)
  ├── section_type (LISTENING | WRITING | READING)
  ├── section_order
  └── total_questions

question
  ├── question_id (PK)
  ├── section_id (FK → exam_section)
  ├── question_number (51, 52, 53, 54)
  ├── question_type (MCQ | SHORT | ESSAY)  ← Q53, Q54 = ESSAY
  ├── question_text
  ├── passage_text (chủ đề, yêu cầu)
  ├── image_url (Q53 có chart/graph)
  ├── correct_answer (reference answer cho AI - có thể NULL)
  └── points (Q53=30, Q54=50)

exam_attempt
  ├── attempt_id (PK)
  ├── exam_id (FK → exam)
  ├── user_id (FK → user)
  ├── start_time
  ├── end_time
  ├── status (IN_PROGRESS | COMPLETED)
  ├── total_score
  ├── listening_score
  ├── reading_score
  └── writing_score  ← Tổng điểm Writing (bao gồm AI grading)

user_answer
  ├── user_answer_id (PK)
  ├── attempt_id (FK → exam_attempt)
  ├── question_id (FK → question)
  ├── choice_id (FK → answer_choice) - NULL cho ESSAY
  ├── answer_text  ← Bài viết của học sinh (Q53, Q54)
  └── score  ← Điểm AI sẽ update vào đây
```

### 2. Data Writing Section hiện tại:

```sql
-- Section 2 = WRITING
section_id: 2
exam_id: 3 (TOPIK II 91회)

Questions:
- Q51, Q52: SHORT type (điền từ) ✅ Đã có
- Q53: ESSAY (200-300 ký tự) ⚠️ Cần thêm
- Q54: ESSAY (600-700 ký tự) ⚠️ Cần thêm
```

---

## 🚀 BƯỚC 1: Setup Database cho Q53 & Q54

### 1.1. Chạy SQL Insert

```bash
# File: backend-code/INSERT-WRITING-QUESTIONS-51-54.sql
mysql -u root -p ktigerstudydb < backend-code/INSERT-WRITING-QUESTIONS-51-54.sql
```

Hoặc copy từ file và run trực tiếp trong phpMyAdmin/MySQL Workbench.

### 1.2. Verify data

```sql
SELECT 
    q.question_id,
    q.question_number,
    q.question_type,
    q.question_text,
    q.points,
    q.image_url
FROM question q
WHERE q.section_id = 2
  AND q.question_type = 'ESSAY'
ORDER BY q.question_number;
```

**Expected:**
| question_id | question_number | question_type | points |
|-------------|-----------------|---------------|--------|
| 53          | 53              | ESSAY         | 30.00  |
| 54          | 54              | ESSAY         | 50.00  |

---

## 🔧 BƯỚC 2: Add Backend AI Grading Code

### 2.1. Tạo DTO Classes

#### File: `dto/req/WritingGradingRequest.java`
```java
package org.example.ktigerstudybe.dto.req;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingGradingRequest {
    private Integer questionNumber;    // 53 or 54
    private String questionText;       // Yêu cầu đề bài
    private String referenceAnswer;    // Câu trả lời mẫu (có thể NULL)
    private String studentAnswer;      // Bài viết của học sinh
    private Integer minChars;          // 200 or 600
    private Integer maxChars;          // 300 or 700
}
```

#### File: `dto/resp/WritingGradingResult.java`
```java
package org.example.ktigerstudybe.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingGradingResult {
    private Integer score;        // 0-100
    private String feedback;      // Nhận xét tổng quan
    private Breakdown breakdown;  // Chi tiết điểm
    private List<String> suggestions; // Gợi ý cải thiện

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Breakdown {
        private Integer content;      // 0-40
        private Integer grammar;      // 0-30
        private Integer vocabulary;   // 0-20
        private Integer organization; // 0-10
    }
}
```

### 2.2. Tạo AI Grading Service

Copy 2 files:
- `backend-code/AIGradingService.java` → `service/aiGrading/`
- `backend-code/AIGradingServiceImpl.java` → `service/aiGrading/`

### 2.3. Tạo Controller

Copy file:
- `backend-code/AIGradingController.java` → `controller/`

### 2.4. Config RestTemplate

Create file: `config/RestTemplateConfig.java`

```java
package org.example.ktigerstudybe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

### 2.5. Add Groq API Key

File: `application.properties`

```properties
# Groq AI Configuration
groq.api.key=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Lấy API Key:**
1. https://console.groq.com/
2. Sign up (FREE)
3. Go to Keys → Create API Key
4. Copy và paste vào config

---

## 🔄 BƯỚC 3: Tích hợp AI Grading vào ExamAttemptService

### 3.1. Update ExamAttemptServiceImpl.java

Thêm dependency injection:

```java
@Service
public class ExamAttemptServiceImpl implements ExamAttemptService {
    
    @Autowired
    private ExamAttemptRepository examAttemptRepository;
    
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private AIGradingService aiGradingService;  // ← NEW
    
    // ... existing methods ...
}
```

### 3.2. Update submitExam() method

```java
@Override
@Transactional
public ExamAttemptResponse submitExam(Long attemptId) {
    ExamAttempt attempt = examAttemptRepository.findById(attemptId)
            .orElseThrow(() -> new IllegalArgumentException("Attempt not found"));

    if (attempt.getStatus() == ExamAttemptStatus.COMPLETED) {
        throw new IllegalStateException("Exam already submitted");
    }

    // 1. Tính điểm MCQ & SHORT (giữ nguyên logic cũ)
    calculateAndSaveScores(attempt);
    
    // 2. ⭐ NEW: Chấm điểm ESSAY với AI
    gradeEssayQuestions(attempt);

    attempt.setEndTime(LocalDateTime.now());
    attempt.setStatus(ExamAttemptStatus.COMPLETED);

    attempt = examAttemptRepository.save(attempt);
    return toResponse(attempt);
}
```

### 3.3. Thêm method gradeEssayQuestions()

```java
/**
 * Chấm điểm ESSAY questions (Q53, Q54) bằng AI
 */
private void gradeEssayQuestions(ExamAttempt attempt) {
    // Lấy tất cả câu ESSAY từ WRITING section
    List<UserAnswer> essayAnswers = userAnswerRepository
            .findByAttempt_AttemptId(attempt.getAttemptId())
            .stream()
            .filter(ua -> {
                Question q = ua.getQuestion();
                return q.getQuestionType() == QuestionType.ESSAY 
                    && q.getSection().getSectionType() == SectionType.WRITING;
            })
            .collect(Collectors.toList());
    
    System.out.println("📝 Found " + essayAnswers.size() + " essay questions to grade");
    
    BigDecimal totalEssayScore = BigDecimal.ZERO;
    
    for (UserAnswer answer : essayAnswers) {
        Question question = answer.getQuestion();
        
        // Skip nếu không có bài làm
        if (answer.getAnswerText() == null || answer.getAnswerText().trim().isEmpty()) {
            System.out.println("⚠️  Q" + question.getQuestionNumber() + ": No answer");
            answer.setScore(BigDecimal.ZERO);
            userAnswerRepository.save(answer);
            continue;
        }
        
        try {
            // Build request
            WritingGradingRequest request = new WritingGradingRequest();
            request.setQuestionNumber(question.getQuestionNumber());
            request.setQuestionText(question.getQuestionText());
            request.setReferenceAnswer(question.getCorrectAnswer()); // có thể NULL
            request.setStudentAnswer(answer.getAnswerText());
            
            // Set min/max chars theo câu hỏi
            if (question.getQuestionNumber() == 53) {
                request.setMinChars(200);
                request.setMaxChars(300);
            } else if (question.getQuestionNumber() == 54) {
                request.setMinChars(600);
                request.setMaxChars(700);
            }
            
            System.out.println("🤖 Grading Q" + question.getQuestionNumber() + " with AI...");
            
            // Call AI Grading
            WritingGradingResult result = aiGradingService.gradeWriting(request);
            
            System.out.println("✅ AI Score: " + result.getScore() + "/100");
            System.out.println("📊 Breakdown: Content=" + result.getBreakdown().getContent() 
                    + ", Grammar=" + result.getBreakdown().getGrammar()
                    + ", Vocab=" + result.getBreakdown().getVocabulary()
                    + ", Org=" + result.getBreakdown().getOrganization());
            
            // Convert AI score (0-100) to points (based on question.points)
            BigDecimal aiScore = new BigDecimal(result.getScore());
            BigDecimal maxPoints = question.getPoints(); // 30 or 50
            BigDecimal earnedPoints = aiScore
                    .multiply(maxPoints)
                    .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
            
            System.out.println("💯 Converted to points: " + earnedPoints + "/" + maxPoints);
            
            // Save score to user_answer
            answer.setScore(earnedPoints);
            userAnswerRepository.save(answer);
            
            totalEssayScore = totalEssayScore.add(earnedPoints);
            
            // TODO: Lưu AI feedback vào bảng riêng để teacher review
            
        } catch (Exception e) {
            System.err.println("❌ Failed to grade Q" + question.getQuestionNumber() + ": " + e.getMessage());
            e.printStackTrace();
            // Keep score = 0 if AI fails
            answer.setScore(BigDecimal.ZERO);
            userAnswerRepository.save(answer);
        }
    }
    
    // Update writing_score trong exam_attempt
    BigDecimal currentWritingScore = attempt.getWritingScore() != null 
            ? attempt.getWritingScore() 
            : BigDecimal.ZERO;
    attempt.setWritingScore(currentWritingScore.add(totalEssayScore));
    
    // Update total_score
    BigDecimal totalScore = BigDecimal.ZERO;
    if (attempt.getListeningScore() != null) totalScore = totalScore.add(attempt.getListeningScore());
    if (attempt.getReadingScore() != null) totalScore = totalScore.add(attempt.getReadingScore());
    if (attempt.getWritingScore() != null) totalScore = totalScore.add(attempt.getWritingScore());
    attempt.setTotalScore(totalScore);
    
    System.out.println("📈 Total Essay Score: " + totalEssayScore);
    System.out.println("📈 Total Writing Score: " + attempt.getWritingScore());
    System.out.println("🎯 Total Exam Score: " + attempt.getTotalScore());
}
```

---

## 🎨 BƯỚC 4: Frontend Display (Đã có sẵn ✅)

Frontend đã được setup ở các file:
- ✅ `src/services/aiGradingService.ts` - Gọi backend API
- ✅ `src/pages/Learn/TopikExamResult.tsx` - Hiển thị kết quả AI grading
- ✅ `src/types/exam.ts` - Types definition

**Không cần thay đổi gì ở frontend!**

---

## 🧪 BƯỚC 5: Testing

### 5.1. Test Flow hoàn chỉnh

```
1. Student vào /learn/topik
2. Chọn exam → Start
3. Làm bài (đặc biệt Q53 & Q54)
4. Submit exam
   → Backend:
      a. Chấm MCQ/SHORT
      b. Gọi Groq AI chấm ESSAY
      c. Lưu score vào DB
5. Frontend redirect → /learn/topik/result/:attemptId
6. Frontend hiển thị:
   - Điểm tổng
   - Điểm từng section
   - Chi tiết từng câu
   - ⭐ AI grading cho Q53, Q54 (breakdown + feedback)
```

### 5.2. Test Cases

#### Test 1: Bài viết đạt yêu cầu
```
Q53: Viết 250 ký tự (trong khoảng 200-300)
Expected: Điểm ≥ 21/30 (≥ 70%)
```

#### Test 2: Bài viết thiếu số ký tự
```
Q53: Viết 150 ký tự (< 200)
Expected: Điểm = 0, feedback "không đạt yêu cầu số ký tự"
```

#### Test 3: Không làm bài
```
Q53: Bỏ trống (answer_text = NULL)
Expected: Điểm = 0, skip AI grading
```

#### Test 4: Backend logs
```
Kiểm tra console logs:
📝 Found 2 essay questions to grade
🤖 Grading Q53 with AI...
✅ AI Score: 75/100
📊 Breakdown: Content=30, Grammar=22, Vocab=17, Org=6
💯 Converted to points: 22.50/30
🤖 Grading Q54 with AI...
✅ AI Score: 68/100
📊 Breakdown: Content=27, Grammar=20, Vocab=14, Org=7
💯 Converted to points: 34.00/50
📈 Total Essay Score: 56.50
```

---

## 📊 BƯỚC 6: Verify Results

### 6.1. Check Database

```sql
-- Xem điểm AI đã lưu vào user_answer
SELECT 
    ua.user_answer_id,
    q.question_number,
    q.question_type,
    LEFT(ua.answer_text, 50) as answer_preview,
    ua.score,
    q.points as max_points
FROM user_answer ua
JOIN question q ON ua.question_id = q.question_id
WHERE ua.attempt_id = 33  -- Thay bằng attempt_id của bạn
  AND q.question_type = 'ESSAY'
ORDER BY q.question_number;
```

Expected:
| question_number | score | max_points |
|-----------------|-------|------------|
| 53              | 22.50 | 30.00      |
| 54              | 34.00 | 50.00      |

### 6.2. Check exam_attempt

```sql
SELECT 
    attempt_id,
    status,
    listening_score,
    reading_score,
    writing_score,
    total_score
FROM exam_attempt
WHERE attempt_id = 33;
```

Expected:
- `writing_score` = điểm Q51 + Q52 + Q53 + Q54
- `total_score` = listening + reading + writing

---

## 🔍 BƯỚC 7: Troubleshooting

### Lỗi 1: "Groq API Key not found"
```properties
# application.properties
groq.api.key=gsk_xxx  ← Kiểm tra key này
```

### Lỗi 2: "Failed to parse AI response"
```java
// AIGradingServiceImpl.java
// Check console logs để xem raw response từ Groq
System.out.println("Raw AI Response: " + content);
```

### Lỗi 3: AI chấm điểm = 0 cho tất cả bài
- Kiểm tra prompt có đúng không
- Kiểm tra model có hỗ trợ tiếng Hàn không
- Thử tăng temperature (0.3 → 0.5)

### Lỗi 4: Frontend không hiển thị AI grading
```typescript
// TopikExamResult.tsx
console.log('Writing grades:', writingGrades);
console.log('Essay questions:', essayQuestions);
```

---

## ✅ Checklist Hoàn thành

- [ ] **Step 1:** Database setup (INSERT Q53, Q54)
- [ ] **Step 2:** Backend code (5 files Java + config)
- [ ] **Step 3:** Groq API key configuration
- [ ] **Step 4:** Update ExamAttemptServiceImpl
- [ ] **Step 5:** Test student submit exam
- [ ] **Step 6:** Verify AI grading works
- [ ] **Step 7:** Check frontend display
- [ ] **Step 8:** Monitor backend logs

---

## 📚 Next Steps (Optional)

### 1. Save AI Feedback to DB

Tạo bảng mới để lưu feedback chi tiết:

```sql
CREATE TABLE ai_grading_result (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_answer_id BIGINT NOT NULL,
    ai_score INT NOT NULL,
    content_score INT,
    grammar_score INT,
    vocabulary_score INT,
    organization_score INT,
    feedback TEXT,
    suggestions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_answer_id) REFERENCES user_answer(user_answer_id)
);
```

### 2. Teacher Review Interface
- Cho phép teacher xem AI feedback
- Override điểm AI nếu cần
- Track accuracy: AI vs Teacher scores

### 3. Improve Prompts
- A/B testing different prompts
- Add more examples to system prompt
- Fine-tune based on teacher feedback

---

## 🎉 Kết luận

Sau khi hoàn thành các bước trên:

✅ Student làm bài TOPIK → AI tự động chấm Q53, Q54
✅ Frontend hiển thị điểm + feedback chi tiết
✅ Backend logs để debug
✅ Secure: API key ở backend, không expose

**Total time:** ~2-3 hours (bao gồm testing)
