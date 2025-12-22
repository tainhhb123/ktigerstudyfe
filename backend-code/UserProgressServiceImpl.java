package com.example.ktigerstudy.service.impl;

import com.example.ktigerstudy.entity.UserProgress;
import com.example.ktigerstudy.repository.UserProgressRepository;
import com.example.ktigerstudy.service.UserProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserProgressServiceImpl implements UserProgressService {

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Override
    public List<UserProgress> findByUserId(Integer userId) {
        return userProgressRepository.findByUserid(userId);
    }
}
