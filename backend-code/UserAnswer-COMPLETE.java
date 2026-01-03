package org.example.ktigerstudybe.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_answer")
public class UserAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_answer_id")
    private Long userAnswerId;

    // ===== FK tới ExamAttempt =====
    @ManyToOne
    @JoinColumn(name = "attempt_id", nullable = false)
    private ExamAttempt attempt;

    // ===== FK tới Question =====
    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    // ===== FK tới AnswerChoice (nullable cho tự luận) =====
    @ManyToOne
    @JoinColumn(name = "choice_id")
    private AnswerChoice choice;

    // ===== Cho SHORT / ESSAY =====
    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "score", precision = 5, scale = 2)
    private BigDecimal score = BigDecimal.ZERO;

    // ===== ✨ AI Grading Fields (cho WRITING section) =====
    
    @Column(name = "ai_score")
    private Integer aiScore;  // Điểm AI (0-100)

    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback;  // Nhận xét từ AI

    @Column(name = "ai_breakdown", columnDefinition = "JSON")
    private String aiBreakdown;  // JSON: {"content":40,"grammar":30,"vocabulary":20,"organization":10}

    @Column(name = "ai_suggestions", columnDefinition = "JSON")
    private String aiSuggestions;  // JSON: ["Gợi ý 1", "Gợi ý 2"]
}
