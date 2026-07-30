package com.cdac.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.entity.Department;
import com.cdac.exception.ResourceNotFoundException;
import com.cdac.repository.DepartmentRepository;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    // ===========================
    // Get All Departments
    // ===========================
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // ===========================
    // Create Department
    // ===========================
    public String createDepartment(Department department) {

        if (departmentRepository.findByDepartmentName(
                department.getDepartmentName()) != null) {

            throw new RuntimeException("Department already exists");
        }

        departmentRepository.save(department);

        return "Department Created Successfully";
    }

    // ===========================
    // Update Department
    // ===========================
    public String updateDepartment(
            Integer id,
            Department updatedDepartment) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department Not Found"));

        department.setDepartmentName(updatedDepartment.getDepartmentName());
        department.setDescription(updatedDepartment.getDescription());

        departmentRepository.save(department);

        return "Department Updated Successfully";
    }

    // ===========================
    // Delete Department
    // ===========================
    public String deleteDepartment(Integer id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department Not Found"));

        departmentRepository.delete(department);

        return "Department Deleted Successfully";
    }
}