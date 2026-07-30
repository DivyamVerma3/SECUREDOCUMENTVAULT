package com.cdac.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cdac.dto.CreateEmployeeRequest;
import com.cdac.entity.Department;
import com.cdac.entity.Document;
import com.cdac.entity.Role;
import com.cdac.entity.User;
import com.cdac.exception.ResourceNotFoundException;
import com.cdac.repository.DepartmentRepository;
import com.cdac.repository.RoleRepository;
import com.cdac.repository.UserRepository;


@Service
public class HrService {


    @Autowired
    private UserRepository userRepository;


    @Autowired
    private RoleRepository roleRepository;


    @Autowired
    private DepartmentRepository departmentRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private AuditService auditService;


    @Autowired
    private DocumentService documentService;



    // ==================================================
    // Create Employee
    // ==================================================

    public String createEmployee(CreateEmployeeRequest request) {


        if (userRepository.findByEmail(request.getEmail()).isPresent()) {

            throw new RuntimeException(
                    "Email already exists");
        }



        Role role =
                roleRepository.findByRoleName(
                        request.getRoleName());



        if (role == null) {

            throw new ResourceNotFoundException(
                    "Role Not Found");
        }



        if (role.getRoleName().equals("ADMIN")) {

            throw new RuntimeException(
                    "HR cannot create ADMIN users");
        }




        Department department;



        if (role.getRoleName().equals("HR")) {


            department =
                    departmentRepository
                    .findByDepartmentName("HR");


        } else {


            department =
                    departmentRepository
                    .findById(request.getDepartmentId())
                    .orElseThrow(() ->
                    new ResourceNotFoundException(
                    "Department Not Found"));



            if (department.getDepartmentName()
                    .equals("Administration")) {


                throw new RuntimeException(
                "HR cannot assign Administration department");
            }

        }




        User user = new User();


        user.setUsername(request.getUsername());

        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                request.getPassword()));

        user.setDepartment(department);

        user.setRole(role);



        userRepository.save(user);



        auditService.log(
                request.getEmail(),
                "EMPLOYEE_CREATED",
                "Employee created by HR/Admin");



        return "Employee Created Successfully";
    }





    // ==================================================
    // Get All Users
    // ==================================================

    public List<User> getAllUsers() {

        return userRepository.findAll();

    }





    // ==================================================
    // Search Users
    // ==================================================

    public List<User> searchUsers(String keyword) {

        return userRepository
                .findByUsernameContainingIgnoreCase(keyword);

    }





    // ==================================================
    // Delete User
    // ==================================================

    public String deleteUser(Integer id) {


        User user =
                userRepository.findById(id)
                .orElseThrow(() ->
                new ResourceNotFoundException(
                "User Not Found"));



        String role =
                user.getRole()
                .getRoleName();



        if(role.equals("ADMIN") ||
           role.equals("HR")) {


            throw new RuntimeException(
            "HR cannot delete ADMIN or HR users");
        }



        userRepository.delete(user);



        auditService.log(
                user.getEmail(),
                "USER_DELETED",
                "User deleted by HR/Admin");



        return "User Deleted Successfully";
    }





    // ==================================================
    // Assign Role
    // ==================================================

    public String assignRole(
            Integer id,
            String roleName) {



        User user =
                userRepository.findById(id)
                .orElseThrow(() ->
                new ResourceNotFoundException(
                "User Not Found"));



        Role role =
                roleRepository
                .findByRoleName(roleName);



        if(role == null) {

            throw new ResourceNotFoundException(
                    "Role Not Found");
        }



        if(roleName.equals("ADMIN")) {

            throw new RuntimeException(
                    "HR cannot assign ADMIN role");
        }



        user.setRole(role);


        userRepository.save(user);



        auditService.log(
                user.getEmail(),
                "ROLE_ASSIGNED",
                "Role changed to " + roleName);



        return "Role Updated Successfully";
    }





    // ==================================================
    // Assign Department
    // ==================================================

    public String assignDepartment(
            Integer id,
            Integer departmentId) {



        User user =
                userRepository.findById(id)
                .orElseThrow(() ->
                new ResourceNotFoundException(
                "User Not Found"));



        Department department =
                departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                new ResourceNotFoundException(
                "Department Not Found"));



        if(department.getDepartmentName()
                .equals("Administration")) {


            throw new RuntimeException(
            "HR cannot assign Administration department");

        }



        user.setDepartment(department);



        userRepository.save(user);



        auditService.log(
                user.getEmail(),
                "DEPARTMENT_ASSIGNED",
                "Department changed to "
                + department.getDepartmentName());



        return "Department Updated Successfully";
    }





    // ==================================================
    // HR Document Management
    // ==================================================


    // View All Documents

    public List<Document> getAllDocuments(){

        return documentService.getAllDocuments();

    }




    // Search Documents

    public List<Document> searchDocuments(String keyword){

        return documentService.searchDocuments(keyword);

    }




    // Delete Document

    public String deleteDocument(Integer id){

        return documentService.deleteDocument(id);

    }
	 // ==================================================
	 // Get All Departments
	 // ==================================================
	
	 public List<Department> getAllDepartments(){
	
	     return departmentRepository.findAll();
	
	 }
	
	
	
	
	 // ==================================================
	 // Add Department
	 // ==================================================
	
	 public String addDepartment(String departmentName){
	
	
	     Department existing =
	             departmentRepository
	             .findByDepartmentName(departmentName);
	
	
	
	     if(existing != null){
	
	         throw new RuntimeException(
	                 "Department already exists");
	     }
	
	
	
	     Department department =
	             new Department();
	
	
	     department.setDepartmentName(
	             departmentName);
	
	
	
	     departmentRepository.save(department);
	
	
	
	     auditService.log(
	             departmentName,
	             "DEPARTMENT_CREATED",
	             "Department created by HR/Admin");
	
	
	
	     return "Department Added Successfully";
	 }
	
	
	
	
	 // ==================================================
	 // Update Department
	 // ==================================================
	
	 public String updateDepartment(
	         Integer id,
	         String departmentName){
	
	
	     Department department =
	             departmentRepository.findById(id)
	             .orElseThrow(() ->
	             new ResourceNotFoundException(
	             "Department Not Found"));
	
	
	
	     department.setDepartmentName(
	             departmentName);
	
	
	
	     departmentRepository.save(department);
	
	
	
	     auditService.log(
	             departmentName,
	             "DEPARTMENT_UPDATED",
	             "Department updated by HR/Admin");
	
	
	
	     return "Department Updated Successfully";
	 }
	
	
	
	
	 // ==================================================
	 // Delete Department
	 // ==================================================
	
	 public String deleteDepartment(Integer id){
	
	
	     Department department =
	             departmentRepository.findById(id)
	             .orElseThrow(() ->
	             new ResourceNotFoundException(
	             "Department Not Found"));
	
	
	
	     if(department.getDepartmentName()
	             .equals("Administration")){
	
	
	         throw new RuntimeException(
	         "Cannot delete Administration department");
	
	     }
	
	
	
	     departmentRepository.delete(department);
	
	
	
	     auditService.log(
	             department.getDepartmentName(),
	             "DEPARTMENT_DELETED",
	             "Department deleted by HR/Admin");
	
	
	
	     return "Department Deleted Successfully";
	 }

}