package com.cdac.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cdac.entity.DocumentAccess;
import com.cdac.service.DocumentAccessService;
import com.cdac.entity.DepartmentDocumentAccess;

@RestController
@RequestMapping("/api/access")
public class DocumentAccessController {

    @Autowired
    private DocumentAccessService documentAccessService;

    @PostMapping("/grant")
    public String grantAccess(
            @RequestParam Integer documentId,
            @RequestParam Integer userId) {

        return documentAccessService.grantAccess(documentId, userId);
    }

    @DeleteMapping("/revoke")
    public String revokeAccess(
            @RequestParam Integer documentId,
            @RequestParam Integer userId) {

        return documentAccessService.revokeAccess(documentId, userId);
    }

    @GetMapping
    public List<DocumentAccess> getAllAccessRecords() {

        return documentAccessService.getAllAccessRecords();
    }

    @GetMapping("/my")
    public List<DocumentAccess> getMySharedDocuments() {

        return documentAccessService.getMySharedDocuments();
    }
    @GetMapping("/all")
    public List<DocumentAccess> getAllAccess() {
        return documentAccessService.getAllAccessRecords();
    }
    @PostMapping("/grant-department")
    public String grantAccessToDepartment(
            @RequestParam Integer documentId,
            @RequestParam Integer departmentId) {

        return documentAccessService.grantAccessToDepartment(
                documentId,
                departmentId);
    }
    @DeleteMapping("/revoke-department")
    public String revokeAccessFromDepartment(
            @RequestParam Integer documentId,
            @RequestParam Integer departmentId) {

        return documentAccessService.revokeAccessFromDepartment(
                documentId,
                departmentId);
    }
    @GetMapping("/department/all")
    public List<DepartmentDocumentAccess> getAllDepartmentAccess() {

        return documentAccessService.getAllDepartmentAccessRecords();
    }
}