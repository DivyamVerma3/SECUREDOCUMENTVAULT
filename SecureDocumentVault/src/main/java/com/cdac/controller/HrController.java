package com.cdac.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cdac.dto.CreateEmployeeRequest;
import com.cdac.entity.Document;
import com.cdac.entity.User;
import com.cdac.service.DocumentService;
import com.cdac.service.HrService;
import com.cdac.entity.Department;


@RestController
@RequestMapping("/api/hr")
public class HrController {


    @Autowired
    private HrService hrService;
    
    @Autowired
    private DocumentService documentService;



    // ==================================================
    // Create Employee
    // ==================================================

    @PostMapping("/employees")
    public String createEmployee(
            @RequestBody CreateEmployeeRequest request) {

        return hrService.createEmployee(request);
    }





    // ==================================================
    // View All Users
    // ==================================================

    @GetMapping("/users")
    public List<User> getAllUsers() {

        return hrService.getAllUsers();
    }





    // ==================================================
    // Search Users
    // ==================================================

    @GetMapping("/users/search")
    public List<User> searchUsers(
            @RequestParam String keyword) {

        return hrService.searchUsers(keyword);
    }





    // ==================================================
    // Delete User
    // ==================================================

    @DeleteMapping("/users/{id}")
    public String deleteUser(
            @PathVariable Integer id) {

        return hrService.deleteUser(id);
    }





    // ==================================================
    // Assign Role
    // ==================================================

    @PutMapping("/users/{id}/role")
    public String assignRole(
            @PathVariable Integer id,
            @RequestParam String roleName) {

        return hrService.assignRole(id, roleName);
    }





    // ==================================================
    // Assign Department
    // ==================================================

    @PutMapping("/users/{id}/department")
    public String assignDepartment(
            @PathVariable Integer id,
            @RequestParam Integer departmentId) {

        return hrService.assignDepartment(id, departmentId);
    }





    // ==================================================
    // HR Document Management
    // ==================================================


    // View All Documents

    @GetMapping("/documents")
    public List<Document> getAllDocuments() {

        return hrService.getAllDocuments();
    }





    // Search Documents

    @GetMapping("/documents/search")
    public List<Document> searchDocuments(
            @RequestParam String keyword) {

        return hrService.searchDocuments(keyword);
    }





    // Delete Document

    @DeleteMapping("/documents/{id}")
    public String deleteDocument(
            @PathVariable Integer id) {

        return documentService.deleteDocument(id);
    }
	 // ==================================================
	 // Department Management
	 // ==================================================
	
	
	 // View Departments
	
	 @GetMapping("/departments")
	 public List<Department> getDepartments(){
	
	     return hrService.getAllDepartments();
	 }
	
	
	
	
	 // Add Department
	
	 @PostMapping("/departments")
	 public String addDepartment(
	         @RequestParam String departmentName){
	
	     return hrService.addDepartment(departmentName);
	 }
	
	
	
	
	 // Update Department
	
	 @PutMapping("/departments/{id}")
	 public String updateDepartment(
	         @PathVariable Integer id,
	         @RequestParam String departmentName){
	
	     return hrService.updateDepartment(
	             id,
	             departmentName);
	 }
	
	
	
	
	 // Delete Department
	
	 @DeleteMapping("/departments/{id}")
	 public String deleteDepartment(
	         @PathVariable Integer id){
	
	     return hrService.deleteDepartment(id);
	 }
}