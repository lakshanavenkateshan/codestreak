package com.codestreak.backend.repository;

import com.codestreak.backend.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
    List<Badge> findByUserIdOrderByEarnedOnDesc(Long userId);
    boolean existsByUserIdAndBadgeKey(Long userId, String badgeKey);
}