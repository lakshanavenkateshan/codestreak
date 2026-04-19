package com.codestreak.backend.controller;

import com.codestreak.backend.model.User;
import com.codestreak.backend.repository.UserRepository;
import com.codestreak.backend.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils              jwtUtils;

    public AuthController(UserRepository ur, PasswordEncoder pe,
                          AuthenticationManager am, JwtUtils jwt) {
        this.userRepository        = ur;
        this.passwordEncoder       = pe;
        this.authenticationManager = am;
        this.jwtUtils              = jwt;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email    = body.get("email");
        String password = body.get("password");

        if (userRepository.existsByUsername(username))
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username already taken"));
        if (userRepository.existsByEmail(email))
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already registered"));

        User user = User.builder()
                .username(username).email(email)
                .password(passwordEncoder.encode(password))
                .role("USER").build();
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "token",    jwtUtils.generateToken(username),
                "userId",   user.getId(),
                "username", user.getUsername(),
                "role",     user.getRole()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));
            User user = userRepository.findByUsername(username).orElseThrow();
            return ResponseEntity.ok(Map.of(
                    "token",    jwtUtils.generateToken(username),
                    "userId",   user.getId(),
                    "username", user.getUsername(),
                    "role",     user.getRole()
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid username or password"));
        }
    }
}