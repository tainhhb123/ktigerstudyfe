package com.example.ktigerstudy.service;

import com.example.ktigerstudy.entity.UserProgress;
import java.util.List;

public interface UserProgressService {
    List<UserProgress> findByUserId(Integer userId);
}
