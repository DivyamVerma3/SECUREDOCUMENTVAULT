import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminReports() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        Promise.all([
            API.get("/api/admin/audit-logs"),
            API.get("/api/dashboard/admin")
        ]).then(([logsRes, statsRes]) => {
            setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
            setStats(statsRes.data || {});
        }).catch(error => console.log(error));
    }, []);

    return (
        <div className="container-fluid mt-4">
            <h2 className="fw-bold">Activity Reports</h2><p className="text-muted">Administrative activity and system summary.</p>
            <div className="row g-4 mb-4">
                {Object.entries({ Users: stats.totalUsers ?? 0, Documents: stats.totalDocuments ?? 0, "Expired Documents": stats.expiredDocuments ?? 0, "Audit Events": logs.length }).map(([label,value]) => <div className="col-md-6 col-xl-3" key={label}><div className="card shadow-sm"><div className="card-body"><h6 className="text-muted">{label}</h6><h2>{value}</h2></div></div></div>)}
            </div>
            <div className="card shadow-sm"><div className="card-header fw-bold">Recent Activity</div><div className="card-body table-responsive"><table className="table"><thead><tr><th>User</th><th>Action</th><th>Details</th><th>Date</th></tr></thead><tbody>{logs.slice(0,50).map((log,i)=><tr key={log.auditId ?? i}><td>{log.userEmail || log.email || log.username || "-"}</td><td>{log.action || "-"}</td><td>{log.details || log.description || "-"}</td><td>{log.timestamp ? new Date(log.timestamp).toLocaleString() : "-"}</td></tr>)}</tbody></table></div></div>
        </div>
    );
}
export default AdminReports;
