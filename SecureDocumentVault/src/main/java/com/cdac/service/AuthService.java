package com.cdac.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.cdac.dto.LoginRequest;
import com.cdac.dto.RegisterRequest;
import com.cdac.entity.Role;
import com.cdac.entity.User;
import com.cdac.repository.RoleRepository;
import com.cdac.repository.UserRepository;
import com.cdac.security.JwtUtil;
import com.cdac.dto.ForgotPasswordRequest;

@Service
public class AuthService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditService auditService;

    // REGISTER
    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findByRoleName("USER");

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        userRepository.save(user);

        auditService.log(
                user.getEmail(),
                "REGISTER",
                "User registered successfully");

        return "User Registered Successfully";
    }

    // LOGIN
    public String login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {

            auditService.log(
                    request.getEmail(),
                    "LOGIN_FAILED",
                    "User not found");

            throw new RuntimeException("Invalid Credentials");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            auditService.log(
                    request.getEmail(),
                    "LOGIN_FAILED",
                    "Invalid password");

            throw new RuntimeException("Invalid Credentials");
        }

        auditService.log(
                user.getEmail(),
                "LOGIN_SUCCESS",
                "Login successful");

        return jwtUtil.generateToken(user.getEmail());
    }
    public String logout() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        auditService.log(
                email,
                "LOGOUT",
                "User logged out");

        return "Logout Successful";
    }
    public String forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Email not found"));

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        auditService.log(
                user.getEmail(),
                "FORGOT_PASSWORD",
                "Password reset using forgot password");

        return "Password Reset Successfully";
    }
}