import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function VersionHistory() {

    const { id } = useParams();

    const [versions, setVersions] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        loadVersions();

    }, [id]);

    // ==========================
    // Load Versions
    // ==========================

    const loadVersions = async () => {

        try {

            setLoading(true);

            const response =
                await API.get(
                    `/api/documents/${id}/versions`
                );

            setVersions(response.data);

        } catch (error) {

            console.log(error);

            alert("Failed to load versions");

        } finally {

            setLoading(false);

        }

    };

    // ==========================
    // Select File
    // ==========================

    const handleFileChange = (e) => {

        setSelectedFile(e.target.files[0]);

    };

    // ==========================
    // Upload New Version
    // ==========================

    const uploadVersion = async () => {

        if (!selectedFile) {

            alert("Please select a file.");

            return;

        }

        try {

            const formData = new FormData();

            formData.append("file", selectedFile);

            await API.post(
                `/api/documents/${id}/version`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("New version uploaded successfully.");

            setSelectedFile(null);

            document.getElementById("versionFile").value = "";

            loadVersions();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Upload failed"
            );

        }

    };

    // ==========================
    // Download Version
    // ==========================

    const downloadVersion = async (
        versionId,
        fileName
    ) => {

        try {

            const response =
            await API.get(
                `/api/documents/versions/${versionId}/download`,
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

            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();

        } catch (error) {

            console.log(error);

            alert("Download failed");

        }

    };

    // ==========================
    // Restore Version
    // ==========================

    const restoreVersion = async (
        versionId
    ) => {

        if (
            !window.confirm(
                "Restore this version?"
            )
        ) {

            return;

        }

        try {

            await API.post(
                `/api/documents/versions/${versionId}/restore`
            );

            alert("Version restored successfully.");

            loadVersions();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Restore failed"
            );

        }

    };

    return (

        <div className="container mt-4">

            <h2 className="mb-4">
                Document Version History
            </h2>

            {/* Upload Card */}

            <div className="card shadow mb-4">

                <div className="card-header">
                    Upload New Version
                </div>

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-8">

                            <input
                                id="versionFile"
                                type="file"
                                className="form-control"
                                onChange={handleFileChange}
                            />

                        </div>

                        <div className="col-md-4">

                            <button
                                className="btn btn-primary w-100"
                                onClick={uploadVersion}
                            >

                                Upload Version

                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* Version History */}

            <div className="card shadow">

                <div className="card-header">
                    Version History
                </div>

                <div className="card-body table-responsive">

                    {loading ? (

                        <div>Loading...</div>

                    ) : (

                        <table className="table table-hover align-middle">

                            <thead className="table-dark">

                                <tr>

                                    <th>Version</th>

                                    <th>File Name</th>

                                    <th>Created At</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {versions.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="text-center text-muted"
                                        >

                                            No Versions Found

                                        </td>

                                    </tr>

                                ) : (

                                    versions.map((version) => (

                                        <tr key={version.versionId}>

                                            <td>

                                                <span className="badge bg-primary">

                                                    V{version.versionNumber}

                                                </span>

                                            </td>

                                            <td>

                                                <i className="bi bi-file-earmark-text me-2"></i>

                                                {version.fileName}

                                            </td>

                                            <td>

                                                {new Date(
                                                    version.createdAt
                                                ).toLocaleString()}

                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-outline-primary btn-sm me-2"
                                                    onClick={() =>
                                                        downloadVersion(
                                                            version.versionId,
                                                            version.fileName
                                                        )
                                                    }
                                                >

                                                    <i className="bi bi-download me-1"></i>

                                                    Download

                                                </button>

                                                <button
                                                    className="btn btn-outline-success btn-sm"
                                                    onClick={() =>
                                                        restoreVersion(
                                                            version.versionId
                                                        )
                                                    }
                                                >

                                                    <i className="bi bi-arrow-counterclockwise me-1"></i>

                                                    Restore

                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    )}

                </div>

            </div>

        </div>

    );

}

export default VersionHistory;