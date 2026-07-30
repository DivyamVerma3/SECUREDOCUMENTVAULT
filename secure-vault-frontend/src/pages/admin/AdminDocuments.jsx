import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminDocuments() {

    const [documents, setDocuments] = useState([]);
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [selectedUsers, setSelectedUsers] = useState({});
    const [selectedDepartments, setSelectedDepartments] = useState({});

    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        setLoading(true);

        try {

            const [
                documentsResponse,
                usersResponse,
                departmentsResponse
            ] = await Promise.all([

                API.get("/api/admin/documents"),

                API.get("/api/admin/users"),

                API.get("/api/departments")

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

        } catch (error) {

            console.log(
                "Failed to load documents:",
                error
            );

            alert(
                error.response?.data ||
                "Failed to load document data."
            );

        } finally {

            setLoading(false);

        }

    };


    const searchDocuments = async () => {

        if (!keyword.trim()) {

            loadData();

            return;

        }


        try {

            setLoading(true);


            const response = await API.get(
                `/api/admin/documents/search?keyword=${encodeURIComponent(keyword)}`
            );


            setDocuments(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.log(error);

            /*
             * If admin search endpoint is not available,
             * fall back to frontend filtering.
             */

            const filtered = documents.filter(
                doc =>
                    doc.fileName
                        ?.toLowerCase()
                        .includes(
                            keyword.toLowerCase()
                        )
            );

            setDocuments(filtered);

        } finally {

            setLoading(false);

        }

    };


    const resetSearch = () => {

        setKeyword("");

        loadData();

    };


    const deleteDocument = async (documentId) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this document?"
            )
        ) {

            return;

        }


        try {

            const response = await API.delete(
                `/api/admin/documents/${documentId}`
            );


            alert(
                response.data ||
                "Document deleted successfully."
            );


            loadData();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Unable to delete document."
            );

        }

    };


    const grantUserAccess = async (documentId) => {

        const userId =
            selectedUsers[documentId];


        if (!userId) {

            alert(
                "Please select a user."
            );

            return;

        }


        try {

            const response = await API.post(
                `/api/access/grant?documentId=${documentId}&userId=${userId}`
            );


            alert(
                response.data ||
                "Document shared with user."
            );


            setSelectedUsers({
                ...selectedUsers,
                [documentId]: ""
            });

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Unable to share document."
            );

        }

    };


    const grantDepartmentAccess = async (
        documentId
    ) => {

        const departmentId =
            selectedDepartments[documentId];


        if (!departmentId) {

            alert(
                "Please select a department."
            );

            return;

        }


        try {

            const response = await API.post(
                `/api/access/grant-department?documentId=${documentId}&departmentId=${departmentId}`
            );


            alert(
                response.data ||
                "Document shared with department."
            );


            setSelectedDepartments({
                ...selectedDepartments,
                [documentId]: ""
            });

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Unable to share document."
            );

        }

    };


    const downloadDocument = async (
        documentId,
        fileName
    ) => {

        try {

            const response = await API.get(
                `/api/documents/download/${documentId}`,
                {
                    responseType: "blob"
                }
            );


            const url =
                window.URL.createObjectURL(
                    response.data
                );


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                fileName || "document";


            document.body.appendChild(link);

            link.click();

            link.remove();


            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.log(error);

            alert(
                "Unable to download document."
            );

        }

    };


    const viewDocument = async (document) => {

        const fileName =
            document.fileName || "";


        const extension =
            fileName
                .split(".")
                .pop()
                .toLowerCase();


        if (
            ![
                "pdf",
                "jpg",
                "jpeg",
                "png",
                "gif",
                "txt"
            ].includes(extension)
        ) {

            downloadDocument(
                document.documentId,
                document.fileName
            );

            return;

        }


        try {

            const response = await API.get(
                `/api/documents/download/${document.documentId}`,
                {
                    responseType: "blob"
                }
            );


            const fileURL =
                window.URL.createObjectURL(
                    response.data
                );


            window.open(
                fileURL,
                "_blank"
            );

        } catch (error) {

            console.log(error);

            alert(
                "Unable to open document."
            );

        }

    };


    const formatDate = (date) => {

        if (!date) {

            return "Never";

        }


        try {

            return new Date(date)
                .toLocaleString();

        } catch {

            return date;

        }

    };


    return (

        <div className="container-fluid mt-4">


            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">

                        <i className="bi bi-folder2-open me-2"></i>

                        Document Management

                    </h2>

                    <p className="text-muted mb-0">

                        View, search, download, share and
                        delete documents.

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


            {/* Search */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <div className="row g-2">

                        <div className="col-md-6">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search document..."
                                value={keyword}
                                onChange={(e) =>
                                    setKeyword(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {

                                    if (
                                        e.key === "Enter"
                                    ) {

                                        searchDocuments();

                                    }

                                }}
                            />

                        </div>


                        <div className="col-auto">

                            <button
                                className="btn btn-primary"
                                onClick={searchDocuments}
                            >

                                <i className="bi bi-search me-2"></i>

                                Search

                            </button>

                        </div>


                        <div className="col-auto">

                            <button
                                className="btn btn-outline-secondary"
                                onClick={resetSearch}
                            >

                                Reset

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* Documents */}

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-hover table-bordered align-middle">

                            <thead className="table-dark">

                                <tr>

                                    <th>ID</th>

                                    <th>File Name</th>

                                    <th>Uploaded By</th>

                                    <th>Expiry</th>

                                    <th>Status</th>

                                    <th>Sharing</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center py-4"
                                        >

                                            <div
                                                className="spinner-border text-primary"
                                                role="status"
                                            ></div>

                                            <div className="mt-2">

                                                Loading documents...

                                            </div>

                                        </td>

                                    </tr>

                                ) : documents.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center text-muted py-4"
                                        >

                                            No documents found.

                                        </td>

                                    </tr>

                                ) : (

                                    documents.map(
                                        doc => (

                                            <tr
                                                key={
                                                    doc.documentId
                                                }
                                            >

                                                <td>

                                                    {
                                                        doc.documentId
                                                    }

                                                </td>


                                                <td>

                                                    <strong>

                                                        {
                                                            doc.fileName ||
                                                            "Unnamed Document"
                                                        }

                                                    </strong>

                                                </td>


                                                <td>

                                                    {
                                                        doc.user
                                                            ?.username ||
                                                        doc.user
                                                            ?.email ||
                                                        "Unknown"
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        formatDate(
                                                            doc.expiryDate
                                                        )
                                                    }

                                                </td>


                                                <td>

                                                    {doc.expired ? (

                                                        <span className="badge bg-danger">

                                                            Expired

                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-success">

                                                            Active

                                                        </span>

                                                    )}

                                                </td>


                                                {/* Sharing */}

                                                <td>

                                                    <div
                                                        className="d-flex flex-column gap-2"
                                                        style={{
                                                            minWidth:
                                                                "220px"
                                                        }}
                                                    >


                                                        {/* User */}

                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={
                                                                selectedUsers[
                                                                    doc.documentId
                                                                ] || ""
                                                            }
                                                            onChange={(e) =>
                                                                setSelectedUsers({
                                                                    ...selectedUsers,
                                                                    [doc.documentId]:
                                                                        e.target.value
                                                                })
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

                                                                    </option>

                                                                )
                                                            )}

                                                        </select>


                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() =>
                                                                grantUserAccess(
                                                                    doc.documentId
                                                                )
                                                            }
                                                        >

                                                            <i className="bi bi-person-plus me-1"></i>

                                                            Share User

                                                        </button>


                                                        {/* Department */}

                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={
                                                                selectedDepartments[
                                                                    doc.documentId
                                                                ] || ""
                                                            }
                                                            onChange={(e) =>
                                                                setSelectedDepartments({
                                                                    ...selectedDepartments,
                                                                    [doc.documentId]:
                                                                        e.target.value
                                                                })
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


                                                        <button
                                                            className="btn btn-sm btn-outline-info"
                                                            onClick={() =>
                                                                grantDepartmentAccess(
                                                                    doc.documentId
                                                                )
                                                            }
                                                        >

                                                            <i className="bi bi-building me-1"></i>

                                                            Share Department

                                                        </button>

                                                    </div>

                                                </td>


                                                {/* Actions */}

                                                <td>

                                                    <div className="d-flex flex-column gap-2">

                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() =>
                                                                viewDocument(
                                                                    doc
                                                                )
                                                            }
                                                        >

                                                            <i className="bi bi-eye me-1"></i>

                                                            View

                                                        </button>


                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() =>
                                                                downloadDocument(
                                                                    doc.documentId,
                                                                    doc.fileName
                                                                )
                                                            }
                                                        >

                                                            <i className="bi bi-download me-1"></i>

                                                            Download

                                                        </button>


                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() =>
                                                                deleteDocument(
                                                                    doc.documentId
                                                                )
                                                            }
                                                        >

                                                            <i className="bi bi-trash me-1"></i>

                                                            Delete

                                                        </button>

                                                    </div>

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

export default AdminDocuments;