package com.codestreak.backend.controller;

import com.codestreak.backend.model.Goal;
import com.codestreak.backend.repository.GoalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalController {
    private final GoalRepository gr;
    public GoalController(GoalRepository gr) { this.gr = gr; }

    @GetMapping("/{userId}")
    public ResponseEntity<?> get(@PathVariable Long userId) {
        return gr.findByUserId(userId).map(ResponseEntity::ok)
                 .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping
    public ResponseEntity<Goal> create(@RequestBody Map<String, Object> b) {
        return ResponseEntity.ok(gr.save(build(null, b)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> update(@PathVariable Long id, @RequestBody Map<String, Object> b) {
        return ResponseEntity.ok(gr.save(build(id, b)));
    }

    private Goal build(Long id, Map<String, Object> b) {
        Goal g = new Goal();
        if (id != null) g.setId(id);
        g.setUserId(Long.valueOf(b.get("userId").toString()));
        g.setDailyProblemTarget(Integer.parseInt(b.get("dailyProblemTarget").toString()));
        g.setWeeklyProblemTarget(Integer.parseInt(b.get("weeklyProblemTarget").toString()));
        g.setDailyMinutesTarget(Integer.parseInt(b.get("dailyMinutesTarget").toString()));
        return g;
    }
}