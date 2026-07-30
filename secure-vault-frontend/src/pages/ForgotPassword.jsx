import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import InfoTooltip from "../components/common/InfoTooltip";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const resetPassword = async (e) => {

        e.preventDefault();

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/?])\S{8,}$/;

        if (!emailRegex.test(email)) {
            alert("Invalid Email\n\nExample: john@example.com");
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            alert(
                "Invalid Password!\n\nPassword must:\n• Be at least 8 characters long\n• Contain at least one uppercase letter (A-Z)\n• Contain at least one lowercase letter (a-z)\n• Contain at least one number (0-9)\n• Contain at least one special character (!@#$%^&* etc.)"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            setLoading(true);

            const response = await API.post(
                "/api/auth/forgot-password",
                {
                    email,
                    newPassword
                }
            );

            alert(response.data);

            navigate("/login");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Password Reset Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg,#2563eb,#1e293b)"
            }}
        >

            <div
                className="card shadow-lg p-4"
                style={{
                    width: "460px",
                    borderRadius: "20px"
                }}
            >

                <div className="text-center mb-4">

                    <i className="bi bi-key-fill text-primary fs-1"></i>

                    <h3>Reset Password</h3>

                    <p className="text-muted">
                        Enter your registered email and create a new password.
                    </p>

                </div>

                <form onSubmit={resetPassword}>

                    <div className="mb-3">

                        <label className="form-label">

                            Email

                            <InfoTooltip
                                text="Enter your registered email address. Example: john@example.com"
                            />

                        </label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter registered email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                        <div className="form-text">
                            Example:
                            <strong> john@example.com</strong>
                        </div>

                    </div>

                    <div className="mb-3">

                        <label className="form-label">

                            New Password

                            <InfoTooltip
                                text="Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character. Example: Secure@123"
                            />

                        </label>

                        <div className="input-group">

                            <input
                                type={showNewPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                            >
                                <i
                                    className={`bi ${
                                        showNewPassword
                                            ? "bi-eye-slash-fill"
                                            : "bi-eye-fill"
                                    }`}
                                ></i>
                            </button>

                        </div>

                        <div className="form-text">
                            Minimum 8 characters. Must include uppercase, lowercase, number, and special character.
                            Example:
                            <strong> Secure@123</strong>
                        </div>

                    </div>

                    <div className="mb-4">

                        <label className="form-label">

                            Confirm Password

                            <InfoTooltip
                                text="Re-enter the same password exactly as above."
                            />

                        </label>

                        <div className="input-group">

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >
                                <i
                                    className={`bi ${
                                        showConfirmPassword
                                            ? "bi-eye-slash-fill"
                                            : "bi-eye-fill"
                                    }`}
                                ></i>
                            </button>

                        </div>

                        <div className="form-text">
                            Passwords must match exactly.
                        </div>

                    </div>

                    <button
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >

                        {loading
                            ? "Resetting..."
                            : "Reset Password"}

                    </button>

                </form>

                <div className="text-center mt-3">

                    <Link to="/login">
                        Back to Login
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default ForgotPassword;