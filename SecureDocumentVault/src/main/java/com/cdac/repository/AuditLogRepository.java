package com.cdac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.entity.AuditLog;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Integer> {
	List<AuditLog> findByEmail(String email);

}