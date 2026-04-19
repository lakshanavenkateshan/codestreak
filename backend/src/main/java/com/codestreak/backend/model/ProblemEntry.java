package com.codestreak.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "problem_entries")
public class ProblemEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long activityId;

    @Column(nullable = false)
    private Long userId;

    private String problemName;
    private String problemLink;
    private String platform;
    private String difficulty;
    private int    timeSpentMinutes;
    private String tags;
    private String notes;
    private String status;  // SOLVED, ATTEMPTED, REVISIT

    public ProblemEntry() {}

    public Long   getId()                      { return id; }
    public void   setId(Long v)                { this.id = v; }
    public Long   getActivityId()              { return activityId; }
    public void   setActivityId(Long v)        { this.activityId = v; }
    public Long   getUserId()                  { return userId; }
    public void   setUserId(Long v)            { this.userId = v; }
    public String getProblemName()             { return problemName; }
    public void   setProblemName(String v)     { this.problemName = v; }
    public String getProblemLink()             { return problemLink; }
    public void   setProblemLink(String v)     { this.problemLink = v; }
    public String getPlatform()                { return platform; }
    public void   setPlatform(String v)        { this.platform = v; }
    public String getDifficulty()              { return difficulty; }
    public void   setDifficulty(String v)      { this.difficulty = v; }
    public int    getTimeSpentMinutes()        { return timeSpentMinutes; }
    public void   setTimeSpentMinutes(int v)   { this.timeSpentMinutes = v; }
    public String getTags()                    { return tags; }
    public void   setTags(String v)            { this.tags = v; }
    public String getNotes()                   { return notes; }
    public void   setNotes(String v)           { this.notes = v; }
    public String getStatus()                  { return status; }
    public void   setStatus(String v)          { this.status = v; }
}