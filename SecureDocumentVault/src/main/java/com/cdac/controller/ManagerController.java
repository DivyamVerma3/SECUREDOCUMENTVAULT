package com.cdac.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cdac.entity.Document;
import com.cdac.entity.User;
import com.cdac.service.ManagerService;
import com.cdac.entity.Department;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {


    @Autowired
    private ManagerService managerService;

    // Existing mappings...

    @GetMapping("/department")
    public Department getMyDepartment() {

        return managerService.getMyDepartment();

    }
    // ==================================================
    // View Department Users
    // ==================================================

    @GetMapping("/users")
    public List<User> getDepartmentUsers(){

        return managerService.getDepartmentUsers();

    }





    // ==================================================
    // View Department Documents
    // ==================================================

    @GetMapping("/documents")
    public List<Document> getDepartmentDocuments(){

        return managerService.getDepartmentDocuments();

    }






    // ==================================================
    // Search Department Documents
    // ==================================================

    @GetMapping("/documents/search")
    public List<Document> searchDocuments(
            @RequestParam String keyword){

        return managerService.searchDocuments(keyword);

    }






    // ==================================================
    // Delete Department Document
    // ==================================================

    @DeleteMapping("/documents/{id}")
    public String deleteDocument(
            @PathVariable Integer id){

        return managerService.deleteDocument(id);

    }


}