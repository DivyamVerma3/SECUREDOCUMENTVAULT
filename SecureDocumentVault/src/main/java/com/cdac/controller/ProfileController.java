package com.cdac.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cdac.dto.ChangePasswordRequest;
import com.cdac.entity.User;
import com.cdac.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public User getProfile() {
        return profileService.getProfile();
    }

    @PutMapping("/change-password")
    public String changePassword(
            @RequestBody ChangePasswordRequest request) {

        return profileService.changePassword(request);
    }
}