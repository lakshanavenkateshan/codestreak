package com.codestreak.backend.controller;

import com.codestreak.backend.model.Activity;
import com.codestreak.backend.model.Badge;
import com.codestreak.backend.model.ProblemEntry;
import com.codestreak.backend.model.User;
import com.codestreak.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository         userRepository;
    private final ActivityRepository     activityRepository;
    private final ProblemEntryRepository problemEntryRepository;
    private final BadgeRepository        badgeRepository;
    private final GoalRepository         goalRepository;

    public AdminController(UserRepository userRepository,
                           ActivityRepository activityRepository,
                           ProblemEntryRepository problemEntryRepository,
                           BadgeRepository badgeRepository,
                           GoalRepository goalRepository) {
        this.userRepository         = userRepository;
        this.activityRepository     = activityRepository;
        this.problemEntryRepository = problemEntryRepository;
        this.badgeRepository        = badgeRepository;
        this.goalRepository         = goalRepository;
    }

    // ── GET /api/admin/users ──────────────────────────────────────────────
    // Returns a summary of every non-admin user
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User user : users) {
            if ("ADMIN".equals(user.getRole())) continue; // skip admin itself

            List<Activity> sessions = activityRepository
                    .findByUserIdOrderByDateAscIdAsc(user.getId());

            int totalProblems = sessions.stream()
                    .mapToInt(Activity::getProblemsSolved).sum();

            // Calculate current streak
            List<LocalDate> dates = sessions.stream()
                    .map(Activity::getDate).distinct().sorted().toList();
            int currentStreak = 0;
            LocalDate check = LocalDate.now();
            for (int i = dates.size() - 1; i >= 0; i--) {
                if (dates.get(i).equals(check)) { currentStreak++; check = check.minusDays(1); }
                else break;
            }

            int badgeCount = badgeRepository.findByUserIdOrderByEarnedOnDesc(user.getId()).size();

            Map<String, Object> summary = new LinkedHashMap<>();
            summary.put("id",            user.getId());
            summary.put("username",      user.getUsername());
            summary.put("email",         user.getEmail());
            summary.put("totalSessions", sessions.size());
            summary.put("totalProblems", totalProblems);
            summary.put("currentStreak", currentStreak);
            summary.put("badgeCount",    badgeCount);
            summary.put("lastActive",    dates.isEmpty() ? null : dates.get(dates.size() - 1).toString());
            result.add(summary);
        }

        return ResponseEntity.ok(result);
    }

    // ── GET /api/admin/users/{userId} ─────────────────────────────────────
    // Returns full profile of a specific user
    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserDetail(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            return ResponseEntity.notFound().build();

        List<Activity>     sessions = activityRepository.findByUserIdOrderByDateAscIdAsc(userId);
        List<ProblemEntry> problems = problemEntryRepository.findByUserIdOrderByIdDesc(userId);
        List<Badge>        badges   = badgeRepository.findByUserIdOrderByEarnedOnDesc(userId);

        // Sessions with their problems attached
        List<Map<String, Object>> sessionList = new ArrayList<>();
        for (Activity s : sessions) {
            Map<String, Object> sm = new LinkedHashMap<>();
            sm.put("id",               s.getId());
            sm.put("date",             s.getDate().toString());
            sm.put("sessionLabel",     s.getSessionLabel());
            sm.put("problemsSolved",   s.getProblemsSolved());
            sm.put("timeSpentMinutes", s.getTimeSpentMinutes());
            sm.put("mood",             s.getMood());
            sm.put("proofLink",        s.getProofLink());
            sm.put("notes",            s.getNotes());
            sm.put("problems",         problemEntryRepository.findByActivityId(s.getId()));
            sessionList.add(sm);
        }

        // Basic stats
        int totalProblems = sessions.stream().mapToInt(Activity::getProblemsSolved).sum();
        int totalMinutes  = sessions.stream().mapToInt(Activity::getTimeSpentMinutes).sum();

        List<LocalDate> dates = sessions.stream()
                .map(Activity::getDate).distinct().sorted().toList();

        int currentStreak = 0;
        LocalDate check = LocalDate.now();
        for (int i = dates.size() - 1; i >= 0; i--) {
            if (dates.get(i).equals(check)) { currentStreak++; check = check.minusDays(1); }
            else break;
        }

        int longestStreak = 0, running = 0;
        LocalDate prev = null;
        for (LocalDate d : dates) {
            running = (prev == null || d.equals(prev.plusDays(1))) ? running + 1 : 1;
            longestStreak = Math.max(longestStreak, running);
            prev = d;
        }

        long proofVerified = sessions.stream()
                .filter(a -> a.getProofLink() != null && !a.getProofLink().isBlank()).count();
        double proofRate = sessions.isEmpty() ? 0
                : Math.round(((double) proofVerified / sessions.size()) * 100);

        // Tag analysis
        Map<String, Integer> tagMap = new LinkedHashMap<>();
        for (ProblemEntry p : problems) {
            if (p.getTags() != null && !p.getTags().isBlank()) {
                for (String t : p.getTags().split(",")) {
                    String tag = t.trim();
                    if (!tag.isEmpty()) tagMap.merge(tag, 1, Integer::sum);
                }
            }
        }
        Map<String, Integer> topTags = new LinkedHashMap<>();
        tagMap.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5).forEach(e -> topTags.put(e.getKey(), e.getValue()));

        // Difficulty breakdown
        long easyCount   = problems.stream().filter(p -> "Easy".equals(p.getDifficulty())).count();
        long mediumCount = problems.stream().filter(p -> "Medium".equals(p.getDifficulty())).count();
        long hardCount   = problems.stream().filter(p -> "Hard".equals(p.getDifficulty())).count();

        Map<String, Object> detail = new LinkedHashMap<>();
        detail.put("id",            user.getId());
        detail.put("username",      user.getUsername());
        detail.put("email",         user.getEmail());
        detail.put("currentStreak", currentStreak);
        detail.put("longestStreak", longestStreak);
        detail.put("totalProblems", totalProblems);
        detail.put("totalHours",    totalMinutes / 60);
        detail.put("totalSessions", sessions.size());
        detail.put("totalDaysActive", dates.size());
        detail.put("proofRate",     proofRate);
        detail.put("easyCount",     easyCount);
        detail.put("mediumCount",   mediumCount);
        detail.put("hardCount",     hardCount);
        detail.put("topTags",       topTags);
        detail.put("badges",        badges);
        detail.put("sessions",      sessionList);
        detail.put("freezeCount",   user.getFreezeCount());

        return ResponseEntity.ok(detail);
    }

    // ── GET /api/admin/overview ───────────────────────────────────────────
    // Platform-wide stats for the admin dashboard header
    @GetMapping("/overview")
    public ResponseEntity<?> getOverview() {
        List<User> allUsers = userRepository.findAll();
        long userCount = allUsers.stream()
                .filter(u -> !"ADMIN".equals(u.getRole())).count();

        List<Activity> allSessions = activityRepository.findAll();
        int totalProblems = allSessions.stream()
                .mapToInt(Activity::getProblemsSolved).sum();

        long totalBadges = badgeRepository.count();

        long activeToday = allSessions.stream()
                .filter(a -> a.getDate().equals(LocalDate.now()))
                .map(Activity::getUserId).distinct().count();

        long verifiedSessions = allSessions.stream()
                .filter(a -> a.getProofLink() != null && !a.getProofLink().isBlank()).count();

        Map<String, Object> overview = new LinkedHashMap<>();
        overview.put("totalUsers",        userCount);
        overview.put("totalSessions",     allSessions.size());
        overview.put("totalProblems",     totalProblems);
        overview.put("totalBadges",       totalBadges);
        overview.put("activeToday",       activeToday);
        overview.put("verifiedSessions",  verifiedSessions);

        return ResponseEntity.ok(overview);
    }

    // ── DELETE /api/admin/users/{userId} ──────────────────────────────────
    // Admin can delete a user and all their data
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        if ("ADMIN".equals(user.getRole()))
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Cannot delete admin account"));

        // Delete all user data
        List<Activity> sessions = activityRepository
                .findByUserIdOrderByDateAscIdAsc(userId);
        for (Activity s : sessions) {
            problemEntryRepository.deleteByActivityId(s.getId());
        }
        activityRepository.deleteAll(sessions);
        badgeRepository.deleteAll(badgeRepository.findByUserIdOrderByEarnedOnDesc(userId));
        goalRepository.findByUserId(userId).ifPresent(goalRepository::delete);
        userRepository.deleteById(userId);

        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}