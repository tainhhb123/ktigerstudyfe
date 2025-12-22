package org.example.ktigerstudybe.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "progress_id")
    private Long progressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "userProgress", "password"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LessonID")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "userProgress"})
    private Lesson lesson;

    @Column(name = "LastAccessed")
    private LocalDateTime lastAccessed;

    @Column(name = "IsLessonCompleted")
    private Boolean isLessonCompleted = false;
}
