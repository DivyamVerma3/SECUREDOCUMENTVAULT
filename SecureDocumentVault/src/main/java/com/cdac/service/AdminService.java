package com.cdac.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.entity.Document;
import com.cdac.entity.User;
import com.cdac.entity.Role;
import com.cdac.exception.ResourceNotFoundException;
import com.cdac.repository.DocumentRepository;
import com.cdac.repository.DocumentVersionRepository;
import com.cdac.repository.UserRepository;
import com.cdac.repository.RoleRepository;
import com.cdac.repository.DocumentAccessRepository;
import jakarta.transaction.Transactional;
import com.cdac.entity.Department;
import com.cdac.repository.DepartmentRepository;
import com.cdac.repository.DepartmentDocumentAccessRepository;

@Service
public class AdminService {
	
	@Autowired
	private RoleRepository roleRepository;
	
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentVersionRepository documentVersionRepository;
    
    @Autowired
    private DocumentAccessRepository documentAccessRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private DepartmentDocumentAccessRepository departmentDocumentAccessRepository;
    
    @Autowired
    private AuditService auditService;
    
    // ===========================
    // Get All Users
    // ===========================
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ===========================
    // Get All Documents
    // ===========================
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    // ===========================
    // Delete User
    // ===========================
    public String deleteUser(Integer id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));

        userRepository.delete(user);

        return "User Deleted Successfully";
    }

    // ===========================
    // Delete Document
    // ===========================
    @Transactional
    public String deleteDocument(Integer id) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Document Not Found"));

        documentAccessRepository.deleteByDocument(document);

        documentVersionRepository.deleteByDocument(document);

        departmentDocumentAccessRepository.deleteByDocument(document);

        return "Document Deleted Successfully";
    }
	 // ===========================
	 // Update User Role
	 // ===========================
	    public String updateUserRole(Integer userId, String roleName) {
	
	        User user = userRepository.findById(userId)
	                .orElseThrow(() ->
	                        new ResourceNotFoundException("User Not Found"));
	
	        Role role = roleRepository.findByRoleName(roleName);
	
	        if (role == null) {
	            throw new ResourceNotFoundException("Role Not Found");
	        }
	
	        user.setRole(role);
	
	        if (roleName.equals("ADMIN")) {
	
	            Department adminDept =
	                    departmentRepository.findByDepartmentName("Administration");
	
	            if (adminDept == null) {
	                throw new RuntimeException("Administration department not found");
	            }
	
	            user.setDepartment(adminDept);
	        }
	
	        if (roleName.equals("HR")) {
	
	            Department hrDept =
	                    departmentRepository.findByDepartmentName("HR");
	
	            if (hrDept == null) {
	                throw new RuntimeException("HR department not found");
	            }
	
	            user.setDepartment(hrDept);
	        }
	
	        userRepository.save(user);
	        auditService.log(
	                user.getEmail(),
	                "ROLE_CHANGED",
	                role.getRoleName());
	
	        return "Role Updated Successfully";
	    }
	 // ===========================
	 // Assign Department
	 // ===========================
	    public String assignDepartment(Integer userId, Integer departmentId) {

	        User user = userRepository.findById(userId)
	                .orElseThrow(() ->
	                        new ResourceNotFoundException("User Not Found"));

	        Department department = departmentRepository.findById(departmentId)
	                .orElseThrow(() ->
	                        new ResourceNotFoundException("Department Not Found"));

	        String roleName = user.getRole().getRoleName();

	        if (roleName.equals("ADMIN") &&
	                !department.getDepartmentName().equals("Administration")) {

	            throw new RuntimeException("ADMIN must belong to Administration department");
	        }

	        if (roleName.equals("HR") &&
	                !department.getDepartmentName().equals("HR")) {

	            throw new RuntimeException("HR must belong to HR department");
	        }

	        user.setDepartment(department);

	        userRepository.save(user);
	        auditService.log(
	                user.getEmail(),
	                "DEPARTMENT_ASSIGNED",
	                department.getDepartmentName());

	        return "Department Assigned Successfully";
	    }

}