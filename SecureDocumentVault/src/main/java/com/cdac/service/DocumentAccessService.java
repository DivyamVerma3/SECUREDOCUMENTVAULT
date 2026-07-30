package com.cdac.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.cdac.entity.Department;
import com.cdac.entity.DepartmentDocumentAccess;
import com.cdac.entity.Document;
import com.cdac.entity.DocumentAccess;
import com.cdac.entity.User;
import com.cdac.exception.ResourceNotFoundException;
import com.cdac.repository.DepartmentDocumentAccessRepository;
import com.cdac.repository.DepartmentRepository;
import com.cdac.repository.DocumentAccessRepository;
import com.cdac.repository.DocumentRepository;
import com.cdac.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class DocumentAccessService {

    @Autowired
    private DocumentAccessRepository documentAccessRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DepartmentDocumentAccessRepository departmentDocumentAccessRepository;
    
    @Autowired
    private AuditService auditService;

    public String grantAccess(Integer documentId, Integer userId) {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Document Not Found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User grantedBy = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Logged-in User Not Found"));

        if (documentAccessRepository
                .findByDocumentAndUser(document, user)
                .isPresent()) {

            return "Access Already Granted";
        }

        DocumentAccess access = new DocumentAccess();

        access.setDocument(document);
        access.setUser(user);
        access.setGrantedBy(grantedBy);
        access.setCanView(true);
        access.setCanDownload(true);
        access.setCreatedAt(LocalDateTime.now());

        documentAccessRepository.save(access);
        auditService.log(
                grantedBy.getEmail(),
                "USER_ACCESS_GRANTED",
                document.getFileName());

        return "Access Granted Successfully";
    }

    public String grantAccessToDepartment(
            Integer documentId,
            Integer departmentId) {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Document Not Found"));

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department Not Found"));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User grantedBy = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Logged-in User Not Found"));

        if (departmentDocumentAccessRepository
                .findByDocumentAndDepartment(document, department)
                .isPresent()) {

            return "Department Access Already Granted";
        }

        DepartmentDocumentAccess departmentAccess =
                new DepartmentDocumentAccess();

        departmentAccess.setDocument(document);
        departmentAccess.setDepartment(department);
        departmentAccess.setGrantedBy(grantedBy);
        departmentAccess.setCanView(true);
        departmentAccess.setCanDownload(true);
        departmentAccess.setCreatedAt(LocalDateTime.now());

        departmentDocumentAccessRepository.save(departmentAccess);
        auditService.log(
                grantedBy.getEmail(),
                "DEPARTMENT_ACCESS_GRANTED",
                department.getDepartmentName()
                        + " -> "
                        + document.getFileName());

        List<User> users =
                userRepository.findByDepartment(department);

        int count = 0;

        for (User user : users) {

            if (documentAccessRepository
                    .findByDocumentAndUser(document, user)
                    .isPresent()) {
                continue;
            }

            DocumentAccess access = new DocumentAccess();

            access.setDocument(document);
            access.setUser(user);
            access.setGrantedBy(grantedBy);
            access.setCanView(true);
            access.setCanDownload(true);
            access.setCreatedAt(LocalDateTime.now());

            documentAccessRepository.save(access);

            count++;
        }

        return "Access Granted To Department Successfully. Users Added: " + count;
    }

    @Transactional
    public String revokeAccess(Integer documentId, Integer userId) {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Document Not Found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));

        documentAccessRepository.deleteByDocumentAndUser(document, user);
        auditService.log(
                user.getEmail(),
                "USER_ACCESS_REVOKED",
                document.getFileName());

        return "Access Revoked Successfully";
    }

    @Transactional
    public String revokeAccessFromDepartment(
            Integer documentId,
            Integer departmentId) {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Document Not Found"));

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department Not Found"));

        List<User> users =
                userRepository.findByDepartment(department);

        int count = 0;

        for (User user : users) {

            if (documentAccessRepository
                    .findByDocumentAndUser(document, user)
                    .isPresent()) {

                documentAccessRepository.deleteByDocumentAndUser(
                        document,
                        user);

                count++;
            }
        }

        departmentDocumentAccessRepository
                .deleteByDocumentAndDepartment(document, department);
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        auditService.log(
                email,
                "DEPARTMENT_ACCESS_REVOKED",
                department.getDepartmentName()
                        + " -> "
                        + document.getFileName());

        return "Department Access Revoked Successfully. Users Removed: " + count;
    }

    public List<DocumentAccess> getAllAccessRecords() {
        return documentAccessRepository.findAll();
    }

    public List<DepartmentDocumentAccess> getAllDepartmentAccessRecords() {
        return departmentDocumentAccessRepository.findAll();
    }

    public List<DocumentAccess> getMySharedDocuments() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));

        return documentAccessRepository.findByUser(user);
    }
}