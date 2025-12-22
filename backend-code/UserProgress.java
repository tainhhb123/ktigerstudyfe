package com.example.ktigerstudy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "user_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "progress_id")
    private Integer progressId;
    
    @Column(name = "last_accessed")
    private LocalDate lastAccessed;
    
    @Column(name = "lessonid")
    private Integer lessonid;
    
    @Column(name = "userid")
    private Integer userid;
    
    @Column(name = "is_lesson_completed")
    private Integer isLessonCompleted;
}
