package org.example.ktigerstudybe.service.userprogress;

import org.example.ktigerstudybe.dto.resp.UserProgressResponse;
import org.example.ktigerstudybe.model.UserProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserProgressService {
    void completeLesson(Long userId, Long lessonId);
    Page<UserProgressResponse> getUserProgressList(String keyword, Pageable pageable);
    
    // Thêm method này để lấy progress của user
    List<UserProgress> findByUserId(Long userId);
}
