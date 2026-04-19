package com.codestreak.backend.controller;

import com.codestreak.backend.model.*;
import com.codestreak.backend.repository.*;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final ActivityRepository      activityRepository;
    private final ProblemEntryRepository  problemEntryRepository;
    private final UserRepository          userRepository;
    private final BadgeRepository         badgeRepository;
    private final BadgeService            badgeService;

    // Holds badges awarded during the last stats call (for returning to client)
    private List<Badge> lastNewBadges = new ArrayList<>();

    public StatsController(ActivityRepository activityRepository,
                           ProblemEntryRepository problemEntryRepository,
                           UserRepository userRepository,
                           BadgeRepository badgeRepository,
                           BadgeService badgeService) {
        this.activityRepository     = activityRepository;
        this.problemEntryRepository = problemEntryRepository;
        this.userRepository         = userRepository;
        this.badgeRepository        = badgeRepository;
        this.badgeService           = badgeService;
    }

    public List<Badge> getNewBadges() { return lastNewBadges; }

    @GetMapping("/{userId}")
    public Map<String, Object> getStats(@PathVariable Long userId) {
        List<Activity>     sessions = activityRepository.findByUserIdOrderByDateAscIdAsc(userId);
        List<ProblemEntry> allProbs = problemEntryRepository.findByUserIdOrderByIdDesc(userId);
        User user = userRepository.findById(userId).orElse(null);

        // Totals
        int totalProblems = sessions.stream().mapToInt(Activity::getProblemsSolved).sum();
        int totalMinutes  = sessions.stream().mapToInt(Activity::getTimeSpentMinutes).sum();
        int totalHours    = totalMinutes / 60;

        // Unique active dates
        List<LocalDate> dates = sessions.stream()
                .map(Activity::getDate).distinct().sorted().toList();
        int totalActiveDays = dates.size();

        // Current streak
        int currentStreak = 0;
        LocalDate check = LocalDate.now();
        for (int i = dates.size() - 1; i >= 0; i--) {
            if (dates.get(i).equals(check)) { currentStreak++; check = check.minusDays(1); }
            else break;
        }

        // Longest streak
        int longestStreak = 0, running = 0;
        LocalDate prev = null;
        for (LocalDate d : dates) {
            running = (prev == null || d.equals(prev.plusDays(1))) ? running + 1 : 1;
            longestStreak = Math.max(longestStreak, running);
            prev = d;
        }

        // Today / week
        int todayProblems = sessions.stream()
                .filter(a -> a.getDate().equals(LocalDate.now()))
                .mapToInt(Activity::getProblemsSolved).sum();
        LocalDate weekStart = LocalDate.now().minusDays(6);
        int weekProblems = sessions.stream()
                .filter(a -> !a.getDate().isBefore(weekStart))
                .mapToInt(Activity::getProblemsSolved).sum();

        // Consistency score
        double consistencyScore = 0; String consistencyGrade = "N/A";
        String consistencyMessage = "Log activities to see your score.";
        if (!dates.isEmpty()) {
            long totalDays = ChronoUnit.DAYS.between(dates.get(0), LocalDate.now()) + 1;
            double ws = allProbs.stream().mapToDouble(p -> {
                switch (p.getDifficulty() == null ? "" : p.getDifficulty()) {
                    case "Hard": return 3.0; case "Medium": return 2.0;
                    case "Easy": return 1.0; default: return 1.5;
                }
            }).sum();
            consistencyScore = Math.min(100, Math.round((ws / (totalDays * 2.0)) * 100));
            if      (consistencyScore >= 80) { consistencyGrade = "S"; consistencyMessage = "Outstanding consistency. You are in the top tier."; }
            else if (consistencyScore >= 60) { consistencyGrade = "A"; consistencyMessage = "Strong consistency. Keep pushing harder problems."; }
            else if (consistencyScore >= 40) { consistencyGrade = "B"; consistencyMessage = "Good start. Try solving more Medium and Hard problems."; }
            else if (consistencyScore >= 20) { consistencyGrade = "C"; consistencyMessage = "Building up. Aim for daily activity."; }
            else                             { consistencyGrade = "D"; consistencyMessage = "Just getting started. Log daily to improve."; }
        }

        // Streak risk
        boolean hasToday = dates.contains(LocalDate.now());
        String riskLevel = "NONE", riskMessage = "";
        if (!hasToday && currentStreak > 0) {
            int hour = LocalTime.now().getHour();
            OptionalDouble avg = sessions.stream()
                    .filter(a -> a.getLogHour() != null).mapToInt(Activity::getLogHour).average();
            if (avg.isPresent()) {
                int late = hour - (int) avg.getAsDouble();
                if      (late >= 4)  { riskLevel = "HIGH";   riskMessage = "You usually log around " + fmt(hour - late) + ". It is now " + fmt(hour) + ". Your streak is at serious risk."; }
                else if (late >= 2)  { riskLevel = "MEDIUM"; riskMessage = "You have not logged today yet. Do not break your streak."; }
                else if (hour >= 20) { riskLevel = "LOW";    riskMessage = "It is getting late. Remember to log before midnight."; }
            } else {
                if      (hour >= 22) { riskLevel = "HIGH";   riskMessage = "It is " + fmt(hour) + ". Your streak breaks at midnight. Log now."; }
                else if (hour >= 18) { riskLevel = "MEDIUM"; riskMessage = "Evening reminder: you have not logged today."; }
            }
        }

        // Freeze economy
        int freezeCount = user != null ? user.getFreezeCount() : 0;
        if (user != null && currentStreak > 0 && currentStreak % 7 == 0) {
            int milestones = currentStreak / 7;
            if (milestones > user.getTotalFreezeEarned()) {
                user.setFreezeCount(user.getFreezeCount() + 1);
                user.setTotalFreezeEarned(milestones);
                userRepository.save(user);
                freezeCount = user.getFreezeCount();
            }
        }

        // Habit pattern
        String codingTime = "Not enough data", codingPattern = "Unknown", habitInsight = "";
        if (!sessions.isEmpty()) {
            long mo = sessions.stream().filter(a -> a.getLogHour() != null && a.getLogHour() >= 5  && a.getLogHour() <= 11).count();
            long af = sessions.stream().filter(a -> a.getLogHour() != null && a.getLogHour() >= 12 && a.getLogHour() <= 16).count();
            long ev = sessions.stream().filter(a -> a.getLogHour() != null && a.getLogHour() >= 17 && a.getLogHour() <= 20).count();
            long ni = sessions.stream().filter(a -> a.getLogHour() != null && (a.getLogHour() >= 21 || a.getLogHour() <= 4)).count();
            long mx = Math.max(Math.max(mo, af), Math.max(ev, ni));
            if (mx > 0) {
                if (mx == mo) codingTime = "Morning Coder (5am-11am)";
                else if (mx == af) codingTime = "Afternoon Coder (12pm-4pm)";
                else if (mx == ev) codingTime = "Evening Coder (5pm-8pm)";
                else codingTime = "Night Coder (9pm-4am)";
            }
            long wknd = dates.stream().filter(d -> d.getDayOfWeek() == DayOfWeek.SATURDAY || d.getDayOfWeek() == DayOfWeek.SUNDAY).count();
            double wr = dates.isEmpty() ? 0 : (double) wknd / dates.size();
            if (wr >= 0.6) codingPattern = "Weekend Warrior";
            else if (wr <= 0.25) codingPattern = "Weekday Grinder";
            else codingPattern = "Consistent All-Week Coder";
            habitInsight = "You are a " + codingPattern + ". You prefer coding in the "
                    + codingTime.split(" ")[0].toLowerCase() + ".";
        }

        // Day of week map
        Map<String, Integer> dowMap = new LinkedHashMap<>();
        for (String d : new String[]{"MON","TUE","WED","THU","FRI","SAT","SUN"}) dowMap.put(d, 0);
        for (Activity a : sessions) dowMap.merge(a.getDate().getDayOfWeek().name().substring(0,3), a.getProblemsSolved(), Integer::sum);
        String bestDay = dowMap.entrySet().stream().max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse("N/A");

        // Tag analysis
        Map<String, Integer> tagMap = new LinkedHashMap<>();
        for (ProblemEntry p : allProbs) {
            if (p.getTags() != null && !p.getTags().isBlank()) {
                for (String t : p.getTags().split(",")) {
                    String tag = t.trim();
                    if (!tag.isEmpty()) tagMap.merge(tag, 1, Integer::sum);
                }
            }
        }
        Map<String, Integer> topTags = new LinkedHashMap<>();
        tagMap.entrySet().stream().sorted(Map.Entry.<String,Integer>comparingByValue().reversed())
              .limit(8).forEach(e -> topTags.put(e.getKey(), e.getValue()));

        // Difficulty breakdown
        long easyCount   = allProbs.stream().filter(p -> "Easy".equals(p.getDifficulty())).count();
        long mediumCount = allProbs.stream().filter(p -> "Medium".equals(p.getDifficulty())).count();
        long hardCount   = allProbs.stream().filter(p -> "Hard".equals(p.getDifficulty())).count();

        // Proof stats
        long proofVerified = sessions.stream().filter(a -> a.getProofLink() != null && !a.getProofLink().isBlank()).count();
        double proofRate   = sessions.isEmpty() ? 0 : Math.round(((double) proofVerified / sessions.size()) * 100);

        // Efficiency
        double efficiency = totalMinutes > 0 ? Math.round(((double) totalProblems / totalMinutes * 60) * 10) / 10.0 : 0;

        // Badges: check and award
        lastNewBadges = badgeService.checkAndAward(userId, currentStreak, longestStreak,
                totalProblems, totalActiveDays, hardCount, proofVerified, new ArrayList<>());
        List<Badge> allBadges = badgeRepository.findByUserIdOrderByEarnedOnDesc(userId);

        // Build response
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("currentStreak",      currentStreak);
        stats.put("longestStreak",       longestStreak);
        stats.put("totalProblems",       totalProblems);
        stats.put("totalHours",          totalHours);
        stats.put("todayProblems",       todayProblems);
        stats.put("weekProblems",        weekProblems);
        stats.put("totalActiveDays",     totalActiveDays);
        stats.put("totalActivities",     sessions.size());
        stats.put("consistencyScore",    consistencyScore);
        stats.put("consistencyGrade",    consistencyGrade);
        stats.put("consistencyMessage",  consistencyMessage);
        stats.put("riskLevel",           riskLevel);
        stats.put("riskMessage",         riskMessage);
        stats.put("freezeCount",         freezeCount);
        stats.put("nextFreezeIn",        currentStreak > 0 ? (7 - (currentStreak % 7)) : 7);
        stats.put("codingTime",          codingTime);
        stats.put("codingPattern",       codingPattern);
        stats.put("habitInsight",        habitInsight);
        stats.put("dayOfWeekMap",        dowMap);
        stats.put("bestDay",             bestDay);
        stats.put("efficiency",          efficiency);
        stats.put("proofRate",           proofRate);
        stats.put("proofVerified",       proofVerified);
        stats.put("topTags",             topTags);
        stats.put("easyCount",           easyCount);
        stats.put("mediumCount",         mediumCount);
        stats.put("hardCount",           hardCount);
        stats.put("badges",              allBadges);
        stats.put("newBadges",           lastNewBadges);
        return stats;
    }

    // Public profile endpoint — no auth needed
    @GetMapping("/public/{username}")
    public Map<String, Object> getPublicProfile(@PathVariable String username) {
        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return Map.of("error", "User not found");
        User user = userOpt.get();
        if (!user.isPublicProfile()) return Map.of("error", "Profile is private");
        Map<String, Object> profile = getStats(user.getId());
        profile.put("username", user.getUsername());
        return profile;
    }

    // Use freeze endpoint
    @PostMapping("/{userId}/use-freeze")
    public Map<String, Object> useFreeze(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getFreezeCount() > 0) {
            user.setFreezeCount(user.getFreezeCount() - 1);
            userRepository.save(user);
            return Map.of("success", true, "message", "Freeze used. Streak protected.", "freezeCount", user.getFreezeCount());
        }
        return Map.of("success", false, "message", "No freezes available.", "freezeCount", 0);
    }

    private String fmt(int h) {
        if (h == 0) return "12:00 AM"; if (h < 12) return h + ":00 AM";
        if (h == 12) return "12:00 PM"; return (h - 12) + ":00 PM";
    }
}