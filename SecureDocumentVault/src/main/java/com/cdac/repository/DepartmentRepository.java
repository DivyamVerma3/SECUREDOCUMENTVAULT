package com.cdac.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.Department;

public interface DepartmentRepository
        extends JpaRepository<Department, Integer> {

    Department findByDepartmentName(String departmentName);
}