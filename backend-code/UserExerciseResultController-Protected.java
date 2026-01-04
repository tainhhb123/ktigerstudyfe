package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.UserExerciseResultRequest;
import org.example.ktigerstudybe.dto.resp.UserExerciseResultResponse;
import org.example.ktigerstudybe.service.userexerciseresult.UserExerciseResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-exercise-results")
public class UserExerciseResultController {

    @Autowired
    private UserExerciseResultService service;

    /**
     * Lưu kết quả bài tập
     * ✅ USER + ADMIN - User lưu kết quả khi làm xong exercise
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - User chỉ lưu result với userId = mình
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public UserExerciseResultResponse saveResult(@RequestBody UserExerciseResultRequest req) {
        return service.saveResult(req);
    }

    /**
     * Xem kết quả bài tập của user
     * ✅ AUTHENTICATED - User xem lịch sử kết quả của mình
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - USER chỉ xem results với userId = mình
     * - ADMIN xem được tất cả userId
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public List<UserExerciseResultResponse> getByUser(@PathVariable Long userId) {
        return service.getResultsByUserId(userId);
    }

    /**
     * Xem kết quả cụ thể của user cho 1 exercise
     * ✅ AUTHENTICATED - User xem kết quả exercise cụ thể
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - USER chỉ xem result với userId = mình
     * - ADMIN xem được tất cả userId
     */
    @GetMapping("/user/{userId}/exercise/{exerciseId}")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public UserExerciseResultResponse getByUserAndExercise(
            @PathVariable Long userId,
            @PathVariable Long exerciseId
    ) {
        return service.getResultByUserIdAndExerciseId(userId, exerciseId);
    }
}
