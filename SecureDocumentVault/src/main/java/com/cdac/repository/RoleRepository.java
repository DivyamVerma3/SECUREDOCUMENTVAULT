package com.cdac.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.cdac.entity.Role;
public interface RoleRepository extends JpaRepository<Role, Integer> {

    Role findByRoleName(String roleName);

}