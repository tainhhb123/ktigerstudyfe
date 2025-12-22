package org.example.ktigerstudybe.dto.resp;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProgressDTO {
    private Long progressId;
    private Long lessonId;
    private String lessonName;
    private LocalDateTime lastAccessed;
    private Boolean isLessonCompleted;
}
