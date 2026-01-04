package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.LevelRequest;
import org.example.ktigerstudybe.dto.resp.LevelResponse;
import org.example.ktigerstudybe.service.level.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/levels")
public class LevelController {

    @Autowired
    private LevelService levelService;

    /**
     * Xem tất cả levels
     * ✅ USER + ADMIN - User xem levels để chọn cấp độ học
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public List<LevelResponse> getAllLevels() {
        return levelService.getAllLevels();
    }

    /**
     * Xem chi tiết 1 level
     * ✅ USER + ADMIN - User xem thông tin level
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<LevelResponse> getLevelById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(levelService.getLevelById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Tạo level mới
     * ⚠️ ADMIN ONLY - Chỉ admin tạo levels
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public LevelResponse createLevel(@RequestBody LevelRequest request) {
        return levelService.createLevel(request);
    }

    /**
     * Sửa level
     * ⚠️ ADMIN ONLY - Chỉ admin sửa levels
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<LevelResponse> updateLevel(@PathVariable Long id, @RequestBody LevelRequest request) {
        try {
            return ResponseEntity.ok(levelService.updateLevel(id, request));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xóa level
     * ⚠️ ADMIN ONLY - Chỉ admin xóa levels
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
    public ResponseEntity<Void> deleteLevel(@PathVariable Long id) {
        levelService.deleteLevel(id);
        return ResponseEntity.noContent().build();
    }
}
