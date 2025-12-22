package com.example.ktigerstudy.controller;

import com.example.ktigerstudy.entity.UserProgress;
import com.example.ktigerstudy.service.UserProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-progress")
@CrossOrigin(origins = "*")
public class UserProgressController {

    @Autowired
    private UserProgressService userProgressService;

    // Lấy tất cả progress của user theo userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserProgress>> getUserProgress(@PathVariable Integer userId) {
        try {
            List<UserProgress> progressList = userProgressService.findByUserId(userId);
            return ResponseEntity.ok(progressList);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
