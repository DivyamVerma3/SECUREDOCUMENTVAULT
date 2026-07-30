package com.cdac.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cdac.entity.Department;
import com.cdac.service.DepartmentService;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    // ===========================
    // Get All Departments
    // ===========================
    @GetMapping
    public List<Department> getDepartments() {
        return departmentService.getAllDepartments();
    }

    // ===========================
    // Create Department
    // ===========================
    @PostMapping
    public String createDepartment(
            @RequestBody Department department) {

        return departmentService.createDepartment(department);
    }

    // ===========================
    // Update Department
    // ===========================
    @PutMapping("/{id}")
    public String updateDepartment(
            @PathVariable Integer id,
            @RequestBody Department department) {

        return departmentService.updateDepartment(id, department);
    }

    // ===========================
    // Delete Department
    // ===========================
    @DeleteMapping("/{id}")
    public String deleteDepartment(
            @PathVariable Integer id) {

        return departmentService.deleteDepartment(id);
    }
}