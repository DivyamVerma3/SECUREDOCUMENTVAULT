import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminAccess() {
    const [userAccess, setUserAccess] = useState([]);
    const [departmentAccess, setDepartmentAccess] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [u, d] = await Promise.all([
                API.get("/api/access/all"),
                API.get("/api/access/department/all")
            ]);
            setUserAccess(Array.isArray(u.data) ? u.data : []);
            setDepartmentAccess(Array.isArray(d.data) ? d.data : []);
        } catch (error) {
            console.log(error);
            alert("Unable to load access records.");
        } finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    const revokeUser = async (documentId, userId) => {
        if (!window.confirm("Revoke this user's access?")) return;
        try { await API.delete(`/api/access/revoke?documentId=${documentId}&userId=${userId}`); await loadData(); }
        catch (error) { alert(error.response?.data || "Unable to revoke access."); }
    };

    const revokeDepartment = async (documentId, departmentId) => {
        if (!window.confirm("Revoke this department's access?")) return;
        try { await API.delete(`/api/access/revoke-department?documentId=${documentId}&departmentId=${departmentId}`); await loadData(); }
        catch (error) { alert(error.response?.data || "Unable to revoke access."); }
    };

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div><h2 className="fw-bold">Sharing Permissions</h2><p className="text-muted mb-0">Review and revoke document access.</p></div>
                <button className="btn btn-outline-primary" onClick={loadData}>Refresh</button>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-header fw-bold">User Access</div>
                <div className="card-body table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light"><tr><th>ID</th><th>Document</th><th>User</th><th>Granted By</th><th>Action</th></tr></thead>
                        <tbody>
                            {loading ? <tr><td colSpan="5" className="text-center">Loading...</td></tr> :
                            userAccess.length === 0 ? <tr><td colSpan="5" className="text-center">No user access records.</td></tr> :
                            userAccess.map((item, i) => <tr key={item.accessId ?? i}>
                                <td>{item.accessId ?? "-"}</td><td>{item.document?.fileName || "-"}</td><td>{item.user?.email || item.user?.username || "-"}</td><td>{item.grantedBy?.email || "-"}</td>
                                <td><button className="btn btn-sm btn-outline-danger" disabled={!item.document?.documentId || !item.user?.userId} onClick={() => revokeUser(item.document.documentId, item.user.userId)}>Revoke</button></td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header fw-bold">Department Access</div>
                <div className="card-body table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light"><tr><th>ID</th><th>Document</th><th>Department</th><th>Granted By</th><th>Action</th></tr></thead>
                        <tbody>
                            {departmentAccess.length === 0 ? <tr><td colSpan="5" className="text-center">No department access records.</td></tr> :
                            departmentAccess.map((item, i) => <tr key={item.accessId ?? i}>
                                <td>{item.accessId ?? "-"}</td><td>{item.document?.fileName || "-"}</td><td>{item.department?.departmentName || "-"}</td><td>{item.grantedBy?.email || "-"}</td>
                                <td><button className="btn btn-sm btn-outline-danger" disabled={!item.document?.documentId || !item.department?.departmentId} onClick={() => revokeDepartment(item.document.documentId, item.department.departmentId)}>Revoke</button></td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default AdminAccess;
