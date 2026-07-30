package com.cdac.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.Department;
import com.cdac.entity.DepartmentDocumentAccess;
import com.cdac.entity.Document;



public interface DepartmentDocumentAccessRepository
        extends JpaRepository<DepartmentDocumentAccess, Integer> {

    Optional<DepartmentDocumentAccess> findByDocumentAndDepartment(
            Document document,
            Department department);

    void deleteByDocumentAndDepartment(
            Document document,
            Department department);
    void deleteByDocument(Document document);
    
    List<DepartmentDocumentAccess> findByDepartment(
            Department department);
}