package com.codestreak.backend.security;

import com.codestreak.backend.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository ur;
    public UserDetailsServiceImpl(UserRepository ur) { this.ur = ur; }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = ur.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Not found: " + username));
        return new User(user.getUsername(), user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
    }
}