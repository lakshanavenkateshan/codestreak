package com.codestreak.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "badges")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String badgeKey;   // e.g. FIRST_FLAME, WEEK_WARRIOR

    private String badgeName;  // e.g. "Week Warrior"
    private String description;
    private LocalDate earnedOn;

    public Badge() {}

    public Badge(Long userId, String badgeKey, String badgeName,
                 String description, LocalDate earnedOn) {
        this.userId      = userId;
        this.badgeKey    = badgeKey;
        this.badgeName   = badgeName;
        this.description = description;
        this.earnedOn    = earnedOn;
    }

    public Long      getId()          { return id; }
    public void      setId(Long v)    { this.id = v; }
    public Long      getUserId()      { return userId; }
    public void      setUserId(Long v){ this.userId = v; }
    public String    getBadgeKey()    { return badgeKey; }
    public void      setBadgeKey(String v){ this.badgeKey = v; }
    public String    getBadgeName()   { return badgeName; }
    public void      setBadgeName(String v){ this.badgeName = v; }
    public String    getDescription() { return description; }
    public void      setDescription(String v){ this.description = v; }
    public LocalDate getEarnedOn()    { return earnedOn; }
    public void      setEarnedOn(LocalDate v){ this.earnedOn = v; }
}