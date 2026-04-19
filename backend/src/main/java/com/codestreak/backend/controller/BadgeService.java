package com.codestreak.backend.controller;

import com.codestreak.backend.model.Badge;
import com.codestreak.backend.model.ProblemEntry;
import com.codestreak.backend.repository.BadgeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BadgeService {

    private final BadgeRepository badgeRepository;

    public BadgeService(BadgeRepository badgeRepository) {
        this.badgeRepository = badgeRepository;
    }

    // Check all badge conditions and award any new ones
    public List<Badge> checkAndAward(Long userId,
                                     int currentStreak,
                                     int longestStreak,
                                     int totalProblems,
                                     int totalActiveDays,
                                     long hardCount,
                                     long proofVerified,
                                     List<ProblemEntry> sessionProblems) {

        List<Badge> newBadges = new ArrayList<>();

        // Badge definitions: key, name, description, condition
        award(userId, "FIRST_FLAME",     "First Flame",       "Logged your very first activity",          totalActiveDays >= 1,          newBadges);
        award(userId, "WEEK_WARRIOR",    "Week Warrior",      "Achieved a 7-day coding streak",           currentStreak >= 7,            newBadges);
        award(userId, "MONTH_MASTER",    "Month Master",      "Achieved a 30-day coding streak",          currentStreak >= 30,           newBadges);
        award(userId, "CENTURY_CODER",   "Century Coder",     "Solved 100 problems total",                totalProblems >= 100,          newBadges);
        award(userId, "PROBLEM_HUNTER",  "Problem Hunter",    "Active on 50 different days",              totalActiveDays >= 50,         newBadges);
        award(userId, "LEGEND",          "Legend",            "Achieved a 365-day coding streak",         currentStreak >= 365,          newBadges);
        award(userId, "HARD_MODE",       "Hard Mode",         "Solved 10 Hard difficulty problems",       hardCount >= 10,               newBadges);
        award(userId, "PROOF_CHAMPION",  "Proof Champion",    "Submitted proof for 30 activities",        proofVerified >= 30,           newBadges);
        award(userId, "FIFTY_DAYS",      "50-Day Streak",     "Maintained a 50-day streak",               currentStreak >= 50,           newBadges);
        award(userId, "CENTURY_STREAK",  "100-Day Streak",    "Maintained a 100-day streak",              currentStreak >= 100,          newBadges);
        award(userId, "CONSISTENT_10",   "10-Day Streak",     "Maintained a 10-day streak",               currentStreak >= 10,           newBadges);
        award(userId, "PROBLEM_50",      "50 Problems",       "Solved 50 problems total",                 totalProblems >= 50,           newBadges);
        award(userId, "PROBLEM_200",     "200 Problems",      "Solved 200 problems total",                totalProblems >= 200,          newBadges);
        award(userId, "SPEED_CODER",     "Speed Coder",       "Solved 5 or more problems in one session", sessionProblems.size() >= 5,   newBadges);
        award(userId, "ACTIVE_30_DAYS",  "30 Days Active",    "Active on 30 different days",              totalActiveDays >= 30,         newBadges);
        award(userId, "ACTIVE_100_DAYS", "100 Days Active",   "Active on 100 different days",             totalActiveDays >= 100,        newBadges);

        return newBadges;
    }

    private void award(Long userId, String key, String name, String desc,
                       boolean condition, List<Badge> newBadges) {
        if (condition && !badgeRepository.existsByUserIdAndBadgeKey(userId, key)) {
            Badge b = new Badge(userId, key, name, desc, LocalDate.now());
            badgeRepository.save(b);
            newBadges.add(b);
        }
    }
}