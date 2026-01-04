package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.UserXPUpdateRequest;
import org.example.ktigerstudybe.dto.resp.LeaderboardResponse;
import org.example.ktigerstudybe.dto.resp.UserXPResponse;
import org.example.ktigerstudybe.model.UserXP;
import org.example.ktigerstudybe.service.userxp.UserXPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-xp")
public class UserXPController {

    @Autowired
    private UserXPService userXPService;

    /**
     * Lấy XP của user
     * ✅ AUTHENTICATED - User xem XP của mình, Admin xem tất cả
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - USER chỉ xem XP với userId = mình
     * - ADMIN xem được tất cả userId
     */
    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public UserXPResponse getUserXP(@PathVariable Long userId) {
        return userXPService.getUserXP(userId);
    }

    /**
     * Thêm XP cho user
     * ✅ USER + ADMIN - User nhận XP khi complete lesson/exercise
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - User chỉ add XP cho userId = mình
     * - ADMIN có thể add XP cho bất kỳ userId nào
     */
    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public UserXPResponse addXP(@RequestBody UserXPUpdateRequest req) {
        return userXPService.addXP(req);
    }

    /**
     * Xem bảng xếp hạng
     * ✅ USER + ADMIN - Ai cũng xem được leaderboard để có động lực học
     * 
     * Có thể để PUBLIC nếu muốn:
     * - Bỏ @PreAuthorize → Public
     * - Hoặc giữ hasAnyRole → Chỉ users xem được
     */
    @GetMapping("/leaderboard")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<LeaderboardResponse> getLeaderboard() {
        return userXPService.getLeaderboard();
    }
}
