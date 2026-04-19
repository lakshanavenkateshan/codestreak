package com.codestreak.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    private int dailyProblemTarget  = 3;
    private int weeklyProblemTarget = 15;
    private int dailyMinutesTarget  = 60;

    public Goal() {}

    public Long getId()                      { return id; }
    public void setId(Long v)                { this.id = v; }
    public Long getUserId()                  { return userId; }
    public void setUserId(Long v)            { this.userId = v; }
    public int  getDailyProblemTarget()      { return dailyProblemTarget; }
    public void setDailyProblemTarget(int v) { this.dailyProblemTarget = v; }
    public int  getWeeklyProblemTarget()     { return weeklyProblemTarget; }
    public void setWeeklyProblemTarget(int v){ this.weeklyProblemTarget = v; }
    public int  getDailyMinutesTarget()      { return dailyMinutesTarget; }
    public void setDailyMinutesTarget(int v) { this.dailyMinutesTarget = v; }
}