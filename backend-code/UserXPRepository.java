package org.example.ktigerstudybe.repository;

import org.example.ktigerstudybe.model.UserXP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserXPRepository extends JpaRepository<UserXP, Long> {
    // Tìm UserXP theo User ID (sử dụng nested property)
    UserXP findByUser_UserId(Long userId);
}
