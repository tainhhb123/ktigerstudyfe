# 🔧 Fix: Backend Mapper thiếu trường correctAnswer

## ❌ Vấn đề
Backend mapper `toResponse(Question q)` **KHÔNG** trả về trường `correctAnswer` trong `QuestionResponse`, dẫn đến:
- FE nhận `correctAnswer = null/undefined`
- Form edit câu hỏi SHORT/ESSAY không hiển thị đáp án mẫu

## ✅ Giải pháp

### 1. Sửa file Backend Mapper (QuestionServiceImpl.java hoặc tương tự)

**TÌM đoạn code:**
```java
private QuestionResponse toResponse(Question q) {
    QuestionResponse resp = new QuestionResponse();

    resp.setQuestionId(q.getQuestionId());
    resp.setSectionId(q.getSection().getSectionId());
    resp.setGroupId(q.getGroupId());
    resp.setQuestionNumber(q.getQuestionNumber());
    resp.setQuestionType(q.getQuestionType());
    resp.setQuestionText(q.getQuestionText());
    resp.setPassageText(q.getPassageText());
    resp.setAudioUrl(q.getAudioUrl());
    resp.setImageUrl(q.getImageUrl());
    resp.setPoints(q.getPoints());

    // Map choices
    List<AnswerChoice> choices = answerChoiceRepository.findByQuestionId(q.getQuestionId());
    resp.setChoices(
            choices.stream()
                    .map(this::toAnswerChoiceResponse)
                    .collect(Collectors.toList())
    );

    return resp;
}
```

**THÊM dòng này sau `resp.setPoints(q.getPoints());`:**
```java
private QuestionResponse toResponse(Question q) {
    QuestionResponse resp = new QuestionResponse();

    resp.setQuestionId(q.getQuestionId());
    resp.setSectionId(q.getSection().getSectionId());
    resp.setGroupId(q.getGroupId());
    resp.setQuestionNumber(q.getQuestionNumber());
    resp.setQuestionType(q.getQuestionType());
    resp.setQuestionText(q.getQuestionText());
    resp.setPassageText(q.getPassageText());
    resp.setAudioUrl(q.getAudioUrl());
    resp.setImageUrl(q.getImageUrl());
    resp.setPoints(q.getPoints());
    resp.setCorrectAnswer(q.getCorrectAnswer());  // ✅ THÊM DÒNG NÀY

    // Map choices
    List<AnswerChoice> choices = answerChoiceRepository.findByQuestionId(q.getQuestionId());
    resp.setChoices(
            choices.stream()
                    .map(this::toAnswerChoiceResponse)
                    .collect(Collectors.toList())
    );

    return resp;
}
```

### 2. Kiểm tra QuestionResponse.java có field correctAnswer chưa

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    private Long questionId;
    private Long sectionId;
    private Long groupId;
    private Integer questionNumber;
    private String questionType;
    private String questionText;
    private String passageText;
    private String audioUrl;
    private String imageUrl;
    private String correctAnswer;  // ✅ PHẢI CÓ DÒNG NÀY
    private BigDecimal points;
    private List<AnswerChoiceResponse> choices;
}
```

### 3. Rebuild và Test

```bash
mvn clean install
# Hoặc
mvn spring-boot:run
```

### 4. Test API
```bash
GET http://localhost:8080/api/questions/23
```

**Response mong đợi:**
```json
{
  "questionId": 23,
  "questionNumber": 51,
  "questionType": "SHORT",
  "correctAnswer": "변경하고 싶습니다|바꾸고 싶습니다|바꿔 주시겠어요|바꿔 주세요",  // ✅ PHẢI CÓ
  "passageText": "안녕하세요. 제가 13일에...",
  "points": 5.0
}
```

## 📝 Tổng kết
- Backend Entity `Question` đã có field `correctAnswer` (TEXT)
- Backend Response DTO `QuestionResponse` đã có field  
- **THIẾU:** Backend Mapper không map field này → Cần thêm `resp.setCorrectAnswer(q.getCorrectAnswer());`
- FE đã sẵn sàng nhận dữ liệu từ `questionData.correctAnswer`
