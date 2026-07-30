import { useEffect, useState } from "react";
import API from "../../services/api";

function ManagerSharing() {

    // ===========================
    // State
    // ===========================

    const [documents, setDocuments] = useState([]);
    const [users, setUsers] = useState([]);
    const [department, setDepartment] = useState(null);

    const [userShares, setUserShares] = useState([]);
    const [departmentShares, setDepartmentShares] = useState([]);

    const [selectedDocument, setSelectedDocument] = useState("");
    const [selectedUser, setSelectedUser] = useState("");

    const [loading, setLoading] = useState(false);

    // ===========================
    // Load Data
    // ===========================

    useEffect(() => {

        refreshData();

    }, []);

    // ===========================
    // Refresh
    // ===========================

    const refreshData = () => {

        loadDocuments();
        loadUsers();
        loadDepartment();
        loadUserShares();
        loadDepartmentShares();

    };

    // ===========================
    // Documents
    // ===========================

    const loadDocuments = async () => {

        try {

            const response =
                await API.get("/api/manager/documents");

            setDocuments(response.data);

        } catch (error) {

            console.log(
                "Failed to load documents",
                error
            );

        }

    };

    // ===========================
    // Users
    // ===========================

    const loadUsers = async () => {

        try {

            const response =
                await API.get("/api/manager/users");

            setUsers(response.data);

        } catch (error) {

            console.log(
                "Failed to load users",
                error
            );

        }

    };

    // ===========================
    // Logged-in Manager Department
    // ===========================

    const loadDepartment = async () => {

    try {

        const response =
            await API.get("/api/manager/department");


        const dept = response.data;


        setDepartment(dept);


        // Load shares after department is available
        loadUserShares(dept.departmentId);

        loadDepartmentShares(dept.departmentId);


    } catch(error) {

        console.log(
            "Failed to load department",
            error
        );

    }

};

    // ===========================
    // User Shares
    // ===========================

    const loadUserShares = async (departmentId) => {

    try {

        const response =
            await API.get("/api/access/all");


        const filtered =
            response.data.filter(share =>

                share.document?.user?.department?.departmentId
                === departmentId

            );


        setUserShares(filtered);


    } catch(error) {

        console.log(error);

    }

};

    // ===========================
    // Department Shares
    // ===========================

    const loadDepartmentShares = async (departmentId) => {

    try {

        const response =
            await API.get("/api/access/department/all");


        const filtered =
            response.data.filter(share =>

                share.department?.departmentId
                === departmentId

            );


        setDepartmentShares(filtered);


    } catch(error) {

        console.log(error);

    }

};
        // ===========================
    // Share With User
    // ===========================

    const shareToUser = async () => {

        if (!selectedDocument || !selectedUser) {

            alert("Please select a document and user.");

            return;

        }

        setLoading(true);

        try {

            await API.post(
                `/api/access/grant?documentId=${selectedDocument}&userId=${selectedUser}`
            );

            alert("Document shared successfully.");

            loadUserShares(department.departmentId);

            setSelectedUser("");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Unable to share document."
            );

        }

        setLoading(false);

    };



    // ===========================
    // Share With Department
    // ===========================

    const shareToDepartment = async () => {

        if (!selectedDocument || !department) {

            alert("Department not found.");

            return;

        }

        setLoading(true);

        try {

            await API.post(
                `/api/access/grant-department?documentId=${selectedDocument}&departmentId=${department.departmentId}`
            );

            alert("Document shared with your department.");

            loadDepartmentShares(department.departmentId);

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Unable to share document."
            );

        }

        setLoading(false);

    };



    // ===========================
    // Revoke User Share
    // ===========================

    const revokeUserAccess = async (
        documentId,
        userId
    ) => {

        if (!window.confirm("Remove user access?")) {

            return;

        }

        try {

            await API.delete(
                `/api/access/revoke?documentId=${documentId}&userId=${userId}`
            );

            loadUserShares(department.departmentId);

        } catch (error) {

            console.log(error);

            alert("Unable to remove access.");

        }

    };



    // ===========================
    // Revoke Department Share
    // ===========================

    const revokeDepartmentAccess = async (
        documentId,
        departmentId
    ) => {

        if (!window.confirm("Remove department access?")) {

            return;

        }

        try {

            await API.delete(
                `/api/access/revoke-department?documentId=${documentId}&departmentId=${departmentId}`
            );

            loadDepartmentShares(department.departmentId);

        } catch (error) {

            console.log(error);

            alert("Unable to remove access.");

        }

    };
        return (

        <div className="container-fluid mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Manager Document Sharing</h2>

                <button
                    className="btn btn-outline-primary"
                    onClick={refreshData}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                </button>

            </div>

            <div className="row">

                {/* ===========================
                    Share With User
                =========================== */}

                <div className="col-lg-6 mb-4">

                    <div className="card shadow">

                        <div className="card-header">

                            Share Document With User

                        </div>

                        <div className="card-body">

                            <div className="mb-3">

                                <label className="form-label">

                                    Document

                                </label>

                                <select
                                    className="form-select"
                                    value={selectedDocument}
                                    onChange={(e) =>
                                        setSelectedDocument(e.target.value)
                                    }
                                >

                                    <option value="">
                                        Select Document
                                    </option>

                                    {documents.map(doc => (

                                        <option
                                            key={doc.documentId}
                                            value={doc.documentId}
                                        >
                                            {doc.fileName}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    User

                                </label>

                                <select
                                    className="form-select"
                                    value={selectedUser}
                                    onChange={(e) =>
                                        setSelectedUser(e.target.value)
                                    }
                                >

                                    <option value="">
                                        Select User
                                    </option>

                                    {users.map(user => (

                                        <option
                                            key={user.userId}
                                            value={user.userId}
                                        >
                                            {user.username}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            <button
                                className="btn btn-primary"
                                disabled={loading}
                                onClick={shareToUser}
                            >

                                Share

                            </button>

                        </div>

                    </div>

                </div>





                {/* ===========================
                    Share With Department
                =========================== */}

                <div className="col-lg-6 mb-4">

                    <div className="card shadow">

                        <div className="card-header">

                            Share Document With Department

                        </div>

                        <div className="card-body">

                            <div className="mb-3">

                                <label className="form-label">

                                    Department

                                </label>

                                <input
                                    className="form-control"
                                    value={
                                        department?.departmentName || ""
                                    }
                                    readOnly
                                />

                            </div>

                            <button
                                className="btn btn-success"
                                disabled={loading || !department}
                                onClick={shareToDepartment}
                            >

                                Share With Department

                            </button>

                        </div>

                    </div>

                </div>

            </div>
                        {/* ===========================
                User Shares
            =========================== */}

            <div className="card shadow mt-4">

                <div className="card-header">

                    Shared With Users

                </div>

                <div className="card-body table-responsive">

                    <table className="table table-hover align-middle">

                        <thead className="table-dark">

                            <tr>

                                <th>Document</th>

                                <th>User</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {userShares.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="3"
                                        className="text-center text-muted"
                                    >

                                        No user shares found.

                                    </td>

                                </tr>

                            ) : (

                                userShares.map((share, index) => (

                                    <tr key={index}>

                                        <td>

                                            {share.document?.fileName}

                                        </td>

                                        <td>

                                            {share.user?.username}

                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() =>
                                                    revokeUserAccess(
                                                        share.document.documentId,
                                                        share.user.userId
                                                    )
                                                }
                                            >

                                                <i className="bi bi-trash me-1"></i>

                                                Remove

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>
            {/* ===========================
                Department Shares
            =========================== */}

            <div className="card shadow mt-4">

                <div className="card-header">

                    Shared With Department

                </div>

                <div className="card-body table-responsive">

                    <table className="table table-hover align-middle">

                        <thead className="table-dark">

                            <tr>

                                <th>Document</th>

                                <th>Department</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {departmentShares.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="3"
                                        className="text-center text-muted"
                                    >

                                        No department shares found.

                                    </td>

                                </tr>

                            ) : (

                                departmentShares.map((share, index) => (

                                    <tr key={index}>

                                        <td>

                                            {share.document?.fileName}

                                        </td>

                                        <td>

                                            {share.department?.departmentName}

                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() =>
                                                    revokeDepartmentAccess(
                                                        share.document.documentId,
                                                        share.department.departmentId
                                                    )
                                                }
                                            >

                                                <i className="bi bi-trash me-1"></i>

                                                Remove

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>
                    </div>

    );

}

export default ManagerSharing;