import { useState } from "react";
import API from "../services/api";

function Upload() {

    const [file, setFile] = useState(null);
    const [expiryDate, setExpiryDate] = useState("");
    const [loading, setLoading] = useState(false);

    const uploadFile = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        if (expiryDate) {
            formData.append("expiryDate", expiryDate);
        }

        try {
            setLoading(true);

            const response = await API.post(
                "/api/documents/upload",
                formData
            );

            alert(response.data);

            setFile(null);
            setExpiryDate("");

        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Upload Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mb-4">
                <h2 className="fw-bold">Upload Document</h2>
                <p className="text-muted">
                    Upload secure encrypted documents with optional expiry date.
                </p>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-7">
                    <div className="card p-4">

                        <form onSubmit={uploadFile}>

                            <div className="text-center mb-4">
                                <i className="bi bi-cloud-arrow-up-fill text-primary display-3"></i>
                                <h5 className="fw-bold mt-2">
                                    Select Document
                                </h5>
                                <p className="text-muted">
                                    PDF, DOC, DOCX supported
                                </p>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Choose File
                                </label>

                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) =>
                                        setFile(e.target.files[0])
                                    }
                                />
                            </div>

                            {file && (
                                <div className="alert alert-info">
                                    <strong>Selected:</strong> {file.name}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Expiry Date
                                </label>

                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={expiryDate}
                                    onChange={(e) =>
                                        setExpiryDate(e.target.value)
                                    }
                                />

                                <small className="text-muted">
                                    Leave blank if document should never expire.
                                </small>
                            </div>

                            <button
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? "Uploading..." : "Upload Document"}
                            </button>

                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Upload;