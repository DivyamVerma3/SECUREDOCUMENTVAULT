import { useEffect, useState } from "react";

function AdminSettings() {
    const [settings, setSettings] = useState(() => {
        try { return JSON.parse(localStorage.getItem("adminSettings")) || { notifications: true, compactTables: false }; }
        catch { return { notifications: true, compactTables: false }; }
    });

    const save = next => {
        setSettings(next);
        localStorage.setItem("adminSettings", JSON.stringify(next));
    };

    return (
        <div className="container-fluid mt-4">
            <h2 className="fw-bold">System Settings</h2><p className="text-muted">Frontend preferences for the administrator account.</p>
            <div className="card shadow-sm"><div className="card-body">
                <div className="form-check form-switch mb-4"><input className="form-check-input" type="checkbox" checked={settings.notifications} onChange={e => save({...settings, notifications:e.target.checked})} id="notifications"/><label className="form-check-label" htmlFor="notifications">Enable notifications</label></div>
                <div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={settings.compactTables} onChange={e => save({...settings, compactTables:e.target.checked})} id="compact"/><label className="form-check-label" htmlFor="compact">Compact tables</label></div>
                <div className="alert alert-info mt-4 mb-0">These settings are stored in this browser. Backend system settings are not exposed by the current API.</div>
            </div></div>
        </div>
    );
}
export default AdminSettings;
