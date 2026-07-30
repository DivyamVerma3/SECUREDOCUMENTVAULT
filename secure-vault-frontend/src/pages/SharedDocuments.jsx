import { useEffect, useState } from "react";
import API from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

function SharedDocuments() {

    const [sharedDocs, setSharedDocs] = useState([]);
    const [originalSharedDocs, setOriginalSharedDocs] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    const loadSharedDocuments = async () => {

    try {

        setLoading(true);

        // User shared documents
        const userResponse =
            await API.get("/api/access/my");

        // Department shared documents
        const departmentResponse =
            await API.get("/api/access/my-department");

        const userShares =
            userResponse.data || [];

        const departmentShares =
            departmentResponse.data || [];

        // Merge both lists
        const allShares = [
            ...userShares,
            ...departmentShares
        ];

        setSharedDocs(allShares);
        setOriginalSharedDocs(allShares);

    } catch (error) {

        console.log(error);

        alert("Failed to load shared documents");

    } finally {

        setLoading(false);

    }

};

    useEffect(() => {

        loadSharedDocuments();

    }, []);

    const searchSharedDocuments = () => {

        if (!keyword.trim()) {

            setSharedDocs(originalSharedDocs);

            return;

        }

        const filtered = originalSharedDocs.filter(doc =>
            doc.fileName
                ?.toLowerCase()
                .includes(keyword.toLowerCase())
        );

        setSharedDocs(filtered);

    };

    const resetSearch = () => {

        setKeyword("");

        setSharedDocs(originalSharedDocs);

    };

    const downloadDocument = async (id, fileName) => {

        try {

            const response =
                await API.get(
                    `/api/documents/download/${id}`,
                    {
                        responseType: "blob"
                    }
                );

            const url =
                window.URL.createObjectURL(response.data);

            const link =
                document.createElement("a");

            link.href = url;
            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();

        } catch (error) {

            alert("Download Failed");

        }

    };

    const viewDocument = async (doc) => {

        try {

            const extension =
                doc.fileName
                    .split(".")
                    .pop()
                    .toLowerCase();

            if (
                extension === "pdf" ||
                extension === "jpg" ||
                extension === "jpeg" ||
                extension === "png"
            ) {

                const response =
                    await API.get(
                        `/api/documents/download/${doc.documentId}`,
                        {
                            responseType: "blob"
                        }
                    );

                const fileURL =
                    window.URL.createObjectURL(response.data);

                window.open(fileURL, "_blank");

            } else {

                downloadDocument(
                    doc.documentId,
                    doc.fileName
                );

            }

        } catch (error) {

            alert("View Failed");

        }

    };

    return (

        <>

            <div className="mb-4">

                <h2 className="fw-bold">

                    Shared Documents

                </h2>

                <p className="text-muted">

                    Documents shared directly with you or your department.

                </p>

            </div>

            <div className="card p-4">

                <div className="d-flex mb-3">

                    <input
                        className="form-control me-2"
                        placeholder="Search shared documents..."
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)
                        }
                    />

                    <button
                        className="btn btn-primary me-2"
                        onClick={searchSharedDocuments}
                    >

                        Search

                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={resetSearch}
                    >

                        Reset

                    </button>

                </div>

                {

                    loading ?

                        <LoadingSpinner
                            text="Loading shared documents..."
                        />

                        :

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead className="table-light">

                                    <tr>

                                        <th>ID</th>

                                        <th>File Name</th>

                                        <th>Uploaded By</th>

                                        <th>Expiry</th>

                                        <th>Status</th>

                                        <th>Actions</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        sharedDocs.length === 0 ?

                                            <tr>

                                                <td
                                                    colSpan="6"
                                                    className="text-center text-muted"
                                                >

                                                    No shared documents found

                                                </td>

                                            </tr>

                                            :

                                            sharedDocs.map(doc => (

                                                <tr key={doc.documentId}>

                                                    <td>

                                                        {doc.documentId}

                                                    </td>

                                                    <td>

                                                        <i className="bi bi-file-earmark-lock text-primary me-2"></i>

                                                        {doc.fileName}

                                                    </td>

                                                    <td>

                                                        {doc.user?.username}

                                                    </td>

                                                    <td>

                                                        {

                                                            doc.expiryDate

                                                                ?

                                                                new Date(
                                                                    doc.expiryDate
                                                                ).toLocaleString()

                                                                :

                                                                "Never"

                                                        }

                                                    </td>

                                                    <td>

                                                        {

                                                            doc.expired

                                                                ?

                                                                <span className="badge bg-danger">

                                                                    Expired

                                                                </span>

                                                                :

                                                                <span className="badge bg-success">

                                                                    Active

                                                                </span>

                                                        }

                                                    </td>

                                                    <td>

                                                        <button
                                                            className="btn btn-sm btn-outline-primary me-2"
                                                            onClick={() =>
                                                                viewDocument(doc)
                                                            }
                                                        >

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

                                                            Download

                                                        </button>

                                                    </td>

                                                </tr>

                                            ))

                                    }

                                </tbody>

                            </table>

                        </div>

                }

            </div>

        </>

    );

}

export default SharedDocuments;