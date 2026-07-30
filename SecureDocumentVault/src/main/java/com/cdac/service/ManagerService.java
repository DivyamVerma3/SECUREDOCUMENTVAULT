package com.cdac.service;


import java.io.File;
import java.util.List;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import com.cdac.entity.Department;
import com.cdac.entity.Document;
import com.cdac.entity.User;
import com.cdac.entity.Role;
import com.cdac.exception.ResourceNotFoundException;
import com.cdac.repository.DepartmentDocumentAccessRepository;
import com.cdac.repository.DocumentAccessRepository;
import com.cdac.repository.DocumentRepository;
import com.cdac.repository.UserRepository;


@Service
public class ManagerService {



    @Autowired
    private UserRepository userRepository;



    @Autowired
    private DocumentRepository documentRepository;



    @Autowired
    private AuditService auditService;
    
    @Autowired
    private DocumentAccessRepository documentAccessRepository;
    
    @Autowired
    private DepartmentDocumentAccessRepository departmentDocumentAccessRepository;
    





    private final String UPLOAD_DIR =
            "storage/uploaded_documents";






    // ==================================================
    // Get Logged-in Manager
    // ==================================================

    private User getCurrentManager(){


        Authentication authentication =
                SecurityContextHolder
                .getContext()
                .getAuthentication();



        String email =
                authentication.getName();



        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                new RuntimeException(
                "Manager not found"));

    }









 // ==================================================
 // View Allowed Users
 // Department Users + All Managers
 // ==================================================

 public List<User> getDepartmentUsers() {

     User manager =
             getCurrentManager();

     Department department =
             manager.getDepartment();

     List<User> departmentUsers =
             userRepository.findByDepartment(department);

     List<User> managers =
             userRepository.findByRole_RoleName("MANAGER");

     Map<Integer, User> users =
             new LinkedHashMap<>();

     for (User user : departmentUsers) {

         users.put(
                 user.getUserId(),
                 user
         );

     }

     for (User user : managers) {

         users.put(
                 user.getUserId(),
                 user
         );

     }

     return new ArrayList<>(users.values());

 }









    // ==================================================
    // View Department Documents
    // ==================================================

    public List<Document> getDepartmentDocuments(){


        User manager =
                getCurrentManager();



        Department department =
                manager.getDepartment();



        return documentRepository
                .findByUserDepartment(department);

    }









    // ==================================================
    // Search Department Documents
    // ==================================================

    public List<Document> searchDocuments(
            String keyword){



        User manager =
                getCurrentManager();



        Department department =
                manager.getDepartment();



        List<Document> documents =
                documentRepository
                .findByUserDepartment(department);



        return documents
                .stream()
                .filter(doc ->
                doc.getFileName()
                .toLowerCase()
                .contains(
                keyword.toLowerCase()))
                .toList();

    }









    // ==================================================
    // Delete Document
    // ==================================================

    public String deleteDocument(
            Integer id){



        User manager =
                getCurrentManager();



        Document document =
                documentRepository
                .findById(id)
                .orElseThrow(() ->
                new ResourceNotFoundException(
                "Document Not Found"));




        // Manager can delete only own department documents

        if(!document.getUser()
                .getDepartment()
                .getDepartmentId()
                .equals(
                manager.getDepartment()
                .getDepartmentId())){


            throw new RuntimeException(
            "Cannot delete document from another department");

        }





        File file =
                new File(
                UPLOAD_DIR +
                File.separator +
                document.getStoredFileName());



        if(file.exists()){

            file.delete();

        }

     // Delete user shares
        documentAccessRepository.deleteByDocument(document);

        // Delete department shares
        departmentDocumentAccessRepository.deleteByDocument(document);

        // Delete document
        documentRepository.delete(document);





        auditService.log(
                manager.getEmail(),
                "DOCUMENT_DELETED",
                document.getFileName());




        return "Document Deleted Successfully";

    }
    public Department getMyDepartment() {

        User manager = getCurrentManager();

        if (manager.getDepartment() == null) {
            throw new RuntimeException("Manager has no department assigned.");
        }

        return manager.getDepartment();

    }


}