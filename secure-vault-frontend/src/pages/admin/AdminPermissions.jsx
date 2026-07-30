import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminPermissions() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const roles = [
        "USER",
        "MANAGER",
        "HR",
        "ADMIN"
    ];

    useEffect(() => {

        loadUsers();

    }, []);

    const loadUsers = async () => {

        setLoading(true);

        try {

            const response =
                await API.get("/api/admin/users");

            setUsers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.log(
                "Failed to load users:",
                error
            );

            alert(
                error.response?.data ||
                "Unable to load users."
            );

        } finally {

            setLoading(false);

        }

    };


    const updateRole = async (
        userId,
        roleName
    ) => {

        if (!roleName) {

            return;

        }

        setUpdating(true);

        try {

            const response = await API.put(
                `/api/admin/users/${userId}/role?roleName=${roleName}`
            );

            alert(
                response.data ||
                "Role updated successfully."
            );

            await loadUsers();

        } catch (error) {

            console.log(
                "Role update error:",
                error
            );

            alert(
                error.response?.data ||
                "Unable to update role."
            );

        } finally {

            setUpdating(false);

        }

    };


    const getRoleDescription = (
        role
    ) => {

        switch (role) {

            case "ADMIN":
                return "Full system administration and access control.";

            case "HR":
                return "Manage employees, departments and documents.";

            case "MANAGER":
                return "Manage department members and department documents.";

            case "USER":
                return "Upload, manage and access permitted documents.";

            default:
                return "No description available.";

        }

    };


    const getRoleBadge = (
        role
    ) => {

        switch (role) {

            case "ADMIN":
                return "bg-danger";

            case "HR":
                return "bg-warning text-dark";

            case "MANAGER":
                return "bg-primary";

            default:
                return "bg-secondary";

        }

    };


    return (

        <div className="container-fluid mt-4">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">

                        <i className="bi bi-shield-check me-2"></i>

                        Roles & Permissions

                    </h2>

                    <p className="text-muted mb-0">

                        Manage user roles and system permissions.

                    </p>

                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={loadUsers}
                    disabled={loading}
                >

                    <i className="bi bi-arrow-clockwise me-2"></i>

                    Refresh

                </button>

            </div>


            {/* Role Information */}

            <div className="row g-4 mb-4">

                {roles.map(
                    role => (

                        <div
                            className="col-md-6 col-xl-3"
                            key={role}
                        >

                            <div className="card shadow-sm h-100">

                                <div className="card-body">

                                    <div className="d-flex justify-content-between align-items-center mb-3">

                                        <h5 className="mb-0">

                                            {role}

                                        </h5>

                                        <span
                                            className={`badge ${getRoleBadge(role)}`}
                                        >

                                            {role}

                                        </span>

                                    </div>

                                    <p className="text-muted small mb-0">

                                        {
                                            getRoleDescription(
                                                role
                                            )
                                        }

                                    </p>

                                </div>

                            </div>

                        </div>

                    )
                )}

            </div>


            {/* User Permissions */}

            <div className="card shadow-sm">

                <div className="card-header">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-0">

                            <i className="bi bi-people me-2"></i>

                            User Roles

                        </h5>

                        <span className="badge bg-secondary">

                            {users.length} Users

                        </span>

                    </div>

                </div>


                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-hover table-bordered align-middle">

                            <thead className="table-dark">

                                <tr>

                                    <th>ID</th>

                                    <th>User</th>

                                    <th>Email</th>

                                    <th>Department</th>

                                    <th>Current Role</th>

                                    <th>Change Role</th>

                                    <th>Permission Summary</th>

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
                                                className="spinner-border"
                                                role="status"
                                            >
                                            </div>

                                            <div className="mt-2">

                                                Loading users...

                                            </div>

                                        </td>

                                    </tr>

                                ) : users.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center text-muted py-4"
                                        >

                                            No users found.

                                        </td>

                                    </tr>

                                ) : (

                                    users.map(
                                        user => {

                                            const currentRole =
                                                user.role?.roleName ||
                                                "USER";

                                            return (

                                                <tr
                                                    key={
                                                        user.userId
                                                    }
                                                >

                                                    <td>

                                                        {
                                                            user.userId
                                                        }

                                                    </td>


                                                    <td>

                                                        <strong>

                                                            {
                                                                user.username
                                                            }

                                                        </strong>

                                                    </td>


                                                    <td>

                                                        {
                                                            user.email
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            user.department
                                                                ?.departmentName ||
                                                            "Not Assigned"
                                                        }

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`badge ${getRoleBadge(currentRole)}`}
                                                        >

                                                            {
                                                                currentRole
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <select
                                                            className="form-select form-select-sm"
                                                            defaultValue={
                                                                currentRole
                                                            }
                                                            disabled={
                                                                updating
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                updateRole(
                                                                    user.userId,
                                                                    e.target.value
                                                                )
                                                            }
                                                        >

                                                            {roles.map(
                                                                role => (

                                                                    <option
                                                                        key={
                                                                            role
                                                                        }
                                                                        value={
                                                                            role
                                                                        }
                                                                    >

                                                                        {
                                                                            role
                                                                        }

                                                                    </option>

                                                                )
                                                            )}

                                                        </select>

                                                    </td>


                                                    <td>

                                                        <small className="text-muted">

                                                            {
                                                                getRoleDescription(
                                                                    currentRole
                                                                )
                                                            }

                                                        </small>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>


            {/* Permission Matrix */}

            <div className="card shadow-sm mt-4">

                <div className="card-header">

                    <h5 className="mb-0">

                        <i className="bi bi-grid-3x3-gap me-2"></i>

                        Permission Matrix

                    </h5>

                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-bordered text-center align-middle">

                            <thead className="table-light">

                                <tr>

                                    <th className="text-start">

                                        Permission

                                    </th>

                                    <th>USER</th>

                                    <th>MANAGER</th>

                                    <th>HR</th>

                                    <th>ADMIN</th>

                                </tr>

                            </thead>

                            <tbody>

                                <tr>

                                    <td className="text-start">

                                        Upload Documents

                                    </td>

                                    <td>✓</td>

                                    <td>✓</td>

                                    <td>✓</td>

                                    <td>✓</td>

                                </tr>

                                <tr>

                                    <td className="text-start">

                                        View Own Documents

                                    </td>

                                    <td>✓</td>

                                    <td>✓</td>

                                    <td>✓</td>

                                    <td>✓</td>

                                </tr>

                                <tr>

                                    <td className="text-start">

                                        Manage Department Documents

                                    </td>

                                    <td>—</td>

                                    <td>✓</td>

                                    <td>✓</td>

                                    <td>✓</td>

                                </tr>

                                <tr>

                                    <td className="text-start">

                                        Manage Employees

                                    </td>

                                    <td>—</td>

                                    <td>Department</td>

                                    <td>✓</td>

                                    <td>✓</td>

                                </tr>

                                <tr>

                                    <td className="text-start">

                                        Manage Departments

                                    </td>

                                    <td>—</td>

                                    <td>—</td>

                                    <td>✓</td>

                                    <td>✓</td>

                                </tr>

                                <tr>

                                    <td className="text-start">

                                        Manage User Roles

                                    </td>

                                    <td>—</td>

                                    <td>—</td>

                                    <td>—</td>

                                    <td>✓</td>

                                </tr>

                                <tr>

                                    <td className="text-start">

                                        View Audit Logs

                                    </td>

                                    <td>—</td>

                                    <td>—</td>

                                    <td>—</td>

                                    <td>✓</td>

                                </tr>

                                <tr>

                                    <td className="text-start">

                                        System Administration

                                    </td>

                                    <td>—</td>

                                    <td>—</td>

                                    <td>—</td>

                                    <td>✓</td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminPermissions;