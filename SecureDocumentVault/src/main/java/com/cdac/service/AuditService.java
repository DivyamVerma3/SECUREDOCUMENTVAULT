package com.cdac.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.entity.AuditLog;
import com.cdac.repository.AuditLogRepository;

@Service
public class AuditService {

@Autowired
private AuditLogRepository auditLogRepository;

// ===========================
// Save Audit Log
// ===========================
public void log(
        String email,
        String action,
        String documentName) {

    AuditLog auditLog = new AuditLog();

    auditLog.setEmail(email);
    auditLog.setAction(action);
    auditLog.setDocumentName(documentName);
    auditLog.setActionTime(LocalDateTime.now());

    auditLogRepository.save(auditLog);
}

// ===========================
// Get All Audit Logs
// ===========================
public List<AuditLog> getAllLogs() {

    return auditLogRepository.findAll();
}


}
