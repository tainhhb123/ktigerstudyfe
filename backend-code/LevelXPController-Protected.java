package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.LevelXPRequest;
import org.example.ktigerstudybe.dto.resp.LevelXPResponse;
import org.example.ktigerstudybe.service.levelxp.LevelXPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * LevelXPController - Quản lý hệ thống XP/Level
 * 
 * User cần xem XP requirements để biết cần bao nhiêu XP để lên level
 * Admin quản lý config XP system
 */
@RestController
@RequestMapping("/api/level-xp")
public class LevelXPController {

    @Autowired
    private LevelXPService service;

    /**
     * Xem tất cả level XP configs
     * ✅ USER + ADMIN - User xem để biết XP requirements
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<LevelXPResponse> getAll() {
        return service.getAll();
    }

    /**
     * Xem XP config cho 1 level cụ thể
     * ✅ USER + ADMIN - User xem XP requirement cho level
     */
    @GetMapping("/{levelNumber}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public LevelXPResponse getByLevelNumber(@PathVariable Integer levelNumber) {
        return service.getByLevelNumber(levelNumber);
    }

    /**
     * Tạo hoặc update XP config
     * ⚠️ ADMIN ONLY - Chỉ admin config XP system
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public LevelXPResponse createOrUpdate(@RequestBody LevelXPRequest req) {
        return service.createOrUpdate(req);
    }

    /**
     * Xóa XP config
     * ⚠️ ADMIN ONLY - Chỉ admin xóa XP config
     */
    @DeleteMapping("/{levelNumber}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public void deleteByLevelNumber(@PathVariable Integer levelNumber) {
        service.deleteByLevelNumber(levelNumber);
    }
}
