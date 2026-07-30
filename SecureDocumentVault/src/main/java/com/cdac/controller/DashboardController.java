package com.cdac.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cdac.dto.DashboardResponse;
import com.cdac.service.DashboardService;



@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {



    @Autowired
    private DashboardService dashboardService;




    // ===========================
    // ADMIN DASHBOARD
    // ===========================

    @GetMapping("/admin")
    public DashboardResponse adminDashboard(){

        return dashboardService.getAdminStats();

    }






    // ===========================
    // HR DASHBOARD
    // ===========================

    @GetMapping("/hr")
    public DashboardResponse hrDashboard(){

        return dashboardService.getHrStats();

    }







    // ===========================
    // MANAGER DASHBOARD
    // ===========================

    @GetMapping("/manager")
    public DashboardResponse managerDashboard(){

        return dashboardService.getManagerStats();

    }







    // ===========================
    // USER DASHBOARD
    // ===========================

    @GetMapping("/user")
    public DashboardResponse userDashboard(){

        return dashboardService.getUserStats();

    }



}