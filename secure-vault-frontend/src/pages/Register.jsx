import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import PageHeader from "../components/common/PageHeader";
import InfoTooltip from "../components/common/InfoTooltip";

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [departments, setDepartments] = useState([]);
    const [departmentId, setDepartmentId] = useState("");
    const [roleName, setRoleName] = useState("USER");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await API.get("/api/departments");
            setDepartments(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const createUser = async (e) => {
        e.preventDefault();

        const usernameRegex = /^[A-Za-z][A-Za-z0-9_ ]{2,29}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/?])\S{8,}$/;

        if (!usernameRegex.test(username)) {
            alert("Invalid Username\nExample: Divyam_Verma");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("Invalid Email\nExample: john@example.com");
            return;
        }

        if (!passwordRegex.test(password)) {
            alert(
                "Invalid Password!\n\nPassword must be at least 8 characters and include uppercase, lowercase, number, and special character.\n\nExample: Secure@123"
            );
            return;
        }

        try {
            setLoading(true);

            await API.post("/api/auth/register", {
                username,
                email,
                password
            });

            const usersResponse = await API.get("/api/admin/users");

            const createdUser = usersResponse.data.find(
                (user) => user.email === email
            );

            if (!createdUser) {
                alert("User created, but could not find user for configuration.");
                return;
            }

            await API.put(
                `/api/admin/users/${createdUser.userId}/role?roleName=${roleName}`
            );

            if (departmentId) {
                await API.put(
                    `/api/admin/users/${createdUser.userId}/department?departmentId=${departmentId}`
                );
            }

            alert("User created and configured successfully.");

            navigate("/dashboard", { replace: true });

        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "User Creation Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageHeader
                title="Create User"
                subtitle="Create a new employee account and assign role/department."
                icon="bi-person-plus-fill"
            />

            <div className="card shadow-sm p-4">

                <form onSubmit={createUser}>

                    <div className="row g-4">

                        <div className="col-lg-6">

                            <div className="border rounded p-4 h-100 bg-white">

                                <h5 className="fw-bold mb-3">
                                    <i className="bi bi-person-lines-fill text-primary me-2"></i>
                                    User Information
                                </h5>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Username
                                        <InfoTooltip text="3–30 characters. Starts with a letter. Example: Divyam_Verma" />
                                    </label>

                                    <input
                                        className="form-control"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />

                                    <div className="form-text">
                                        Example: <strong>Divyam_Verma</strong>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Email
                                        <InfoTooltip text="Enter valid email. Example: john@example.com" />
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />

                                    <div className="form-text">
                                        Example: <strong>john@example.com</strong>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Password
                                        <InfoTooltip text="Minimum 8 characters with uppercase, lowercase, number and special character. Example: Secure@123" />
                                    </label>

                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            <i
                                                className={`bi ${
                                                    showPassword
                                                        ? "bi-eye-slash-fill"
                                                        : "bi-eye-fill"
                                                }`}
                                            ></i>
                                        </button>
                                    </div>

                                    <div className="form-text">
                                        Example: <strong>Secure@123</strong>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="col-lg-6">

                            <div className="border rounded p-4 h-100 bg-white">

                                <h5 className="fw-bold mb-3">
                                    <i className="bi bi-gear-fill text-primary me-2"></i>
                                    User Configuration
                                </h5>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Assign Role
                                    </label>

                                    <select
                                        className="form-select"
                                        value={roleName}
                                        onChange={(e) =>
                                            setRoleName(e.target.value)
                                        }
                                    >
                                        <option value="USER">USER</option>
                                        <option value="MANAGER">MANAGER</option>
                                        <option value="HR">HR</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>

                                    <div className="form-text">
                                        Select the access level for the new user.
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Department
                                    </label>

                                    <select
                                        className="form-select"
                                        value={departmentId}
                                        onChange={(e) =>
                                            setDepartmentId(e.target.value)
                                        }
                                    >
                                        <option value="">Select Department</option>

                                        {departments.map((department) => (
                                            <option
                                                key={department.departmentId}
                                                value={department.departmentId}
                                            >
                                                {department.departmentName}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="form-text">
                                        Assign the user to a department.
                                    </div>
                                </div>

                                <div className="alert alert-info mt-4 mb-0">
                                    <i className="bi bi-info-circle me-2"></i>
                                    The user will be created first, then role and department will be assigned automatically.
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="d-flex justify-content-end mt-4 gap-2">

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => navigate("/dashboard")}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Creating User..." : "Create User"}
                        </button>

                    </div>

                </form>

            </div>
        </>
    );
}

export default Register;