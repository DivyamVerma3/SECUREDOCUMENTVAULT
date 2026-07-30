import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import SearchBar from "../components/common/SearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";

function MyDocuments() {

    const [documents, setDocuments] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const response = await API.get("/api/documents/my");
            setDocuments(response.data);
        } catch (error) {
            alert("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    const searchDocuments = async () => {
        if (!keyword.trim()) {
            loadDocuments();
            return;
        }

        try {
            const response = await API.get("/api/documents/my");

            const filtered = response.data.filter((doc) =>
                doc.fileName
                    ?.toLowerCase()
                    .includes(keyword.toLowerCase())
            );

            setDocuments(filtered);

        } catch (error) {
            alert("Search Failed");
        }
    };

    const downloadDocument = async (id, fileName) => {
        const response = await API.get(
            `/api/documents/download/${id}`,
            { responseType: "blob" }
        );

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

        if (
            extension === "pdf" ||
            extension === "jpg" ||
            extension === "jpeg" ||
            extension === "png"
        ) {
            const response = await API.get(
                `/api/documents/download/${doc.documentId}`,
                { responseType: "blob" }
            );

            const fileURL = window.URL.createObjectURL(response.data);
            window.open(fileURL, "_blank");
        } else {
            downloadDocument(doc.documentId, doc.fileName);
        }
    };

    const deleteDocument = async (id) => {
        if (!window.confirm("Delete this document?")) {
            return;
        }

        try {
            const response = await API.delete(`/api/documents/${id}`);
            alert(response.data);
            loadDocuments();
        } catch (error) {
            alert("Delete Failed");
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold">My Documents</h2>
                    <p className="text-muted">
                        Manage your uploaded secure documents.
                    </p>
                </div>
            </div>

            <div className="card p-4">
                <SearchBar
                    keyword={keyword}
                    setKeyword={setKeyword}
                    onSearch={searchDocuments}
                    onReset={() => {
                        setKeyword("");
                        loadDocuments();
                    }}
                    placeholder="Search by file name..."
                />

                {loading ? (
                    <LoadingSpinner
                        text="Loading your documents..."
                    />
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>File Name</th>
                                    <th>Upload Date</th>
                                    <th>Expiry</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {documents.length === 0 ? (
                                    <tr>
                                    <td colSpan="6">
                                        <EmptyState
                                            icon="bi-folder-x"
                                            title="No Documents Found"
                                            message="Upload your first secure document to get started."
                                            buttonText="Upload Document"
                                            buttonLink="/upload"
                                        />
                                    </td>
                                </tr>
                                ) : (
                                    documents.map((doc) => (
                                        <tr key={doc.documentId}>
                                            <td>{doc.documentId}</td>
                                            <td>
                                                <i className="bi bi-file-earmark-text text-primary me-2"></i>
                                                {doc.fileName}
                                            </td>
                                            <td>
                                                {doc.uploadDate
                                                    ? new Date(doc.uploadDate).toLocaleString()
                                                    : "-"}
                                            </td>
                                            <td>
                                                {doc.expiryDate
                                                    ? new Date(doc.expiryDate).toLocaleString()
                                                    : "Never"}
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
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => viewDocument(doc)}
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-outline-success me-2"
                                                    onClick={() =>
                                                        downloadDocument(
                                                            doc.documentId,
                                                            doc.fileName
                                                        )
                                                    }
                                                >
                                                    Download
                                                </button>
                                                <button
    className="btn btn-sm btn-warning me-2"
    onClick={() =>
        navigate(`/documents/${doc.documentId}/versions`)
    }
>
    Versions
</button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        deleteDocument(doc.documentId)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

export default MyDocuments;