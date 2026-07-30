import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminAnalytics() {
    const [stats, setStats] = useState({});
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        Promise.all([API.get("/api/dashboard/admin"), API.get("/api/departments")])
            .then(([s,d]) => { setStats(s.data || {}); setDepartments(Array.isArray(d.data) ? d.data : []); })
            .catch(console.log);
    }, []);

    const totalUsers = Number(stats.totalUsers || 0);
    const totalDocs = Number(stats.totalDocuments || 0);
    const expired = Number(stats.expiredDocuments || 0);
    const active = Math.max(totalDocs - expired, 0);

    return (
        <div className="container-fluid mt-4">
            <h2 className="fw-bold">Document Analytics</h2><p className="text-muted">Current system-level document and user metrics.</p>
            <div className="row g-4">
                <div className="col-md-3"><div className="card shadow-sm p-3"><h6 className="text-muted">Users</h6><h2>{totalUsers}</h2></div></div>
                <div className="col-md-3"><div className="card shadow-sm p-3"><h6 className="text-muted">Documents</h6><h2>{totalDocs}</h2></div></div>
                <div className="col-md-3"><div className="card shadow-sm p-3"><h6 className="text-muted">Active Documents</h6><h2>{active}</h2></div></div>
                <div className="col-md-3"><div className="card shadow-sm p-3"><h6 className="text-muted">Expired</h6><h2>{expired}</h2></div></div>
            </div>
            <div className="card shadow-sm mt-4"><div className="card-header fw-bold">Departments</div><div className="card-body"><div className="row g-3">{departments.map(d => <div className="col-md-4 col-xl-3" key={d.departmentId}><div className="border rounded p-3"><i className="bi bi-building text-primary me-2"></i>{d.departmentName}</div></div>)}</div></div></div>
        </div>
    );
}
export default AdminAnalytics;
