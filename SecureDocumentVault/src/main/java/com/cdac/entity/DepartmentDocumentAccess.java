package com.cdac.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "department_document_access")
public class DepartmentDocumentAccess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "access_id")
    private Integer accessId;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "granted_by")
    private User grantedBy;

    private Boolean canView;

    private Boolean canDownload;

    private LocalDateTime createdAt;

    public Integer getAccessId() {
        return accessId;
    }

    public void setAccessId(Integer accessId) {
        this.accessId = accessId;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public User getGrantedBy() {
        return grantedBy;
    }

    public void setGrantedBy(User grantedBy) {
        this.grantedBy = grantedBy;
    }

    public Boolean getCanView() {
        return canView;
    }

    public void setCanView(Boolean canView) {
        this.canView = canView;
    }

    public Boolean getCanDownload() {
        return canDownload;
    }

    public void setCanDownload(Boolean canDownload) {
        this.canDownload = canDownload;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}