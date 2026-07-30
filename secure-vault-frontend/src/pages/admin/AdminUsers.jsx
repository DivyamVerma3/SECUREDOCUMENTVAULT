import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        setLoading(true);

        try {

            const [usersResponse, departmentsResponse] =
                await Promise.all([
                    API.get("/api/admin/users"),
                    API.get("/api/departments")
                ]);

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
                "Failed to load admin users:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    const updateRole = async (userId, role) => {

        try {

            const response = await API.put(
                `/api/admin/users/${userId}/role`,
                null,
                {
                    params: {
                        roleName: role
                    }
                }
            );

            alert(
                response.data ||
                "Role updated successfully."
            );

            loadData();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Unable to update role."
            );

        }

    };


    const updateDepartment = async (
        userId,
        departmentId
    ) => {

        if (!departmentId) {

            return;

        }

        try {

            const response = await API.put(
                `/api/admin/users/${userId}/department`,
                null,
                {
                    params: {
                        departmentId
                    }
                }
            );

            alert(
                response.data ||
                "Department updated successfully."
            );

            loadData();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Unable to update department."
            );

        }

    };


    const deleteUser = async (userId) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this user?"
            )
        ) {

            return;

        }

        try {

            const response = await API.delete(
                `/api/admin/users/${userId}`
            );

            alert(
                response.data ||
                "User deleted successfully."
            );

            loadData();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Unable to delete user."
            );

        }

    };


    const filteredUsers = users.filter(
        user => {

            const searchText =
                search.toLowerCase();

            return (

                user.username
                    ?.toLowerCase()
                    .includes(searchText) ||

                user.email
                    ?.toLowerCase()
                    .includes(searchText) ||

                user.role?.roleName
                    ?.toLowerCase()
                    .includes(searchText) ||

                user.department?.departmentName
                    ?.toLowerCase()
                    .includes(searchText)

            );

        }
    );


    return (

        <div className="container-fluid mt-4">


            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">

                        <i className="bi bi-people me-2"></i>

                        Employee Management

                    </h2>

                    <p className="text-muted mb-0">

                        Manage users, roles and departments.

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

                    <div className="row">

                        <div className="col-md-5">

                            <label className="form-label fw-semibold">

                                Search Employees

                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username, email, role or department..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* Users Table */}

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-hover table-bordered align-middle">

                            <thead className="table-dark">

                                <tr>

                                    <th>ID</th>

                                    <th>Username</th>

                                    <th>Email</th>

                                    <th>Role</th>

                                    <th>Department</th>

                                    <th>Status</th>

                                    <th style={{ minWidth: "260px" }}>
                                        Actions
                                    </th>

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

                                                Loading users...

                                            </div>

                                        </td>

                                    </tr>

                                ) : filteredUsers.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center py-4 text-muted"
                                        >

                                            No users found.

                                        </td>

                                    </tr>

                                ) : (

                                    filteredUsers.map(
                                        user => (

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

                                                    <span
                                                        className={
                                                            user.role?.roleName === "ADMIN"
                                                                ? "badge bg-danger"
                                                                : user.role?.roleName === "HR"
                                                                    ? "badge bg-warning text-dark"
                                                                    : user.role?.roleName === "MANAGER"
                                                                        ? "badge bg-primary"
                                                                        : "badge bg-secondary"
                                                        }
                                                    >

                                                        {
                                                            user.role?.roleName ||
                                                            "USER"
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    {
                                                        user.department
                                                            ?.departmentName ||
                                                        "Not Assigned"
                                                    }

                                                </td>


                                                <td>

                                                    {user.active ? (

                                                        <span className="badge bg-success">

                                                            Active

                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-danger">

                                                            Inactive

                                                        </span>

                                                    )}

                                                </td>


                                                <td>

                                                    <div className="d-flex flex-column gap-2">


                                                        {/* Role */}

                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={
                                                                user.role?.roleName ||
                                                                "USER"
                                                            }
                                                            onChange={
                                                                (e) =>
                                                                    updateRole(
                                                                        user.userId,
                                                                        e.target.value
                                                                    )
                                                            }
                                                        >

                                                            <option value="USER">
                                                                USER
                                                            </option>

                                                            <option value="MANAGER">
                                                                MANAGER
                                                            </option>

                                                            <option value="HR">
                                                                HR
                                                            </option>

                                                            <option value="ADMIN">
                                                                ADMIN
                                                            </option>

                                                        </select>


                                                        {/* Department */}

                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={
                                                                user.department?.departmentId ||
                                                                ""
                                                            }
                                                            onChange={
                                                                (e) =>
                                                                    updateDepartment(
                                                                        user.userId,
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


                                                        {/* Delete */}

                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() =>
                                                                deleteUser(
                                                                    user.userId
                                                                )
                                                            }
                                                        >

                                                            <i className="bi bi-trash me-1"></i>

                                                            Delete User

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

export default AdminUsers;