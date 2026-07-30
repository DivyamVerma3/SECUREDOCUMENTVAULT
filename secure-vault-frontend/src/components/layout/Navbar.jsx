import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Navbar() {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const [profile, setProfile] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await API.get("/api/profile");
            setProfile(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = async () => {

        try {

            await API.post("/api/auth/logout");

        } catch (error) {

            console.log(error);

        } finally {

            logout();

            localStorage.removeItem("token");
            sessionStorage.clear();

            navigate("/login", {
                replace: true
            });

        }

    };

    return (
        <nav
            className="navbar bg-white shadow-sm px-4"
            style={{ height: "70px" }}
        >
            <div className="container-fluid">

                <Link
                    className="navbar-brand fw-bold text-primary"
                    to="/dashboard"
                >
                    <i className="bi bi-shield-lock-fill me-2"></i>
                    Secure Vault
                </Link>

                <div className="d-flex align-items-center ms-auto position-relative">

                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setOpen(!open)}
                    >
                        <i className="bi bi-person-circle me-2"></i>
                        {profile?.username || profile?.email || "User"}
                        <i className="bi bi-caret-down-fill ms-2"></i>
                    </button>

                    {open && (
                        <div
                            className="card shadow position-absolute"
                            style={{
                                top: "45px",
                                right: "0",
                                width: "220px",
                                zIndex: 9999
                            }}
                        >
                            <div className="p-3 border-bottom">
                                <strong>
                                    {profile?.username || "User"}
                                </strong>
                                <br />
                                <small className="text-muted">
                                    {profile?.role?.roleName || "USER"}
                                </small>
                            </div>

                            <Link
                                className="dropdown-item p-3"
                                to="/profile"
                                onClick={() => setOpen(false)}
                            >
                                <i className="bi bi-person me-2"></i>
                                Profile
                            </Link>

                            <button
                                type="button"
                                className="dropdown-item p-3 text-danger"
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>
                                Logout
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;