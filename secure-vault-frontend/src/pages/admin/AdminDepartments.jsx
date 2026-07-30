import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminDepartments() {
    const [departments, setDepartments] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);

    const loadDepartments = async () => {
        try {
            const response = await API.get("/api/departments");
            setDepartments(Array.isArray(response.data) ? response.data : []);
        } catch (error) { console.log(error); alert("Unable to load departments."); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadDepartments(); }, []);

    const createDepartment = async () => {
        if (!name.trim()) return alert("Enter department name.");
        try {
            await API.post("/api/departments", { departmentName: name.trim() });
            setName("");
            await loadDepartments();
        } catch (error) { alert(error.response?.data || "Unable to create department."); }
    };

    const editDepartment = async (dept) => {
        const newName = window.prompt("Department name:", dept.departmentName);
        if (!newName?.trim()) return;
        try {
            await API.put(`/api/departments/${dept.departmentId}`, { departmentName: newName.trim() });
            await loadDepartments();
        } catch (error) { alert(error.response?.data || "Unable to update department."); }
    };

    const deleteDepartment = async (id) => {
        if (!window.confirm("Delete this department?")) return;
        try { await API.delete(`/api/departments/${id}`); await loadDepartments(); }
        catch (error) { alert(error.response?.data || "Unable to delete department."); }
    };

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4"><div><h2 className="fw-bold">Department Management</h2><p className="text-muted mb-0">Create, edit and remove departments.</p></div><button className="btn btn-outline-primary" onClick={loadDepartments}>Refresh</button></div>
            <div className="card shadow-sm mb-4"><div className="card-body"><div className="input-group"><input className="form-control" placeholder="New department name" value={name} onChange={e => setName(e.target.value)} /><button className="btn btn-primary" onClick={createDepartment}>Create Department</button></div></div></div>
            <div className="card shadow-sm"><div className="card-body table-responsive"><table className="table table-bordered align-middle"><thead className="table-dark"><tr><th>ID</th><th>Department</th><th>Actions</th></tr></thead><tbody>
                {loading ? <tr><td colSpan="3" className="text-center">Loading...</td></tr> : departments.map(dept => <tr key={dept.departmentId}><td>{dept.departmentId}</td><td>{dept.departmentName}</td><td><button className="btn btn-sm btn-outline-primary me-2" onClick={() => editDepartment(dept)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => deleteDepartment(dept.departmentId)}>Delete</button></td></tr>)}
            </tbody></table></div></div>
        </div>
    );
}
export default AdminDepartments;
