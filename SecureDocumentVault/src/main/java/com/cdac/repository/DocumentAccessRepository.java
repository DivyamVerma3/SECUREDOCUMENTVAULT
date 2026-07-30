package com.cdac.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.Document;
import com.cdac.entity.DocumentAccess;
import com.cdac.entity.User;

public interface DocumentAccessRepository
        extends JpaRepository<DocumentAccess, Integer> {

    List<DocumentAccess> findByUser(User user);

    Optional<DocumentAccess> findByDocumentAndUser(
            Document document,
            User user);

    void deleteByDocumentAndUser(
            Document document,
            User user);
    
    void deleteByDocument(Document document);
    
}