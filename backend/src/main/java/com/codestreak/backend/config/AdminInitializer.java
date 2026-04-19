package com.codestreak.backend.config;

import com.codestreak.backend.model.User;
import com.codestreak.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    public CommandLineRunner createAdminUser(UserRepository userRepository,
                                             PasswordEncoder passwordEncoder) {
        return args -> {
            // Create admin only if it does not already exist
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@codestreak.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("==============================================");
                System.out.println("  Admin account created.");
                System.out.println("  Username : admin");
                System.out.println("  Password : admin123");
                System.out.println("  Change this password in production!");
                System.out.println("==============================================");
            }
        };
    }
}