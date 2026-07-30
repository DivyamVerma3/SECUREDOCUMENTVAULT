import { useState } from "react";
import API from "../../services/api";

function AdminBackup() {
    const [loading, setLoading] = useState(false);

    const createBackup = async () => {
        setLoading(true);
        try {
            const [users, departments, documents, userAccess, departmentAccess] = await Promise.all([
                API.get("/api/admin/users"),
                API.get("/api/departments"),
                API.get("/api/admin/documents"),
                API.get("/api/access/all"),
                API.get("/api/access/department/all")
            ]);
            const backup = {
                createdAt: new Date().toISOString(),
                users: users.data,
                departments: departments.data,
                documents: documents.data,
                userAccess: userAccess.data,
                departmentAccess: departmentAccess.data
            };
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `secure-document-vault-backup-${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
            alert("Unable to create backup.");
        } finally { setLoading(false); }
    };

    return (
        <div className="container-fluid mt-4">
            <h2 className="fw-bold">Backup & Restore</h2><p className="text-muted">Export current application data for administrative backup.</p>
            <div className="card shadow-sm"><div className="card-body">
                <h5>Database Data Export</h5><p>This creates a JSON export of users, departments, documents and access records available through the current API.</p>
                <button className="btn btn-primary" disabled={loading} onClick={createBackup}>{loading ? "Creating Backup..." : "Create Backup"}</button>
                <div className="alert alert-warning mt-4 mb-0">Automatic database restore is not implemented because the current backend API does not expose a restore endpoint. Do not treat this JSON export as a replacement for a database backup.</div>
            </div></div>
        </div>
    );
}
export default AdminBackup;
