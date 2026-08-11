# SECUREDOCUMENTVAULT
A secure document management system built with Java and Spring Boot that provides document storage, controlled document sharing, role-based access, and audit logging.

## Overview

Secure Document Vault is a backend application designed to provide centralized and secure document management for organizations.

The system allows authenticated users to upload, view, download, and manage documents. Documents can also be shared with specific users or departments based on access permissions.

The application maintains audit logs for important activities, while administrators can monitor users, documents, and system activity through dedicated APIs.

## Features

### Document Management

- Upload documents using MultipartFile
- Store document metadata in MySQL
- Download documents using document ID
- Retrieve uploaded documents
- Delete documents from the system
- Store actual files separately from database metadata

### Document Sharing

- Grant document access to individual users
- Revoke document access
- View documents shared with the logged-in user
- Grant document access to departments
- Revoke department-level access
- Manage user and department document permissions

### Audit Logging

- Track important document operations
- Record upload, deletion, and sharing activities
- Store username, action, document information, and timestamp
- Maintain an audit trail for accountability and monitoring

### Dashboard

Provides system statistics such as:

- Total users
- Total documents
- Total audit logs

### Admin Management

Administrators can:

- View registered users
- View uploaded documents
- View audit logs
- Manage users
- Monitor system activity

### Security

- JWT-based authentication
- Spring Security
- Role-based access control
- Protected REST APIs
- Authorization-based document access

## Technology Stack

- **Language:** Java
- **Framework:** Spring Boot
- **Security:** Spring Security, JWT
- **ORM:** Hibernate
- **Persistence:** Spring Data JPA
- **Database:** MySQL
- **Build Tool:** Maven
- **API Documentation:** Swagger / OpenAPI
- **API Style:** REST

## Architecture

The application follows a layered architecture:

Client
   |
   v
Spring Security + JWT
   |
   v
Controller Layer
   |
   v
Service Layer
   |
   v
Repository Layer
   |
   v
MySQL Database


Layer Responsibilities

Controller Layer

Handles HTTP requests
Maps REST endpoints
Returns HTTP responses

Service Layer

Contains business logic
Performs validation
Coordinates database and file operations

Repository Layer

Handles database operations
Uses Spring Data JPA

Entity Layer

Represents database tables using JPA entities
Document Storage

The application separates physical file storage from database storage.

The actual document is stored in the server's file system, while its metadata is stored in MySQL.
