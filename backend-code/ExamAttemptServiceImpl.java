package org.example.ktigerstudybe.service.examAttempt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.ktigerstudybe.dto.req.ExamAttemptRequest;
import org.example.ktigerstudybe.dto.req.WritingGradingRequest;
import org.example.ktigerstudybe.dto.resp.ExamAttemptResponse;
import org.example.ktigerstudybe.dto.resp.ExamResultResponse;
import org.example.ktigerstudybe.dto.resp.QuestionResultResponse;
import org.example.ktigerstudybe.dto.resp.SectionResultResponse;
import org.example.ktigerstudybe.dto.resp.WritingGradingResult;
import org.example.ktigerstudybe.enums.ExamAttemptStatus;
import org.example.ktigerstudybe.enums.QuestionType;
import org.example.ktigerstudybe.model.*;
import org.example.ktigerstudybe.repository.*;
import org.example.ktigerstudybe.service.aiGrading.AIGradingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExamAttemptServiceImpl implements ExamAttemptService {

    @Autowired
    private ExamAttemptRepository examAttemptRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerChoiceRepository answerChoiceRepository;

    @Autowired
    private AIGradingService aiGradingService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ===== Mapper =====
    private ExamAttemptResponse toResponse(ExamAttempt attempt) {
        ExamAttemptResponse resp = new ExamAttemptResponse();

        resp.setAttemptId(attempt.getAttemptId());

        resp.setExamId(attempt.getExam().getExamId());
        resp.setExamTitle(attempt.getExam().getTitle());

        resp.setUserId(attempt.getUser().getUserId());
        resp.setUserName(attempt.getUser().getUserName());

        resp.setStartTime(attempt.getStartTime());
        resp.setEndTime(attempt.getEndTime());

        resp.setStatus(attempt.getStatus().name());

        resp.setListeningScore(attempt.getListeningScore());
        resp.setReadingScore(attempt.getReadingScore());
        resp.setWritingScore(attempt.getWritingScore());
        resp.setTotalScore(attempt.getTotalScore());

        return resp;
    }

    // ===== Start exam =====
    @Override
    public ExamAttemptResponse startExam(ExamAttemptRequest request) {

        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new IllegalArgumentException("Exam not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ExamAttempt attempt = new ExamAttempt();
        attempt.setExam(exam);
        attempt.setUser(user);
        attempt.setStartTime(LocalDateTime.now());
        attempt.setStatus(ExamAttemptStatus.IN_PROGRESS);

        attempt = examAttemptRepository.save(attempt);
        return toResponse(attempt);
    }

    @Override
    public ExamAttemptResponse getAttemptById(Long id) {
        ExamAttempt attempt = examAttemptRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Attempt not found"));
        return toResponse(attempt);
    }

    @Override
    public List<ExamAttemptResponse> getAttemptsByUser(Long userId) {
        return examAttemptRepository.findByUser_UserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ===== Submit exam =====
    @Override
    @Transactional
    public ExamAttemptResponse submitExam(Long attemptId) {

        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new IllegalArgumentException("Attempt not found"));

        if (attempt.getStatus() == ExamAttemptStatus.COMPLETED) {
            throw new IllegalStateException("Exam already submitted");
        }

        System.out.println("📝 Starting exam submission for attempt: " + attemptId);

        // 1. Tính điểm MCQ (Listening, Reading)
        calculateAndSaveScores(attempt);

        // 2. Chấm WRITING (SHORT + ESSAY) bằng AI
        gradeWritingWithAI(attempt);

        // 3. Tính lại writing_score
        recalculateWritingScore(attempt);

        // 4. Update status
        attempt.setEndTime(LocalDateTime.now());
        attempt.setStatus(ExamAttemptStatus.COMPLETED);

        attempt = examAttemptRepository.save(attempt);
        
        System.out.println("✅ Exam submission completed!");
        return toResponse(attempt);
    }

    /**
     * Tính điểm MCQ (Listening, Reading) - WRITING sẽ do AI chấm
     */
    private void calculateAndSaveScores(ExamAttempt attempt) {
        System.out.println("🔢 Calculating MCQ scores (Listening, Reading)...");
        
        List<UserAnswer> userAnswers = userAnswerRepository.findByAttempt_AttemptId(attempt.getAttemptId());

        BigDecimal listeningTotal = BigDecimal.ZERO;
        BigDecimal readingTotal = BigDecimal.ZERO;

        for (UserAnswer userAnswer : userAnswers) {
            Question question = userAnswer.getQuestion();
            String sectionType = question.getSection().getSectionType().name();

            // WRITING section sẽ được AI chấm riêng
            if ("WRITING".equals(sectionType)) {
                userAnswer.setScore(BigDecimal.ZERO); // Tạm = 0, AI sẽ update
                userAnswerRepository.save(userAnswer);
                continue;
            }

            // Chỉ chấm MCQ cho LISTENING và READING
            BigDecimal score = BigDecimal.ZERO;
            if (QuestionType.MCQ.equals(question.getQuestionType())) {
                score = calculateMCQScore(userAnswer, question);
            }

            userAnswer.setScore(score);
            userAnswerRepository.save(userAnswer);

            if ("LISTENING".equals(sectionType)) {
                listeningTotal = listeningTotal.add(score);
            } else if ("READING".equals(sectionType)) {
                readingTotal = readingTotal.add(score);
            }
        }

        attempt.setListeningScore(listeningTotal);
        attempt.setReadingScore(readingTotal);
        attempt.setWritingScore(BigDecimal.ZERO); // Sẽ update sau khi AI chấm
        attempt.setTotalScore(listeningTotal.add(readingTotal));
        
        System.out.println("✅ MCQ scores: Listening=" + listeningTotal + ", Reading=" + readingTotal);
    }

    /**
     * Chấm ESSAY + SHORT bằng AI
     */
    private void gradeWritingWithAI(ExamAttempt attempt) {
        System.out.println("🤖 Starting AI grading for WRITING section...");
        
        // Lấy tất cả SHORT + ESSAY answers trong WRITING section
        List<UserAnswer> writingAnswers = userAnswerRepository
                .findByAttempt_AttemptId(attempt.getAttemptId())
                .stream()
                .filter(ua -> ua.getQuestion() != null)
                .filter(ua -> "WRITING".equals(ua.getQuestion().getSection().getSectionType().name()))
                .filter(ua -> {
                    QuestionType type = ua.getQuestion().getQuestionType();
                    return QuestionType.SHORT.equals(type) || QuestionType.ESSAY.equals(type);
                })
                .filter(ua -> ua.getAnswerText() != null && !ua.getAnswerText().trim().isEmpty())
                .collect(Collectors.toList());

        if (writingAnswers.isEmpty()) {
            System.out.println("⚠️ No WRITING answers found to grade");
            return;
        }

        System.out.println("📝 Found " + writingAnswers.size() + " WRITING answers (SHORT + ESSAY)");

        for (UserAnswer ua : writingAnswers) {
            try {
                Question q = ua.getQuestion();
                QuestionType type = q.getQuestionType();
                
                System.out.println("🤖 Grading Q" + q.getQuestionNumber() + " (" + type + ")...");

                if (QuestionType.SHORT.equals(type)) {
                    gradeShortWithAI(ua, q);
                } else if (QuestionType.ESSAY.equals(type)) {
                    gradeEssayQuestion(ua, q);
                }

            } catch (Exception e) {
                System.err.println("❌ AI failed Q" + ua.getQuestion().getQuestionNumber() + ": " + e.getMessage());
                ua.setScore(BigDecimal.ZERO);
                userAnswerRepository.save(ua);
            }
        }
        
        System.out.println("✅ AI grading completed");
    }

    /**
     * Chấm SHORT bằng AI (câu 51, 52)
     */
    private void gradeShortWithAI(UserAnswer ua, Question q) throws Exception {
        String userAnswer = ua.getAnswerText().trim();
        String correctAnswer = q.getCorrectAnswer();
        
        // Nếu không có đáp án mẫu, cho 0 điểm
        if (correctAnswer == null || correctAnswer.isEmpty()) {
            ua.setScore(BigDecimal.ZERO);
            userAnswerRepository.save(ua);
            return;
        }

        // Exact match trước (nhanh)
        String[] possibleAnswers = correctAnswer.split("\\|");
        for (String possible : possibleAnswers) {
            if (userAnswer.equalsIgnoreCase(possible.trim())) {
                ua.setScore(q.getPoints());
                ua.setAiScore(100);
                ua.setAiFeedback("Đúng hoàn toàn!");
                userAnswerRepository.save(ua);
                System.out.println("✅ Q" + q.getQuestionNumber() + " exact match → " + q.getPoints());
                return;
            }
        }

        // Không exact match → dùng AI chấm partial credit
        System.out.println("🤖 Q" + q.getQuestionNumber() + " no exact match, using AI for partial credit...");
        System.out.println("   User: \"" + userAnswer + "\" vs Correct: \"" + correctAnswer + "\"");
        
        WritingGradingRequest request = new WritingGradingRequest(
            q.getQuestionNumber(),
            q.getQuestionText() != null ? q.getQuestionText() : q.getPassageText(),
            correctAnswer,
            userAnswer,
            1, 50  // SHORT: 1-50 chars
        );

        WritingGradingResult aiResult = aiGradingService.gradeWriting(request);
        Integer score = aiResult.getScore();
        
        // Convert 0-100 → question points
        BigDecimal finalScore = new BigDecimal(score != null ? score : 0)
                .multiply(q.getPoints())
                .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);

        ua.setScore(finalScore);
        ua.setAiScore(score);
        ua.setAiFeedback(aiResult.getFeedback());
        
        // Lưu suggestions cho SHORT (nếu có)
        try {
            if (aiResult.getSuggestions() != null && !aiResult.getSuggestions().isEmpty()) {
                ua.setAiSuggestions(objectMapper.writeValueAsString(aiResult.getSuggestions()));
            }
        } catch (JsonProcessingException e) {
            System.err.println("Failed to serialize SHORT suggestions: " + e.getMessage());
        }
        
        userAnswerRepository.save(ua);
        
        System.out.println("✅ Q" + q.getQuestionNumber() + " AI partial → " + score + "/100 → " + finalScore + "/" + q.getPoints());
    }

    /**
     * Chấm ESSAY bằng AI (câu 53, 54)
     */
    private void gradeEssayQuestion(UserAnswer ua, Question q) throws Exception {
        int minChars = 200;
        int maxChars = 300;
        
        // TOPIK II Writing:
        // Q51, Q52: 10 điểm mỗi câu (SHORT) - xử lý ở gradeShortWithAI
        // Q53: 30 điểm (200-300 ký tự)
        // Q54: 50 điểm (600-700 ký tự)
        if (q.getQuestionNumber() == 53) {
            minChars = 200;
            maxChars = 300;
        } else if (q.getQuestionNumber() == 54) {
            minChars = 600;
            maxChars = 700;
        } else {
            // Default cho các câu ESSAY khác
            minChars = 200;
            maxChars = 700;
        }
        
        WritingGradingRequest request = new WritingGradingRequest(
            q.getQuestionNumber(),
            q.getPassageText(),
            q.getCorrectAnswer(),
            ua.getAnswerText(),
            minChars,
            maxChars
        );

        WritingGradingResult aiResult = aiGradingService.gradeWriting(request);
        Integer score = aiResult.getScore();
        
        BigDecimal finalScore = new BigDecimal(score != null ? score : 0)
                .multiply(q.getPoints())
                .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);

        ua.setScore(finalScore);
        ua.setAiScore(score);
        ua.setAiFeedback(aiResult.getFeedback());
        
        try {
            ua.setAiBreakdown(objectMapper.writeValueAsString(aiResult.getBreakdown()));
            ua.setAiSuggestions(objectMapper.writeValueAsString(aiResult.getSuggestions()));
        } catch (JsonProcessingException e) {
            System.err.println("Failed to serialize AI result: " + e.getMessage());
        }
        
        userAnswerRepository.save(ua);
        System.out.println("✅ Q" + q.getQuestionNumber() + " ESSAY → " + finalScore + "/" + q.getPoints());
    }

    /**
     * Tính lại writing_score sau khi AI chấm
     */
    private void recalculateWritingScore(ExamAttempt attempt) {
        System.out.println("📊 Recalculating writing_score...");
        
        List<UserAnswer> writingAnswers = userAnswerRepository
                .findByAttempt_AttemptId(attempt.getAttemptId())
                .stream()
                .filter(ua -> {
                    Question q = ua.getQuestion();
                    if (q == null || q.getSection() == null) return false;
                    return "WRITING".equals(q.getSection().getSectionType().name());
                })
                .collect(Collectors.toList());

        BigDecimal writingScore = writingAnswers.stream()
                .map(UserAnswer::getScore)
                .filter(score -> score != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        attempt.setWritingScore(writingScore);

        // Tính lại total_score
        BigDecimal totalScore = BigDecimal.ZERO;
        if (attempt.getListeningScore() != null) {
            totalScore = totalScore.add(attempt.getListeningScore());
        }
        if (attempt.getReadingScore() != null) {
            totalScore = totalScore.add(attempt.getReadingScore());
        }
        if (attempt.getWritingScore() != null) {
            totalScore = totalScore.add(attempt.getWritingScore());
        }

        attempt.setTotalScore(totalScore);

        System.out.println("📊 Final Scores:");
        System.out.println("   - Listening: " + (attempt.getListeningScore() != null ? attempt.getListeningScore() : "0"));
        System.out.println("   - Writing: " + writingScore);
        System.out.println("   - Reading: " + (attempt.getReadingScore() != null ? attempt.getReadingScore() : "0"));
        System.out.println("   - TOTAL: " + totalScore);
    }

    /**
     * Tính điểm cho 1 câu hỏi (MCQ, SHORT, ESSAY)
     * ESSAY trả về 0 vì sẽ được chấm riêng bởi AI
     */
    private BigDecimal calculateQuestionScore(UserAnswer userAnswer, Question question) {
        QuestionType type = question.getQuestionType();

        switch (type) {
            case MCQ:
                return calculateMCQScore(userAnswer, question);
            case SHORT:
                return calculateShortAnswerScore(userAnswer, question);
            case ESSAY:
                // ESSAY + SHORT trong WRITING sẽ được AI chấm
                return BigDecimal.ZERO;
            default:
                return BigDecimal.ZERO;
        }
    }

    /**
     * Tính điểm MCQ (Trắc nghiệm)
     */
    private BigDecimal calculateMCQScore(UserAnswer userAnswer, Question question) {
        if (userAnswer.getChoice() == null) {
            return BigDecimal.ZERO;
        }

        AnswerChoice selectedChoice = userAnswer.getChoice();

        if (selectedChoice.getIsCorrect() != null && selectedChoice.getIsCorrect()) {
            return question.getPoints();
        }

        return BigDecimal.ZERO;
    }

    /**
     * Tính điểm SHORT (Điền từ)
     */
    private BigDecimal calculateShortAnswerScore(UserAnswer userAnswer, Question question) {
        if (userAnswer.getAnswerText() == null || userAnswer.getAnswerText().trim().isEmpty()) {
            return BigDecimal.ZERO;
        }

        if (question.getCorrectAnswer() == null) {
            return BigDecimal.ZERO;
        }

        String userText = userAnswer.getAnswerText().trim().toLowerCase();
        String correctAnswer = question.getCorrectAnswer().trim().toLowerCase();

        // Hỗ trợ nhiều đáp án đúng: "만약|혹시|비록"
        String[] possibleAnswers = correctAnswer.split("\\|");

        for (String possible : possibleAnswers) {
            if (userText.equals(possible.trim().toLowerCase())) {
                return question.getPoints();
            }
        }

        return BigDecimal.ZERO;
    }

    /**
     * Lấy kết quả chi tiết (cho trang Result)
     */
    @Override
    @Transactional(readOnly = true)
    public ExamResultResponse getExamResult(Long attemptId) {
        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new IllegalArgumentException("Exam attempt not found"));

        if (attempt.getStatus() != ExamAttemptStatus.COMPLETED) {
            throw new IllegalStateException("Exam not yet completed");
        }

        // Lấy tất cả câu trả lời
        List<UserAnswer> userAnswers = userAnswerRepository.findByAttempt_AttemptId(attemptId);

        // Tính kết quả theo section
        Map<String, SectionResultResponse> sectionResults = calculateSectionResults(userAnswers);

        // Tạo danh sách chi tiết câu hỏi
        List<QuestionResultResponse> questionResults = prepareQuestionResults(userAnswers);

        // Đếm số câu đúng
        int totalQuestions = questionResults.size();
        int correctAnswers = (int) questionResults.stream()
                .filter(QuestionResultResponse::isCorrect)
                .count();

        return ExamResultResponse.builder()
                .attemptId(attemptId)
                .totalScore(attempt.getTotalScore())
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswers)
                .sectionResults(sectionResults)
                .questions(questionResults)
                .build();
    }

    /**
     * Tính kết quả từng section
     */
    private Map<String, SectionResultResponse> calculateSectionResults(List<UserAnswer> userAnswers) {
        Map<String, SectionResultResponse> sectionMap = new HashMap<>();

        for (UserAnswer answer : userAnswers) {
            Question question = answer.getQuestion();
            String sectionType = question.getSection().getSectionType().name();

            SectionResultResponse sectionResult = sectionMap.getOrDefault(
                    sectionType,
                    new SectionResultResponse(sectionType)
            );

            sectionResult.addQuestion(answer.getScore(), question.getPoints());
            sectionMap.put(sectionType, sectionResult);
        }

        return sectionMap;
    }

    /**
     * Tạo danh sách chi tiết câu hỏi
     */
    private List<QuestionResultResponse> prepareQuestionResults(List<UserAnswer> userAnswers) {
        return userAnswers.stream()
                .map(answer -> {
                    Question question = answer.getQuestion();

                    String userAnswerText = getUserAnswerText(answer);
                    String correctAnswerText = getCorrectAnswerText(question);
                    boolean isCorrect = answer.getScore() != null && answer.getScore().compareTo(BigDecimal.ZERO) > 0;

                    // Build response với AI grading fields
                    QuestionResultResponse.QuestionResultResponseBuilder builder = QuestionResultResponse.builder()
                            .questionId(question.getQuestionId())
                            .questionNumber(question.getQuestionNumber())
                            .questionText(question.getQuestionText())
                            .questionType(question.getQuestionType().name())
                            .sectionType(question.getSection().getSectionType().name())
                            .userAnswer(userAnswerText)
                            .correctAnswer(correctAnswerText)
                            .isCorrect(isCorrect)
                            .score(answer.getScore() != null ? answer.getScore() : BigDecimal.ZERO)
                            .maxScore(question.getPoints());
                    
                    // AI grading fields for ESSAY
                    if (QuestionType.ESSAY.equals(question.getQuestionType()) && answer.getAiScore() != null) {
                        builder.aiScore(answer.getAiScore())
                               .aiFeedback(answer.getAiFeedback());
                        
                        try {
                            if (answer.getAiBreakdown() != null) {
                                WritingGradingResult.Breakdown breakdown = objectMapper.readValue(
                                    answer.getAiBreakdown(), WritingGradingResult.Breakdown.class);
                                builder.aiBreakdown(QuestionResultResponse.AIScoreBreakdown.builder()
                                        .content(breakdown.getContent())
                                        .grammar(breakdown.getGrammar())
                                        .vocabulary(breakdown.getVocabulary())
                                        .organization(breakdown.getOrganization())
                                        .build());
                            }
                            if (answer.getAiSuggestions() != null) {
                                List<String> suggestions = objectMapper.readValue(
                                    answer.getAiSuggestions(), 
                                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
                                builder.aiSuggestions(suggestions);
                            }
                        } catch (JsonProcessingException e) {
                            System.err.println("Failed to parse ESSAY AI JSON: " + e.getMessage());
                        }
                    }
                    
                    // AI grading fields for SHORT (partial credit)
                    if (QuestionType.SHORT.equals(question.getQuestionType()) && answer.getAiScore() != null) {
                        builder.aiScore(answer.getAiScore())
                               .aiFeedback(answer.getAiFeedback());
                        
                        try {
                            if (answer.getAiSuggestions() != null) {
                                List<String> suggestions = objectMapper.readValue(
                                    answer.getAiSuggestions(), 
                                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
                                builder.aiSuggestions(suggestions);
                            }
                        } catch (JsonProcessingException e) {
                            System.err.println("Failed to parse SHORT AI JSON: " + e.getMessage());
                        }
                    }
                    
                    return builder.build();
                })
                .sorted(Comparator.comparing(QuestionResultResponse::getQuestionNumber))
                .collect(Collectors.toList());
    }

    private String getUserAnswerText(UserAnswer answer) {
        if (answer.getAnswerText() != null && !answer.getAnswerText().isEmpty()) {
            return answer.getAnswerText();
        }

        // MCQ
        if (answer.getChoice() != null) {
            AnswerChoice choice = answer.getChoice();
            String choiceText = choice.getChoiceText();

            // Nếu choiceText là URL ảnh, CHỈ trả về URL (không label)
            if (choiceText != null && choiceText.trim().startsWith("http")) {
                return choiceText.trim();
            }

            // Text thường: trả về label + text
            return choice.getChoiceLabel() + ". " + choiceText;
        }

        return "(Không trả lời)";
    }

    /**
     * Lấy đáp án đúng
     */
    private String getCorrectAnswerText(Question question) {
        QuestionType type = question.getQuestionType();

        if (type == QuestionType.SHORT || type == QuestionType.ESSAY) {
            return question.getCorrectAnswer() != null ? question.getCorrectAnswer() : "(Chưa có đáp án)";
        }

        if (type == QuestionType.MCQ) {
            List<AnswerChoice> choices = answerChoiceRepository.findByQuestionId(question.getQuestionId());
            return choices.stream()
                    .filter(c -> c.getIsCorrect() != null && c.getIsCorrect())
                    .findFirst()
                    .map(c -> {
                        String choiceText = c.getChoiceText();
                        // Nếu là URL ảnh, CHỈ trả về URL
                        if (choiceText != null && choiceText.trim().startsWith("http")) {
                            return choiceText.trim();
                        }
                        // Text thường: label + text
                        return c.getChoiceLabel() + ". " + choiceText;
                    })
                    .orElse("(Không có đáp án đúng)");
        }

        return "";
    }
}
