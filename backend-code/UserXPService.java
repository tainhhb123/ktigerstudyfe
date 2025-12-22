package org.example.ktigerstudybe.service;

import org.example.ktigerstudybe.model.UserXP;

public interface UserXPService {
    UserXP findByUserId(Long userId);
}
