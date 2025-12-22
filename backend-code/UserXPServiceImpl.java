package org.example.ktigerstudybe.service.impl;

import org.example.ktigerstudybe.model.UserXP;
import org.example.ktigerstudybe.repository.UserXPRepository;
import org.example.ktigerstudybe.service.UserXPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserXPServiceImpl implements UserXPService {

    @Autowired
    private UserXPRepository userXPRepository;

    @Override
    public UserXP findByUserId(Long userId) {
        return userXPRepository.findByUser_UserId(userId);
    }
}
