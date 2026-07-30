package com.cdac.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.entity.AuditLog;
import com.cdac.service.AuditService;

@RestController
@RequestMapping("/api/audit")
public class AuditController {


@Autowired
private AuditService auditService;

@GetMapping
public List<AuditLog> getLogs() {

    return auditService.getAllLogs();
}


}
