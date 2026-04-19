package com.codestreak.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDate date;

    // Session label: MORNING / AFTERNOON / EVENING / NIGHT / GENERAL
    private String sessionLabel;

    private int    problemsSolved;
    private int    timeSpentMinutes;
    private String mood;
    private Integer logHour;
    private String proofLink;
    private String proofType;
    private String notes;

    public Activity() {}

    public Long    getId()                 { return id; }
    public void    setId(Long id)          { this.id = id; }
    public Long    getUserId()             { return userId; }
    public void    setUserId(Long v)       { this.userId = v; }
    public LocalDate getDate()             { return date; }
    public void    setDate(LocalDate v)    { this.date = v; }
    public String  getSessionLabel()       { return sessionLabel; }
    public void    setSessionLabel(String v){ this.sessionLabel = v; }
    public int     getProblemsSolved()     { return problemsSolved; }
    public void    setProblemsSolved(int v){ this.problemsSolved = v; }
    public int     getTimeSpentMinutes()   { return timeSpentMinutes; }
    public void    setTimeSpentMinutes(int v){ this.timeSpentMinutes = v; }
    public String  getMood()               { return mood; }
    public void    setMood(String v)       { this.mood = v; }
    public Integer getLogHour()            { return logHour; }
    public void    setLogHour(Integer v)   { this.logHour = v; }
    public String  getProofLink()          { return proofLink; }
    public void    setProofLink(String v)  { this.proofLink = v; }
    public String  getProofType()          { return proofType; }
    public void    setProofType(String v)  { this.proofType = v; }
    public String  getNotes()              { return notes; }
    public void    setNotes(String v)      { this.notes = v; }

    public static ActivityBuilder builder() { return new ActivityBuilder(); }

    public static class ActivityBuilder {
        private Long userId; private LocalDate date; private String sessionLabel;
        private int problemsSolved; private int timeSpentMinutes;
        private String mood; private Integer logHour;
        private String proofLink; private String proofType; private String notes;

        public ActivityBuilder userId(Long v)          { this.userId = v; return this; }
        public ActivityBuilder date(LocalDate v)        { this.date = v; return this; }
        public ActivityBuilder sessionLabel(String v)   { this.sessionLabel = v; return this; }
        public ActivityBuilder problemsSolved(int v)    { this.problemsSolved = v; return this; }
        public ActivityBuilder timeSpentMinutes(int v)  { this.timeSpentMinutes = v; return this; }
        public ActivityBuilder mood(String v)           { this.mood = v; return this; }
        public ActivityBuilder logHour(Integer v)       { this.logHour = v; return this; }
        public ActivityBuilder proofLink(String v)      { this.proofLink = v; return this; }
        public ActivityBuilder proofType(String v)      { this.proofType = v; return this; }
        public ActivityBuilder notes(String v)          { this.notes = v; return this; }

        public Activity build() {
            Activity a = new Activity();
            a.userId = userId; a.date = date; a.sessionLabel = sessionLabel;
            a.problemsSolved = problemsSolved; a.timeSpentMinutes = timeSpentMinutes;
            a.mood = mood; a.logHour = logHour;
            a.proofLink = proofLink; a.proofType = proofType; a.notes = notes;
            return a;
        }
    }
}