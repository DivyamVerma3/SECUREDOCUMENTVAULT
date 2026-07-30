package com.cdac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.Document;
import com.cdac.entity.DocumentVersion;

public interface DocumentVersionRepository
        extends JpaRepository<DocumentVersion, Integer> {

    List<DocumentVersion> findByDocument(Document document);
    
    void deleteByDocument(Document document);
    

}