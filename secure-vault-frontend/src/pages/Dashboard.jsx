import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";

function Dashboard() {

    const navigate = useNavigate();

    const [myDocuments, setMyDocuments] = useState([]);
    const [sharedDocs, setSharedDocs] = useState([]);

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);

        const handleBackButton = () => {
            localStorage.removeItem("token");
            navigate("/login", { replace: true });
        };

        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [navigate]);

    const loadDashboardData = async () => {
        try {
            const myResponse = await API.get("/api/documents/my");
            const sharedResponse = await API.get("/api/access/my");

            setMyDocuments(myResponse.data);
            setSharedDocs(sharedResponse.data);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const expiredCount = myDocuments.filter(
        (doc) => doc.expired
    ).length;

    return (
        <>
            <PageHeader
                title="Dashboard"
                subtitle="Welcome to Secure Document Vault"
                icon="bi-speedometer2"
            />

            <div className="row g-4 mb-4">

                <div className="col-lg-3 col-md-6">
                    <StatCard
                        title="My Documents"
                        value={myDocuments.length}
                        icon="bi-folder2-open"
                        color="primary"
                        subtitle="Uploaded Files"
                    />
                </div>

                <div className="col-lg-3 col-md-6">
                    <StatCard
                        title="Shared With Me"
                        value={sharedDocs.length}
                        icon="bi-share"
                        color="success"
                        subtitle="Received"
                    />
                </div>

                <div className="col-lg-3 col-md-6">
                    <StatCard
                        title="Expired"
                        value={expiredCount}
                        icon="bi-exclamation-triangle"
                        color="warning"
                        subtitle="Need Attention"
                    />
                </div>

                <div className="col-lg-3 col-md-6">
                    <StatCard
                        title="Encryption"
                        value="AES"
                        icon="bi-lock-fill"
                        color="danger"
                        subtitle="Protected"
                    />
                </div>

            </div>

            <div className="row g-4">

                <div className="col-md-8">

                    <div className="card p-4">

                        <h5 className="fw-bold mb-3">
                            Recent Documents
                        </h5>

                        <table className="table table-hover">

                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Status</th>
                                    <th>Type</th>
                                </tr>
                            </thead>

                            <tbody>

                                {myDocuments.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center text-muted"
                                        >
                                            No documents uploaded
                                        </td>
                                    </tr>

                                ) : (

                                    myDocuments
                                        .slice(0, 5)
                                        .map((doc) => (

                                            <tr key={doc.documentId}>

                                                <td>{doc.fileName}</td>

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
                                                    {doc.fileName
                                                        .split(".")
                                                        .pop()
                                                        .toUpperCase()}
                                                </td>

                                            </tr>

                                        ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card p-4">

                        <h5 className="fw-bold mb-3">
                            Quick Actions
                        </h5>

                        <div className="d-grid gap-3">

                            <Link
                                to="/upload"
                                className="btn btn-primary"
                            >
                                <i className="bi bi-upload me-2"></i>
                                Upload Document
                            </Link>

                            <Link
                                to="/my-documents"
                                className="btn btn-outline-primary"
                            >
                                <i className="bi bi-folder me-2"></i>
                                My Documents
                            </Link>

                            <Link
                                to="/shared"
                                className="btn btn-outline-success"
                            >
                                <i className="bi bi-share me-2"></i>
                                Shared Documents
                            </Link>

                            <Link
                                to="/profile"
                                className="btn btn-outline-dark"
                            >
                                <i className="bi bi-person me-2"></i>
                                Profile
                            </Link>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Dashboard;