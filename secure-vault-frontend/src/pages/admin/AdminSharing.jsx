import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminSharing() {

    const [documents, setDocuments] = useState([]);
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [userShares, setUserShares] = useState([]);
    const [departmentShares, setDepartmentShares] = useState([]);

    const [selectedDocument, setSelectedDocument] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        setLoading(true);

        try {

            const [
                documentsResponse,
                usersResponse,
                departmentsResponse,
                userSharesResponse,
                departmentSharesResponse
            ] = await Promise.all([

                API.get("/api/admin/documents"),

                API.get("/api/admin/users"),

                API.get("/api/departments"),

                API.get("/api/access/all"),

                API.get("/api/access/department/all")

            ]);

            setDocuments(
                Array.isArray(documentsResponse.data)
                    ? documentsResponse.data
                    : []
            );

            setUsers(
                Array.isArray(usersResponse.data)
                    ? usersResponse.data
                    : []
            );

            setDepartments(
                Array.isArray(departmentsResponse.data)
                    ? departmentsResponse.data
                    : []
            );

            setUserShares(
                Array.isArray(userSharesResponse.data)
                    ? userSharesResponse.data
                    : []
            );

            setDepartmentShares(
                Array.isArray(departmentSharesResponse.data)
                    ? departmentSharesResponse.data
                    : []
            );

        } catch (error) {

            console.log(
                "Admin sharing load error:",
                error
            );

            alert(
                error.response?.data ||
                "Unable to load sharing data."
            );

        } finally {

            setLoading(false);

        }

    };


    const shareWithUser = async () => {

        if (
            !selectedDocument ||
            !selectedUser
        ) {

            alert(
                "Please select a document and user."
            );

            return;

        }

        setActionLoading(true);

        try {

            const response = await API.post(
                `/api/access/grant?documentId=${selectedDocument}&userId=${selectedUser}`
            );

            alert(
                response.data ||
                "Document shared successfully."
            );

            setSelectedUser("");

            await loadData();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Unable to share document."
            );

        } finally {

            setActionLoading(false);

        }

    };


    const shareWithDepartment = async () => {

        if (
            !selectedDocument ||
            !selectedDepartment
        ) {

            alert(
                "Please select a document and department."
            );

            return;

        }

        setActionLoading(true);

        try {

            const response = await API.post(
                `/api/access/grant-department?documentId=${selectedDocument}&departmentId=${selectedDepartment}`
            );

            alert(
                response.data ||
                "Document shared with department."
            );

            setSelectedDepartment("");

            await loadData();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Unable to share document with department."
            );

        } finally {

            setActionLoading(false);

        }

    };


    const revokeUserAccess = async (
        documentId,
        userId
    ) => {

        if (
            !window.confirm(
                "Are you sure you want to revoke this user's access?"
            )
        ) {

            return;

        }

        try {

            const response = await API.delete(
                `/api/access/revoke?documentId=${documentId}&userId=${userId}`
            );

            alert(
                response.data ||
                "User access revoked."
            );

            await loadData();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Unable to revoke user access."
            );

        }

    };


    const revokeDepartmentAccess = async (
        documentId,
        departmentId
    ) => {

        if (
            !window.confirm(
                "Are you sure you want to revoke department access?"
            )
        ) {

            return;

        }

        try {

            const response = await API.delete(
                `/api/access/revoke-department?documentId=${documentId}&departmentId=${departmentId}`
            );

            alert(
                response.data ||
                "Department access revoked."
            );

            await loadData();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Unable to revoke department access."
            );

        }

    };


    return (

        <div className="container-fluid mt-4">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">

                        <i className="bi bi-share me-2"></i>

                        Sharing Permissions

                    </h2>

                    <p className="text-muted mb-0">

                        Manage document sharing and access permissions.

                    </p>

                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={loadData}
                >

                    <i className="bi bi-arrow-clockwise me-2"></i>

                    Refresh

                </button>

            </div>


            {/* Share Controls */}

            <div className="row g-4 mb-4">

                {/* User Sharing */}

                <div className="col-lg-6">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-header bg-primary text-white">

                            <h5 className="mb-0">

                                <i className="bi bi-person-plus me-2"></i>

                                Share With User

                            </h5>

                        </div>

                        <div className="card-body">

                            <div className="mb-3">

                                <label className="form-label fw-semibold">

                                    Document

                                </label>

                                <select
                                    className="form-select"
                                    value={selectedDocument}
                                    onChange={(e) =>
                                        setSelectedDocument(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">

                                        Select Document

                                    </option>

                                    {documents.map(
                                        document => (

                                            <option
                                                key={
                                                    document.documentId
                                                }
                                                value={
                                                    document.documentId
                                                }
                                            >

                                                {
                                                    document.fileName
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div className="mb-3">

                                <label className="form-label fw-semibold">

                                    User

                                </label>

                                <select
                                    className="form-select"
                                    value={selectedUser}
                                    onChange={(e) =>
                                        setSelectedUser(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">

                                        Select User

                                    </option>

                                    {users.map(
                                        user => (

                                            <option
                                                key={
                                                    user.userId
                                                }
                                                value={
                                                    user.userId
                                                }
                                            >

                                                {
                                                    user.username
                                                }

                                                {" - "}

                                                {
                                                    user.email
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <button
                                className="btn btn-primary"
                                disabled={actionLoading}
                                onClick={shareWithUser}
                            >

                                <i className="bi bi-share me-2"></i>

                                Share Document

                            </button>

                        </div>

                    </div>

                </div>


                {/* Department Sharing */}

                <div className="col-lg-6">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-header bg-info text-white">

                            <h5 className="mb-0">

                                <i className="bi bi-building me-2"></i>

                                Share With Department

                            </h5>

                        </div>

                        <div className="card-body">

                            <div className="mb-3">

                                <label className="form-label fw-semibold">

                                    Document

                                </label>

                                <select
                                    className="form-select"
                                    value={selectedDocument}
                                    onChange={(e) =>
                                        setSelectedDocument(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">

                                        Select Document

                                    </option>

                                    {documents.map(
                                        document => (

                                            <option
                                                key={
                                                    document.documentId
                                                }
                                                value={
                                                    document.documentId
                                                }
                                            >

                                                {
                                                    document.fileName
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div className="mb-3">

                                <label className="form-label fw-semibold">

                                    Department

                                </label>

                                <select
                                    className="form-select"
                                    value={selectedDepartment}
                                    onChange={(e) =>
                                        setSelectedDepartment(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">

                                        Select Department

                                    </option>

                                    {departments.map(
                                        department => (

                                            <option
                                                key={
                                                    department.departmentId
                                                }
                                                value={
                                                    department.departmentId
                                                }
                                            >

                                                {
                                                    department.departmentName
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <button
                                className="btn btn-info text-white"
                                disabled={actionLoading}
                                onClick={shareWithDepartment}
                            >

                                <i className="bi bi-building me-2"></i>

                                Share With Department

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* User Access */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-header">

                    <h5 className="mb-0">

                        <i className="bi bi-person-check me-2"></i>

                        User Access Records

                    </h5>

                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-hover table-bordered align-middle">

                            <thead className="table-dark">

                                <tr>

                                    <th>ID</th>

                                    <th>Document</th>

                                    <th>User</th>

                                    <th>Granted By</th>

                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center"
                                        >

                                            Loading...

                                        </td>

                                    </tr>

                                ) : userShares.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center text-muted"
                                        >

                                            No user sharing records.

                                        </td>

                                    </tr>

                                ) : (

                                    userShares.map(
                                        access => (

                                            <tr
                                                key={
                                                    access.accessId
                                                }
                                            >

                                                <td>

                                                    {
                                                        access.accessId
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        access.document
                                                            ?.fileName ||
                                                        "-"
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        access.user
                                                            ?.username ||
                                                        access.user
                                                            ?.email ||
                                                        "-"
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        access.grantedBy
                                                            ?.email ||
                                                        "-"
                                                    }

                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            revokeUserAccess(
                                                                access.document
                                                                    ?.documentId,
                                                                access.user
                                                                    ?.userId
                                                            )
                                                        }
                                                    >

                                                        <i className="bi bi-x-circle me-1"></i>

                                                        Revoke

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>


            {/* Department Access */}

            <div className="card shadow-sm border-0">

                <div className="card-header">

                    <h5 className="mb-0">

                        <i className="bi bi-building-check me-2"></i>

                        Department Access Records

                    </h5>

                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-hover table-bordered align-middle">

                            <thead className="table-dark">

                                <tr>

                                    <th>ID</th>

                                    <th>Document</th>

                                    <th>Department</th>

                                    <th>Granted By</th>

                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center"
                                        >

                                            Loading...

                                        </td>

                                    </tr>

                                ) : departmentShares.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center text-muted"
                                        >

                                            No department sharing records.

                                        </td>

                                    </tr>

                                ) : (

                                    departmentShares.map(
                                        access => (

                                            <tr
                                                key={
                                                    access.accessId
                                                }
                                            >

                                                <td>

                                                    {
                                                        access.accessId
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        access.document
                                                            ?.fileName ||
                                                        "-"
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        access.department
                                                            ?.departmentName ||
                                                        "-"
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        access.grantedBy
                                                            ?.email ||
                                                        "-"
                                                    }

                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            revokeDepartmentAccess(
                                                                access.document
                                                                    ?.documentId,
                                                                access.department
                                                                    ?.departmentId
                                                            )
                                                        }
                                                    >

                                                        <i className="bi bi-x-circle me-1"></i>

                                                        Revoke

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminSharing;