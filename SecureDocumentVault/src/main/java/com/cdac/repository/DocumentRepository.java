package com.cdac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.Department;
import com.cdac.entity.Document;
import com.cdac.entity.User;

public interface DocumentRepository extends JpaRepository<Document, Integer> {

List<Document> findByFileNameContaining(String fileName);

// Documents of logged-in user
List<Document> findByUser(User user);

// Dashboard count
long countByUser(User user);

long countByExpired(Boolean expired);

List<Document> findByUserDepartment(Department department);

long countByUser_Department(
        com.cdac.entity.Department department
);


}
