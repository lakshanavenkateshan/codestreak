package com.codestreak.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String role           = "USER";
    private int    freezeCount    = 0;
    private int    totalFreezeEarned = 0;

    // Public profile toggle
    private boolean publicProfile = true;

    public User() {}

    public Long    getId()                    { return id; }
    public void    setId(Long v)              { this.id = v; }
    public String  getUsername()              { return username; }
    public void    setUsername(String v)      { this.username = v; }
    public String  getEmail()                 { return email; }
    public void    setEmail(String v)         { this.email = v; }
    public String  getPassword()              { return password; }
    public void    setPassword(String v)      { this.password = v; }
    public String  getRole()                  { return role; }
    public void    setRole(String v)          { this.role = v; }
    public int     getFreezeCount()           { return freezeCount; }
    public void    setFreezeCount(int v)      { this.freezeCount = v; }
    public int     getTotalFreezeEarned()     { return totalFreezeEarned; }
    public void    setTotalFreezeEarned(int v){ this.totalFreezeEarned = v; }
    public boolean isPublicProfile()          { return publicProfile; }
    public void    setPublicProfile(boolean v){ this.publicProfile = v; }

    public static UserBuilder builder() { return new UserBuilder(); }

    public static class UserBuilder {
        private Long id;
        private String username, email, password, role = "USER";

        public UserBuilder id(Long v)        { this.id = v; return this; }
        public UserBuilder username(String v){ this.username = v; return this; }
        public UserBuilder email(String v)   { this.email = v; return this; }
        public UserBuilder password(String v){ this.password = v; return this; }
        public UserBuilder role(String v)    { this.role = v; return this; }

        public User build() {
            User u = new User();
            u.id = id; u.username = username; u.email = email;
            u.password = password; u.role = role;
            return u;
        }
    }
}