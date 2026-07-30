import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import InfoTooltip from "../components/common/InfoTooltip";

function Login() {
    const navigate = useNavigate();
    const { login, logout } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        logout();
        localStorage.removeItem("token");
        sessionStorage.clear();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Enter email and password");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/api/auth/login", {
                email,
                password
            });

            login(response.data);

            alert("Login Successful");

            navigate("/dashboard", { replace: true });

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Invalid Credentials"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #2563eb, #1e293b)"
            }}
        >
            <div
                className="card p-4 shadow-lg"
                style={{
                    width: "420px",
                    borderRadius: "20px"
                }}
            >
                <div className="text-center mb-4">
                    <i className="bi bi-shield-lock-fill text-primary fs-1"></i>
                    <h3 className="fw-bold mt-2">Secure Vault</h3>
                    <p className="text-muted">Login to your account</p>
                </div>

                <form onSubmit={handleLogin}>

                    <div className="mb-3">
                        <label className="form-label">
                            <label className="form-label">
                                Email

                                <InfoTooltip
                                    text="Enter a valid email address. Example: john@example.com"
                                />

                            </label>
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="form-text">
                            Example: <strong>john@example.com</strong>
                        </div>
                    </div>

                    <div className="mb-3">
                       <label className="form-label"> 
                        Password
                        </label>
                        <div className="input-group">
                            
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        

                        
                    </div>
                                    
                    <div className="d-flex justify-content-between mb-3">
                        <Link to="/forgot-password" replace>
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        className="btn btn-primary w-100"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Login;