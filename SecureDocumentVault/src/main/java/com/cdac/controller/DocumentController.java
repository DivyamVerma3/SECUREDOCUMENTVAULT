package com.cdac.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import org.springframework.core.io.ByteArrayResource;
import com.cdac.util.EncryptionUtil;

import com.cdac.entity.Document;
import com.cdac.entity.DocumentVersion;
import com.cdac.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

@Autowired
private DocumentService documentService;

// ===========================
// Upload Document
// ===========================
@PostMapping("/upload")
public String uploadFile(
        @RequestParam("file") MultipartFile file,
        @RequestParam(required = false) String expiryDate)
        throws IOException {

    return documentService.uploadFile(file, expiryDate);
}

// ===========================
// Get All Documents
// ===========================
@GetMapping
public List<Document> getAllDocuments() {

    return documentService.getAllDocuments();
}

// ===========================
// Get Logged-in User Documents
// ===========================
@GetMapping("/my")
public List<Document> getMyDocuments() {

    return documentService.getMyDocuments();
}

// ===========================
// Search Documents
// ===========================
@GetMapping("/search")
public List<Document> searchDocuments(
        @RequestParam String keyword) {

    return documentService.searchDocuments(keyword);
}

// ===========================
// Download Document
// ===========================
@GetMapping("/download/{id}")
public ResponseEntity<Resource> downloadFile(
        @PathVariable Integer id) throws IOException {

    Document document =
            documentService.getDocumentForCurrentUser(id);

    Path path;

    if (document.getStoredFileName() != null &&
            !document.getStoredFileName().isEmpty()) {

        path = Paths.get(
                "storage",
                "uploaded_documents",
                document.getStoredFileName());

    } else {

        path = Paths.get(document.getFilePath());
    }

    FileInputStream inputStream =
            new FileInputStream(path.toFile());

    ByteArrayOutputStream outputStream =
            new ByteArrayOutputStream();

    EncryptionUtil.decrypt(
            inputStream,
            outputStream);

    ByteArrayResource resource =
            new ByteArrayResource(
                    outputStream.toByteArray());

    return ResponseEntity.ok()
            .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "inline; filename=\"" +
                            document.getFileName() + "\"")
            .header(
                    HttpHeaders.CONTENT_TYPE,
                    getContentType(document.getFileName()))
            .body(resource);
}

// ===========================
// Delete Document
// ===========================
@DeleteMapping("/{id}")
public String deleteDocument(
        @PathVariable Integer id) {

    return documentService.deleteDocument(id);
}

// ===========================
// Get Version History
// ===========================
@GetMapping("/{id}/versions")
public List<DocumentVersion> getVersions(
        @PathVariable Integer id) {

    return documentService.getVersions(id);
}

// ===========================
// Upload New Version
// ===========================
@PostMapping("/{id}/version")
public String uploadVersion(
        @PathVariable Integer id,
        @RequestParam("file") MultipartFile file)
        throws IOException {

    return documentService.uploadNewVersion(id, file);
}

private String getContentType(String fileName) {

    String lower = fileName.toLowerCase();

    if (lower.endsWith(".pdf")) {
        return "application/pdf";
    }

    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
        return "image/jpeg";
    }

    if (lower.endsWith(".png")) {
        return "image/png";
    }

    if (lower.endsWith(".doc")) {
        return "application/msword";
    }

    if (lower.endsWith(".docx")) {
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    return "application/octet-stream";
}

@GetMapping("/shared")
public List<Document> getSharedDocuments() {

    return documentService.getSharedDocuments();

}

@GetMapping("/versions/{versionId}/download")
public ResponseEntity<Resource> downloadVersion(
        @PathVariable Integer versionId)
        throws IOException {

    return documentService.downloadVersion(versionId);

}

@PostMapping("/versions/{versionId}/restore")
public String restoreVersion(
        @PathVariable Integer versionId)
        throws IOException {

    return documentService.restoreVersion(versionId);

}

}
