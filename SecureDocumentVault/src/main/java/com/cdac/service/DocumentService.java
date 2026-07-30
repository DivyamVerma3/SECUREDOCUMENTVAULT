package com.cdac.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cdac.entity.Document;
import com.cdac.entity.DocumentVersion;
import com.cdac.entity.User;
import com.cdac.exception.ResourceNotFoundException;
import com.cdac.repository.DepartmentDocumentAccessRepository;
import com.cdac.repository.DocumentAccessRepository;
import com.cdac.repository.DocumentRepository;
import com.cdac.repository.DocumentVersionRepository;
import com.cdac.repository.UserRepository;
import com.cdac.util.EncryptionUtil;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.FileInputStream;
import java.io.ByteArrayOutputStream;

@Service
public class DocumentService {


    @Autowired
    private AuditService auditService;


    @Autowired
    private DocumentRepository documentRepository;


    @Autowired
    private UserRepository userRepository;


    @Autowired
    private DocumentVersionRepository documentVersionRepository;

    

    @Autowired
    private DocumentAccessRepository documentAccessRepository;
    
    @Autowired
    private DepartmentDocumentAccessRepository departmentDocumentAccessRepository;



    private final String UPLOAD_DIR =
            "storage/uploaded_documents";




    // ===========================
    // Upload Document
    // ===========================

    public String uploadFile(
            MultipartFile file,
            String expiryDate) throws IOException {


        File uploadDir =
                new File(UPLOAD_DIR);


        if(!uploadDir.exists()){

            uploadDir.mkdirs();

        }



        String fileName =
                file.getOriginalFilename();



        if(fileName == null ||
                fileName.isEmpty()){

            throw new RuntimeException(
                    "Invalid File");

        }



        String extension =
                fileName.substring(
                fileName.lastIndexOf(".")+1);



        if(!(extension.equalsIgnoreCase("pdf")
                || extension.equalsIgnoreCase("doc")
                || extension.equalsIgnoreCase("docx")
                || extension.equalsIgnoreCase("jpg")
                || extension.equalsIgnoreCase("jpeg")
                || extension.equalsIgnoreCase("png"))){


            throw new RuntimeException(
                    "Invalid File Type");

        }




        if(file.getSize() >
                10 * 1024 * 1024){


            throw new RuntimeException(
                    "Maximum File Size Allowed is 10 MB");

        }




        String storedFileName =
                UUID.randomUUID()
                + "."
                + extension;




        File destination =
                new File(
                uploadDir,
                storedFileName);




        FileOutputStream outputStream =
                new FileOutputStream(destination);



        EncryptionUtil.encrypt(
                file.getInputStream(),
                outputStream);



        outputStream.close();





        Authentication authentication =
                SecurityContextHolder
                .getContext()
                .getAuthentication();



        String email =
                authentication.getName();




        User user =
                userRepository.findByEmail(email)
                .orElseThrow(() ->
                new RuntimeException(
                        "User not found"));





        Document document =
                new Document();



        document.setUser(user);

        document.setFileName(fileName);

        document.setStoredFileName(
                storedFileName);

        document.setFilePath(
                destination.getAbsolutePath());

        document.setUploadDate(
                LocalDateTime.now());



        if(expiryDate != null &&
                !expiryDate.isEmpty()){

            document.setExpiryDate(
                    LocalDateTime.parse(
                    expiryDate));

        }



        document.setExpired(false);



        documentRepository.save(document);





        auditService.log(
                email,
                "UPLOAD",
                fileName);



        return "File Uploaded Successfully";

    }






    // ===========================
    // Get All Documents
    // ===========================

    public List<Document> getAllDocuments(){

        return documentRepository.findAll();

    }






    // ===========================
    // My Documents
    // ===========================

    public List<Document> getMyDocuments() {

        Authentication authentication =
                SecurityContextHolder
                .getContext()
                .getAuthentication();

        User user =
                userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return documentRepository.findByUser(user);

    }
    
    //==========================
    //Shared Documents
    //==========================
    public List<Document> getSharedDocuments() {

        Authentication authentication =
                SecurityContextHolder
                .getContext()
                .getAuthentication();

        User user =
                userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Document> documents = new java.util.ArrayList<>();

        // Direct shares
        documentAccessRepository
                .findByUser(user)
                .forEach(access ->
                        documents.add(access.getDocument()));

        // Department shares
        departmentDocumentAccessRepository
                .findByDepartment(user.getDepartment())
                .forEach(access ->
                        documents.add(access.getDocument()));

        return documents.stream()
                .distinct()
                .toList();
    }




    // ===========================
    // Search Documents
    // ===========================

    public List<Document> searchDocuments(
            String keyword){


        return documentRepository
                .findByFileNameContaining(keyword);

    }






    // ===========================
    // Get Document
    // ===========================

    public Document getDocument(Integer id){


        return documentRepository
                .findById(id)
                .orElseThrow(() ->
                new ResourceNotFoundException(
                "Document Not Found"));

    }







    // ===========================
    // Delete Document
    // USER(owner)
    // HR
    // MANAGER
    // ADMIN
    // ===========================
    @Transactional
    public String deleteDocument(Integer id) {
    	
    	System.out.println("DELETE SERVICE CALLED : " + id);

        Document document = getDocument(id);

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User currentUser =
                userRepository
                        .findByEmail(authentication.getName())
                        .orElseThrow(() ->
                                new RuntimeException("User not found"));

        String role = currentUser
                .getRole()
                .getRoleName();

        boolean isAdmin = role.equals("ADMIN");
        boolean isManager = role.equals("MANAGER");
        boolean isHR = role.equals("HR");
        boolean isOwner =
                document.getUser()
                        .getUserId()
                        .equals(currentUser.getUserId());

        if (!isAdmin &&
            !isManager &&
            !isHR &&
            !isOwner) {

            throw new RuntimeException(
                    "You are not allowed to delete this document");
        }

        // Delete user shares
        documentAccessRepository.deleteByDocument(document);

        // Delete department shares
        departmentDocumentAccessRepository.deleteByDocument(document);

        // Delete all versions
        documentVersionRepository.deleteByDocument(document);

        // Delete encrypted file
        File encryptedFile =
                new File(document.getFilePath());

        if (encryptedFile.exists()) {
            encryptedFile.delete();
        }

        // Delete document record
        documentRepository.delete(document);

        auditService.log(
                currentUser.getEmail(),
                "DELETE",
                document.getFileName());

        return "Document Deleted Successfully";
    }









    // ===========================
    // Versions
    // ===========================

    public List<DocumentVersion> getVersions(
            Integer documentId){


        Document document =
                getDocument(documentId);



        return documentVersionRepository
                .findByDocument(document);

    }









    // ===========================
    // Upload New Version
    // ===========================

    public String uploadNewVersion(
            Integer documentId,
            MultipartFile file)
            throws IOException {

        Document document =
                getDocument(documentId);

        File uploadDir =
                new File(UPLOAD_DIR);

        if (!uploadDir.exists()) {

            uploadDir.mkdirs();

        }

        // =========================================
        // Save current document as a version
        // =========================================

        int nextVersion =
                documentVersionRepository
                        .findByDocument(document)
                        .size() + 1;

        String versionStoredName =
                UUID.randomUUID() + "_v" + nextVersion;

        File versionFile =
                new File(uploadDir, versionStoredName);

        java.nio.file.Files.copy(
                new File(document.getFilePath()).toPath(),
                versionFile.toPath(),
                java.nio.file.StandardCopyOption.REPLACE_EXISTING
        );

        DocumentVersion version =
                new DocumentVersion();

        version.setDocument(document);

        version.setVersionNumber(nextVersion);

        version.setCreatedAt(LocalDateTime.now());

        version.setFileName(document.getFileName());

        version.setStoredFileName(document.getStoredFileName());

        version.setFilePath(versionFile.getAbsolutePath());

        documentVersionRepository.save(version);

        // =========================================
        // Save uploaded file as CURRENT document
        // =========================================

        String extension =
                file.getOriginalFilename()
                        .substring(file.getOriginalFilename().lastIndexOf(".") + 1);

        String newStoredFileName =
                UUID.randomUUID() + "." + extension;

        File currentFile =
                new File(uploadDir, newStoredFileName);

        FileOutputStream outputStream =
                new FileOutputStream(currentFile);

        EncryptionUtil.encrypt(
                file.getInputStream(),
                outputStream);

        outputStream.close();

        // Delete old encrypted file
        File oldFile =
                new File(document.getFilePath());

        if (oldFile.exists()) {

            oldFile.delete();

        }

        document.setFileName(file.getOriginalFilename());

        document.setStoredFileName(newStoredFileName);

        document.setFilePath(currentFile.getAbsolutePath());

        documentRepository.save(document);

        auditService.log(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName(),
                "UPLOAD_NEW_VERSION",
                document.getFileName()
        );

        return "New Version Uploaded Successfully";
    }









    // ===========================
    // Document Access
    // ===========================

    public Document getDocumentForCurrentUser(
            Integer id){


        Document document =
                getDocument(id);



        Authentication authentication =
                SecurityContextHolder
                .getContext()
                .getAuthentication();




        User user =
                userRepository
                .findByEmail(
                authentication.getName())
                .orElseThrow(() ->
                new RuntimeException(
                "User not found"));





        if(document.getExpiryDate()!=null &&
                document.getExpiryDate()
                .isBefore(LocalDateTime.now())){


            document.setExpired(true);

            documentRepository.save(document);



            throw new RuntimeException(
                    "Document has expired");

        }





        String role =
                user.getRole()
                .getRoleName();




        boolean isAdmin =
                role.equals("ADMIN");



        boolean isManager =
                role.equals("MANAGER");



        boolean isOwner =
                document.getUser()
                .getUserId()
                .equals(
                user.getUserId());





        boolean hasUserAccess =
                documentAccessRepository
                        .findByDocumentAndUser(document, user)
                        .isPresent();

        boolean hasDepartmentAccess =
                departmentDocumentAccessRepository
                        .findByDocumentAndDepartment(
                                document,
                                user.getDepartment())
                        .isPresent();





        if(!isAdmin &&
        		   !isManager &&
        		   !isOwner &&
        		   !hasUserAccess &&
        		   !hasDepartmentAccess){


            throw new RuntimeException(
            "You are not allowed to access this document");

        }




        auditService.log(
                user.getEmail(),
                "DOWNLOAD",
                document.getFileName());




        return document;

    }
    //Download Version
    public ResponseEntity<Resource> downloadVersion(
            Integer versionId) throws IOException {

        DocumentVersion version =
                documentVersionRepository
                        .findById(versionId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Version Not Found"));

        File file =
                new File(version.getFilePath());

        if (!file.exists()) {

            throw new RuntimeException(
                    "Version file not found");

        }

        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();

        EncryptionUtil.decrypt(
                new FileInputStream(file),
                outputStream);

        ByteArrayResource resource =
                new ByteArrayResource(
                        outputStream.toByteArray());

        String originalName =
                version.getDocument().getFileName();

        auditService.log(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName(),
                "DOWNLOAD_VERSION",
                originalName +
                " (Version " +
                version.getVersionNumber() +
                ")"
        );

        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                        originalName +
                        "\"")

                .contentType(
                        MediaType.APPLICATION_OCTET_STREAM)

                .contentLength(
                        resource.contentLength())

                .body(resource);

    }
    
    //restore
    public String restoreVersion(Integer versionId)
            throws IOException {

        DocumentVersion selectedVersion =
                documentVersionRepository
                        .findById(versionId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Version not found"));

        Document document =
                selectedVersion.getDocument();

        File uploadDir =
                new File(UPLOAD_DIR);

        if (!uploadDir.exists()) {

            uploadDir.mkdirs();

        }

        // =========================================
        // Backup current document as NEW version
        // =========================================

        int nextVersion =
                documentVersionRepository
                        .findByDocument(document)
                        .size() + 1;

        String backupStoredName =
                UUID.randomUUID() + "_restore_backup";

        File backupFile =
                new File(uploadDir, backupStoredName);

        java.nio.file.Files.copy(

                new File(document.getFilePath()).toPath(),

                backupFile.toPath(),

                java.nio.file.StandardCopyOption.REPLACE_EXISTING

        );

        DocumentVersion backupVersion =
                new DocumentVersion();

        backupVersion.setDocument(document);

        backupVersion.setVersionNumber(nextVersion);

        backupVersion.setCreatedAt(LocalDateTime.now());

        backupVersion.setFileName(document.getFileName());

        backupVersion.setStoredFileName(document.getStoredFileName());

        backupVersion.setFilePath(backupFile.getAbsolutePath());

        documentVersionRepository.save(backupVersion);

        // =========================================
        // Restore selected version
        // =========================================

        String extension =
                selectedVersion.getStoredFileName()
                        .substring(
                                selectedVersion.getStoredFileName()
                                        .lastIndexOf(".") + 1
                        );

        String restoredStoredName =
                UUID.randomUUID() + "." + extension;

        File restoredFile =
                new File(uploadDir, restoredStoredName);

        java.nio.file.Files.copy(

                new File(selectedVersion.getFilePath()).toPath(),

                restoredFile.toPath(),

                java.nio.file.StandardCopyOption.REPLACE_EXISTING

        );

        // Delete current encrypted file

        File oldCurrent =
                new File(document.getFilePath());

        if (oldCurrent.exists()) {

            oldCurrent.delete();

        }

        // Update current document metadata

        document.setFileName(selectedVersion.getFileName());

        document.setStoredFileName(restoredStoredName);

        document.setFilePath(restoredFile.getAbsolutePath());

        documentRepository.save(document);

        auditService.log(

                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName(),

                "RESTORE_VERSION",

                document.getFileName()

        );

        return "Version restored successfully";

    }  

}