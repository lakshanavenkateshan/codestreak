package com.codestreak.backend.repository;

import com.codestreak.backend.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    Optional<Goal> findByUserId(Long userId);
}