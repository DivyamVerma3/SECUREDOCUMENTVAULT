import { useEffect, useState } from "react";
import API from "../services/api";

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [accessList, setAccessList] = useState([]);
    const [departmentAccessList, setDepartmentAccessList] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [selectedRoles, setSelectedRoles] = useState({});
    const [selectedDepartments, setSelectedDepartments] = useState({});
    const [selectedUsersForDoc, setSelectedUsersForDoc] = useState({});
    const [selectedDepartmentForDoc, setSelectedDepartmentForDoc] = useState({});
    const [keyword, setKeyword] = useState("");

    const loadData = async () => {
        try {
            const usersResponse = await API.get("/api/admin/users");
            const documentsResponse = await API.get("/api/admin/documents");
            const accessResponse = await API.get("/api/access/all");
            const departmentAccessResponse = await API.get("/api/access/department/all");
            const departmentResponse = await API.get("/api/departments");

            setUsers(usersResponse.data);
            setDocuments(documentsResponse.data);
            setAccessList(accessResponse.data);
            setDepartmentAccessList(departmentAccessResponse.data);
            setDepartments(departmentResponse.data);
        } catch (error) {
            console.log(error);
            alert("Failed to load admin data");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const searchDocuments = async () => {
        try {
            if (!keyword.trim()) {
                loadData();
                return;
            }

            const response = await API.get(`/api/documents/search?keyword=${keyword}`);
            setDocuments(response.data);
        } catch {
            alert("Search Failed");
        }
    };

    const updateRole = async (userId) => {
        const roleName = selectedRoles[userId];

        if (!roleName) {
            alert("Select Role");
            return;
        }

        const response = await API.put(`/api/admin/users/${userId}/role?roleName=${roleName}`);
        alert(response.data);
        loadData();
    };

    const assignDepartment = async (userId) => {
        const departmentId = selectedDepartments[userId];

        if (!departmentId) {
            alert("Select Department");
            return;
        }

        const response = await API.put(`/api/admin/users/${userId}/department?departmentId=${departmentId}`);
        alert(response.data);
        loadData();
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Delete User?")) return;

        const response = await API.delete(`/api/admin/users/${id}`);
        alert(response.data);
        loadData();
    };

    const deleteDocument = async (id) => {
        if (!window.confirm("Delete Document?")) return;

        const response = await API.delete(`/api/admin/documents/${id}`);
        alert(response.data);
        loadData();
    };

    const grantAccess = async (documentId) => {
        const userId = selectedUsersForDoc[documentId];

        if (!userId) {
            alert("Select User");
            return;
        }

        const response = await API.post(`/api/access/grant?documentId=${documentId}&userId=${userId}`);
        alert(response.data);
        loadData();
    };

    const grantDepartmentAccess = async (documentId) => {
        const departmentId = selectedDepartmentForDoc[documentId];

        if (!departmentId) {
            alert("Select Department");
            return;
        }

        const response = await API.post(`/api/access/grant-department?documentId=${documentId}&departmentId=${departmentId}`);
        alert(response.data);
        loadData();
    };

    const revokeAccess = async (documentId, userId) => {
        if (!window.confirm("Revoke Access?")) return;

        const response = await API.delete(`/api/access/revoke?documentId=${documentId}&userId=${userId}`);
        alert(response.data);
        loadData();
    };

    const revokeDepartmentAccess = async (documentId, departmentId) => {
        if (!window.confirm("Revoke Department Access?")) return;

        const response = await API.delete(`/api/access/revoke-department?documentId=${documentId}&departmentId=${departmentId}`);
        alert(response.data);
        loadData();
    };

    const downloadDocument = async (id, fileName) => {
        const response = await API.get(`/api/documents/download/${id}`, {
            responseType: "blob"
        });

        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");

        link.href = url;
        link.download = fileName || "document";
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const viewDocument = async (doc) => {
        const extension = doc.fileName.split(".").pop().toLowerCase();

        if (["pdf", "jpg", "jpeg", "png"].includes(extension)) {
            const response = await API.get(`/api/documents/download/${doc.documentId}`, {
                responseType: "blob"
            });

            const fileURL = window.URL.createObjectURL(response.data);
            window.open(fileURL, "_blank");
        } else {
            downloadDocument(doc.documentId, doc.fileName);
        }
    };

    return (
        <>
            <div className="mb-4">
                <h2 className="fw-bold">
                    <i className="bi bi-shield-lock me-2 text-primary"></i>
                    Admin Panel
                </h2>
                <p className="text-muted">
                    Manage users, documents, access records and departments.
                </p>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="card p-3">
                        <h6 className="text-muted">Users</h6>
                        <h3>{users.length}</h3>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card p-3">
                        <h6 className="text-muted">Documents</h6>
                        <h3>{documents.length}</h3>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card p-3">
                        <h6 className="text-muted">User Shares</h6>
                        <h3>{accessList.length}</h3>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card p-3">
                        <h6 className="text-muted">Dept Shares</h6>
                        <h3>{departmentAccessList.length}</h3>
                    </div>
                </div>
            </div>

            <div className="card p-4">
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#users">
                            Users
                        </button>
                    </li>

                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#documents">
                            Documents
                        </button>
                    </li>

                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#access">
                            User Access
                        </button>
                    </li>

                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#departmentAccess">
                            Department Access
                        </button>
                    </li>
                </ul>

                <div className="tab-content">

                    <div className="tab-pane fade show active" id="users">
                        <h5 className="fw-bold mb-3">User Management</h5>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Department</th>
                                        <th>Assign Dept</th>
                                        <th>Change Role</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.userId}>
                                            <td>{user.userId}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className="badge bg-primary">
                                                    {user.role?.roleName}
                                                </span>
                                            </td>
                                            <td>{user.department?.departmentName || "Not Assigned"}</td>

                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={selectedDepartments[user.userId] || ""}
                                                    onChange={(e) =>
                                                        setSelectedDepartments({
                                                            ...selectedDepartments,
                                                            [user.userId]: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value="">Department</option>
                                                    {departments.map((dept) => (
                                                        <option key={dept.departmentId} value={dept.departmentId}>
                                                            {dept.departmentName}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    className="btn btn-sm btn-outline-primary mt-2"
                                                    onClick={() => assignDepartment(user.userId)}
                                                >
                                                    Assign
                                                </button>
                                            </td>

                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={selectedRoles[user.userId] || user.role?.roleName || ""}
                                                    onChange={(e) =>
                                                        setSelectedRoles({
                                                            ...selectedRoles,
                                                            [user.userId]: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value="ADMIN">ADMIN</option>
                                                    <option value="HR">HR</option>
                                                    <option value="MANAGER">MANAGER</option>
                                                    <option value="USER">USER</option>
                                                </select>

                                                <button
                                                    className="btn btn-sm btn-outline-success mt-2"
                                                    onClick={() => updateRole(user.userId)}
                                                >
                                                    Update
                                                </button>
                                            </td>

                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deleteUser(user.userId)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="documents">
                        <h5 className="fw-bold mb-3">Document Management</h5>

                        <div className="d-flex mb-3">
                            <input
                                className="form-control me-2"
                                placeholder="Search document..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />

                            <button className="btn btn-primary me-2" onClick={searchDocuments}>
                                Search
                            </button>

                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                    setKeyword("");
                                    loadData();
                                }}
                            >
                                Reset
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>File Name</th>
                                        <th>Uploaded By</th>
                                        <th>Expiry</th>
                                        <th>Status</th>
                                        <th>Share</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {documents.map((doc) => (
                                        <tr key={doc.documentId}>
                                            <td>{doc.documentId}</td>
                                            <td>{doc.fileName}</td>
                                            <td>
                                                {doc.user?.username || doc.user?.email || "Unknown"}
                                            </td>
                                            <td>
                                                {doc.expiryDate
                                                    ? new Date(doc.expiryDate).toLocaleString()
                                                    : "Never"}
                                            </td>
                                            <td>
                                                {doc.expired ? (
                                                    <span className="badge bg-danger">Expired</span>
                                                ) : (
                                                    <span className="badge bg-success">Active</span>
                                                )}
                                            </td>

                                            <td>
                                                <select
                                                    className="form-select form-select-sm mb-2"
                                                    value={selectedUsersForDoc[doc.documentId] || ""}
                                                    onChange={(e) =>
                                                        setSelectedUsersForDoc({
                                                            ...selectedUsersForDoc,
                                                            [doc.documentId]: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value="">Select User</option>
                                                    {users.map((user) => (
                                                        <option key={user.userId} value={user.userId}>
                                                            {user.username} - {user.email}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    className="btn btn-sm btn-outline-primary mb-2"
                                                    onClick={() => grantAccess(doc.documentId)}
                                                >
                                                    Share User
                                                </button>

                                                <select
                                                    className="form-select form-select-sm mb-2"
                                                    value={selectedDepartmentForDoc[doc.documentId] || ""}
                                                    onChange={(e) =>
                                                        setSelectedDepartmentForDoc({
                                                            ...selectedDepartmentForDoc,
                                                            [doc.documentId]: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value="">Select Department</option>
                                                    {departments.map((dept) => (
                                                        <option key={dept.departmentId} value={dept.departmentId}>
                                                            {dept.departmentName}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    className="btn btn-sm btn-outline-info"
                                                    onClick={() => grantDepartmentAccess(doc.documentId)}
                                                >
                                                    Share Dept
                                                </button>
                                            </td>

                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => viewDocument(doc)}>
                                                    View
                                                </button>

                                                <button className="btn btn-sm btn-outline-success me-2" onClick={() => downloadDocument(doc.documentId, doc.fileName)}>
                                                    Download
                                                </button>

                                                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteDocument(doc.documentId)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="access">
                        <h5 className="fw-bold mb-3">User Access Records</h5>

                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Document</th>
                                    <th>User</th>
                                    <th>Granted By</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {accessList.map((access) => (
                                    <tr key={access.accessId}>
                                        <td>{access.accessId}</td>
                                        <td>{access.document?.fileName}</td>
                                        <td>{access.user?.email}</td>
                                        <td>{access.grantedBy?.email}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    revokeAccess(
                                                        access.document.documentId,
                                                        access.user.userId
                                                    )
                                                }
                                            >
                                                Revoke
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="tab-pane fade" id="departmentAccess">
                        <h5 className="fw-bold mb-3">Department Access Records</h5>

                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Document</th>
                                    <th>Department</th>
                                    <th>Granted By</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {departmentAccessList.map((access) => (
                                    <tr key={access.accessId}>
                                        <td>{access.accessId}</td>
                                        <td>{access.document?.fileName}</td>
                                        <td>{access.department?.departmentName}</td>
                                        <td>{access.grantedBy?.email}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    revokeDepartmentAccess(
                                                        access.document.documentId,
                                                        access.department.departmentId
                                                    )
                                                }
                                            >
                                                Revoke
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
}

export default AdminPanel;