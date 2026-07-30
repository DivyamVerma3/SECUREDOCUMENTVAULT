import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminDashboard() {

    const [stats, setStats] = useState({
        users: 0,
        documents: 0,
        userShares: 0,
        departmentShares: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {

        try {

            const [
                usersResponse,
                documentsResponse,
                accessResponse,
                departmentAccessResponse
            ] = await Promise.all([
                API.get("/api/admin/users"),
                API.get("/api/admin/documents"),
                API.get("/api/access/all"),
                API.get("/api/access/department/all")
            ]);

            setStats({
                users: Array.isArray(usersResponse.data)
                    ? usersResponse.data.length
                    : 0,

                documents: Array.isArray(documentsResponse.data)
                    ? documentsResponse.data.length
                    : 0,

                userShares: Array.isArray(accessResponse.data)
                    ? accessResponse.data.length
                    : 0,

                departmentShares:
                    Array.isArray(departmentAccessResponse.data)
                        ? departmentAccessResponse.data.length
                        : 0
            });

        } catch (error) {

            console.log(
                "Admin dashboard error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid mt-4">

            <div className="mb-4">

                <h2 className="fw-bold">

                    <i className="bi bi-speedometer2 me-2"></i>

                    Admin Dashboard

                </h2>

                <p className="text-muted">

                    Overview of users, documents and access
                    management.

                </p>

            </div>


            <div className="row g-4">


                {/* Users */}

                <div className="col-md-3">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between">

                                <div>

                                    <h6 className="text-muted">

                                        Total Users

                                    </h6>

                                    <h2 className="fw-bold">

                                        {loading
                                            ? "..."
                                            : stats.users}

                                    </h2>

                                </div>

                                <i className="bi bi-people fs-1 text-primary"></i>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Documents */}

                <div className="col-md-3">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between">

                                <div>

                                    <h6 className="text-muted">

                                        Documents

                                    </h6>

                                    <h2 className="fw-bold">

                                        {loading
                                            ? "..."
                                            : stats.documents}

                                    </h2>

                                </div>

                                <i className="bi bi-folder2-open fs-1 text-success"></i>

                            </div>

                        </div>

                    </div>

                </div>


                {/* User Shares */}

                <div className="col-md-3">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between">

                                <div>

                                    <h6 className="text-muted">

                                        User Shares

                                    </h6>

                                    <h2 className="fw-bold">

                                        {loading
                                            ? "..."
                                            : stats.userShares}

                                    </h2>

                                </div>

                                <i className="bi bi-share fs-1 text-info"></i>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Department Shares */}

                <div className="col-md-3">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between">

                                <div>

                                    <h6 className="text-muted">

                                        Department Shares

                                    </h6>

                                    <h2 className="fw-bold">

                                        {loading
                                            ? "..."
                                            : stats.departmentShares}

                                    </h2>

                                </div>

                                <i className="bi bi-building fs-1 text-warning"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* Quick Information */}

            <div className="row mt-4">

                <div className="col-md-6">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h5 className="fw-bold">

                                <i className="bi bi-shield-lock me-2"></i>

                                Administration

                            </h5>

                            <p className="text-muted mb-0">

                                Manage employees, roles, departments,
                                documents and access permissions.

                            </p>

                        </div>

                    </div>

                </div>


                <div className="col-md-6">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h5 className="fw-bold">

                                <i className="bi bi-activity me-2"></i>

                                Monitoring

                            </h5>

                            <p className="text-muted mb-0">

                                Monitor document activity, audit logs
                                and system usage.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;