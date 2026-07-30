package com.cdac.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cdac.entity.AuditLog;
import com.cdac.entity.Document;
import com.cdac.entity.User;
import com.cdac.service.AdminService;
import com.cdac.service.AuditService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {


@Autowired
private AdminService adminService;

@Autowired
private AuditService auditService;

// ===========================
// Get All Users
// ===========================
@GetMapping("/users")
public List<User> getUsers() {
    return adminService.getAllUsers();
}

// ===========================
// Get All Documents
// ===========================
@GetMapping("/documents")
public List<Document> getDocuments() {
    return adminService.getAllDocuments();
}

// ===========================
// Delete User
// ===========================
@DeleteMapping("/users/{id}")
public String deleteUser(@PathVariable Integer id) {
    return adminService.deleteUser(id);
}
//===========================
//Update User Role
//===========================
@PutMapping("/users/{id}/role")
public String updateRole(
     @PathVariable Integer id,
     @RequestParam String roleName) {

 return adminService.updateUserRole(
         id,roleName);
}

// ===========================
// Delete Document
// ===========================
@DeleteMapping("/documents/{id}")
public String deleteDocument(@PathVariable Integer id) {
    return adminService.deleteDocument(id);
}

// ===========================
// View Audit Logs
// ===========================
@GetMapping("/audit-logs")
public List<AuditLog> getAuditLogs() {
    return auditService.getAllLogs();
}
//===========================
//Assign Department
//===========================
@PutMapping("/users/{id}/department")
public String assignDepartment(
        @PathVariable Integer id,
        @RequestParam Integer departmentId) {

    return adminService.assignDepartment(id, departmentId);
}


}
