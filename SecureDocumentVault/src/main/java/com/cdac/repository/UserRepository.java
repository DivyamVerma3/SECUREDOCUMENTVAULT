package com.cdac.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.Department;
import com.cdac.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    List<User> findByDepartment(Department department);
    
    List<User> findByUsernameContainingIgnoreCase(String keyword);
    
    List<User> findByRole_RoleName(String roleName);
}