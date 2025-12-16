package org.example.ktigerstudybe.service.examAttempt;

import org.example.ktigerstudybe.dto.req.ExamAttemptRequest;
import org.example.ktigerstudybe.dto.resp.ExamAttemptResponse;
import org.example.ktigerstudybe.dto.resp.ExamResultResponse;
import org.example.ktigerstudybe.dto.resp.QuestionResultResponse;
import org.example.ktigerstudybe.dto.resp.SectionResultResponse;
import org.example.ktigerstudybe.enums.ExamAttemptStatus;
import org.example.ktigerstudybe.enums.QuestionType;
import org.example.ktigerstudybe.model.*;
import org.example.ktigerstudybe.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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

        // Tính điểm
        calculateAndSaveScores(attempt);

        attempt.setEndTime(LocalDateTime.now());
        attempt.setStatus(ExamAttemptStatus.COMPLETED);

        attempt = examAttemptRepository.save(attempt);
        return toResponse(attempt);
    }

    /**
     * Tính điểm và lưu vào database
     */
    private void calculateAndSaveScores(ExamAttempt attempt) {
        // Lấy tất cả câu trả lời
        List<UserAnswer> userAnswers = userAnswerRepository.findByAttempt_AttemptId(attempt.getAttemptId());

        BigDecimal listeningTotal = BigDecimal.ZERO;
        BigDecimal writingTotal = BigDecimal.ZERO;
        BigDecimal readingTotal = BigDecimal.ZERO;

        for (UserAnswer userAnswer : userAnswers) {
            Question question = userAnswer.getQuestion();

            // Tính điểm cho câu hỏi
            BigDecimal score = calculateQuestionScore(userAnswer, question);

            // Lưu điểm vào user_answer
            userAnswer.setScore(score);
            userAnswerRepository.save(userAnswer);

            // Cộng điểm theo section
            String sectionType = question.getSection().getSectionType().name();

            if ("LISTENING".equals(sectionType)) {
                listeningTotal = listeningTotal.add(score);
            } else if ("WRITING".equals(sectionType)) {
                writingTotal = writingTotal.add(score);
            } else if ("READING".equals(sectionType)) {
                readingTotal = readingTotal.add(score);
            }
        }

        // Lưu điểm vào exam_attempt
        attempt.setListeningScore(listeningTotal);
        attempt.setWritingScore(writingTotal);
        attempt.setReadingScore(readingTotal);
        attempt.setTotalScore(listeningTotal.add(writingTotal).add(readingTotal));
    }

    /**
     * Tính điểm cho 1 câu hỏi
     */
    private BigDecimal calculateQuestionScore(UserAnswer userAnswer, Question question) {
        QuestionType type = question.getQuestionType();

        switch (type) {
            case MCQ:
                return calculateMCQScore(userAnswer, question);
            case SHORT:
                return calculateShortAnswerScore(userAnswer, question);
            case ESSAY:
                // Essay chấm thủ công
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

                    return QuestionResultResponse.builder()
                            .questionId(question.getQuestionId())
                            .questionNumber(question.getQuestionNumber())
                            .questionText(question.getQuestionText())
                            .questionType(question.getQuestionType().name())
                            .sectionType(question.getSection().getSectionType().name())
                            .userAnswer(userAnswerText)
                            .correctAnswer(correctAnswerText)
                            .isCorrect(isCorrect)
                            .score(answer.getScore() != null ? answer.getScore() : BigDecimal.ZERO)
                            .maxScore(question.getPoints())
                            .build();
                })
                .sorted(Comparator.comparing(QuestionResultResponse::getQuestionNumber))
                .collect(Collectors.toList());
    }

    /**
     * Lấy text câu trả lời của user
     */
    private String getUserAnswerText(UserAnswer answer) {
        // SHORT hoặc ESSAY
        if (answer.getAnswerText() != null && !answer.getAnswerText().isEmpty()) {
            return answer.getAnswerText();
        }

        // MCQ
        if (answer.getChoice() != null) {
            AnswerChoice choice = answer.getChoice();
            return choice.getChoiceLabel() + ". " + choice.getChoiceText();
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
                    .map(c -> c.getChoiceLabel() + ". " + c.getChoiceText())
                    .orElse("(Không có đáp án đúng)");
        }

        return "";
    }
}
