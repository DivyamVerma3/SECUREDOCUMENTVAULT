import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {

    const [profile, setProfile] = useState({});
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const loadProfile = async () => {
        try {
            const response = await API.get("/api/profile");
            setProfile(response.data);
        } catch (error) {
            alert("Failed to load profile");
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const changePassword = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword) {
            alert("Enter both passwords");
            return;
        }

        try {
            setLoading(true);

            const response = await API.put(
                "/api/profile/change-password",
                {
                    oldPassword,
                    newPassword
                }
            );

            alert(response.data);
            setOldPassword("");
            setNewPassword("");

        } catch (error) {
            alert(error.response?.data?.message || "Password Change Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mb-4">
                <h2 className="fw-bold">Employee Profile</h2>
                <p className="text-muted">
                    View your account and security details.
                </p>
            </div>

            <div className="row g-4">

                <div className="col-md-5">
                    <div className="card p-4 text-center">

                        <i className="bi bi-person-circle display-1 text-primary"></i>

                        <h4 className="fw-bold mt-3">
                            {profile.username}
                        </h4>

                        <p className="text-muted">
                            {profile.email}
                        </p>

                        <hr />

                        <div className="text-start">

                            <p>
                                <strong>Role:</strong>{" "}
                                <span className="badge bg-primary">
                                    {profile.role?.roleName || "N/A"}
                                </span>
                            </p>

                            <p>
                                <strong>Department:</strong>{" "}
                                {profile.department?.departmentName || "Not Assigned"}
                            </p>

                            <p>
                                <strong>User ID:</strong>{" "}
                                {profile.userId}
                            </p>

                        </div>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="card p-4">

                        <h5 className="fw-bold mb-3">
                            <i className="bi bi-key me-2"></i>
                            Change Password
                        </h5>

                        <form onSubmit={changePassword}>

                            <div className="mb-3">
                                <label className="form-label">
                                    Old Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    value={oldPassword}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                />
                            </div>

                            <button
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Change Password"}
                            </button>

                        </form>

                    </div>
                </div>

            </div>
        </>
    );
}

export default Profile;