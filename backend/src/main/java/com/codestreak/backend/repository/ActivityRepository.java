package com.codestreak.backend.repository;

import com.codestreak.backend.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUserIdOrderByDateAscIdAsc(Long userId);
    List<Activity> findByUserIdAndDate(Long userId, LocalDate date);
    List<Activity> findByUserIdAndDateBetween(Long userId, LocalDate from, LocalDate to);
}