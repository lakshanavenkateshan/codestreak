package com.codestreak.backend.repository;

import com.codestreak.backend.model.ProblemEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProblemEntryRepository extends JpaRepository<ProblemEntry, Long> {
    List<ProblemEntry> findByActivityId(Long activityId);
    List<ProblemEntry> findByUserIdOrderByIdDesc(Long userId);
    void deleteByActivityId(Long activityId);
}