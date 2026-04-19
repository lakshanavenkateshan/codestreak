package com.codestreak.backend.controller;

import com.codestreak.backend.model.Activity;
import com.codestreak.backend.model.Badge;
import com.codestreak.backend.model.ProblemEntry;
import com.codestreak.backend.repository.ActivityRepository;
import com.codestreak.backend.repository.ProblemEntryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ActivityController {

    private final ActivityRepository      activityRepository;
    private final ProblemEntryRepository  problemEntryRepository;
    private final StatsController         statsController;

    public ActivityController(ActivityRepository activityRepository,
                               ProblemEntryRepository problemEntryRepository,
                               StatsController statsController) {
        this.activityRepository     = activityRepository;
        this.problemEntryRepository = problemEntryRepository;
        this.statsController        = statsController;
    }

    // GET all sessions with their problems
    @GetMapping("/activities/{userId}")
    public List<Map<String, Object>> getActivities(@PathVariable Long userId) {
        List<Activity> sessions = activityRepository.findByUserIdOrderByDateAscIdAsc(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Activity s : sessions) {
            result.add(buildSessionMap(s));
        }
        return result;
    }

    // POST - create a NEW session (never overwrites old ones)
    @PostMapping("/activities")
    @Transactional
    public ResponseEntity<?> logActivity(@RequestBody Map<String, Object> body) {
        Long userId     = Long.valueOf(body.get("userId").toString());
        LocalDate today = LocalDate.now();
        int hour        = LocalTime.now().getHour();

        // Determine session label from time of day
        String sessionLabel = (String) body.getOrDefault("sessionLabel", deriveLabel(hour));

        // Always create a NEW session — never overwrite
        Activity session = Activity.builder()
                .userId(userId)
                .date(today)
                .sessionLabel(sessionLabel)
                .mood((String) body.getOrDefault("mood", "NEUTRAL"))
                .notes((String) body.getOrDefault("notes", ""))
                .proofLink((String) body.getOrDefault("proofLink", ""))
                .proofType((String) body.getOrDefault("proofType", "LINK"))
                .logHour(hour)
                .build();

        session = activityRepository.save(session);

        // Save problems
        List<Map<String, Object>> problemsRaw =
                (List<Map<String, Object>>) body.getOrDefault("problems", new ArrayList<>());

        int totalProblems = 0, totalMinutes = 0;
        List<ProblemEntry> savedProblems = new ArrayList<>();

        for (Map<String, Object> p : problemsRaw) {
            ProblemEntry entry = new ProblemEntry();
            entry.setActivityId(session.getId());
            entry.setUserId(userId);
            entry.setProblemName((String)  p.getOrDefault("problemName",  ""));
            entry.setProblemLink((String)  p.getOrDefault("problemLink",  ""));
            entry.setPlatform((String)     p.getOrDefault("platform",     "LeetCode"));
            entry.setDifficulty((String)   p.getOrDefault("difficulty",   "Medium"));
            entry.setTags((String)         p.getOrDefault("tags",         ""));
            entry.setNotes((String)        p.getOrDefault("notes",        ""));
            entry.setStatus((String)       p.getOrDefault("status",       "SOLVED"));
            int mins = p.get("timeSpentMinutes") != null
                    ? Integer.parseInt(p.get("timeSpentMinutes").toString()) : 0;
            entry.setTimeSpentMinutes(mins);
            problemEntryRepository.save(entry);
            savedProblems.add(entry);
            totalProblems++;
            totalMinutes += mins;
        }

        session.setProblemsSolved(totalProblems);
        session.setTimeSpentMinutes(totalMinutes);
        activityRepository.save(session);

        // Check badges after saving
        Map<String, Object> statsData = statsController.getStats(userId);
        List<Badge> newBadges = statsController.getNewBadges();

        Map<String, Object> response = buildSessionMap(session);
        response.put("newBadges", newBadges);
        return ResponseEntity.ok(response);
    }

    // DELETE a session and its problems
    @DeleteMapping("/activities/{id}")
    @Transactional
    public ResponseEntity<?> deleteActivity(@PathVariable Long id) {
        problemEntryRepository.deleteByActivityId(id);
        activityRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Session deleted"));
    }

    // GET all individual problems for a user
    @GetMapping("/problems/{userId}")
    public List<ProblemEntry> getAllProblems(@PathVariable Long userId) {
        return problemEntryRepository.findByUserIdOrderByIdDesc(userId);
    }

    // Helper: build a session map with problems attached
    private Map<String, Object> buildSessionMap(Activity s) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",               s.getId());
        m.put("userId",           s.getUserId());
        m.put("date",             s.getDate().toString());
        m.put("sessionLabel",     s.getSessionLabel());
        m.put("problemsSolved",   s.getProblemsSolved());
        m.put("timeSpentMinutes", s.getTimeSpentMinutes());
        m.put("mood",             s.getMood());
        m.put("logHour",          s.getLogHour());
        m.put("proofLink",        s.getProofLink());
        m.put("notes",            s.getNotes());
        m.put("problems",         problemEntryRepository.findByActivityId(s.getId()));
        return m;
    }

    // Helper: derive session label from hour of day
    private String deriveLabel(int hour) {
        if (hour >= 5  && hour < 12) return "MORNING";
        if (hour >= 12 && hour < 17) return "AFTERNOON";
        if (hour >= 17 && hour < 21) return "EVENING";
        return "NIGHT";
    }
}