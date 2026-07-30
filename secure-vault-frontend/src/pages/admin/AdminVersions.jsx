import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminVersions() {
    const [documents, setDocuments] = useState([]);
    const [versions, setVersions] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        API.get("/api/admin/documents").then(r => setDocuments(Array.isArray(r.data) ? r.data : [])).catch(console.log);
    }, []);

    const loadVersions = async doc => {
        try {
            const response = await API.get(`/api/documents/${doc.documentId}/versions`);
            setVersions(Array.isArray(response.data) ? response.data : []);
            setSelected(doc);
        } catch (error) { console.log(error); alert("Unable to load versions."); }
    };

    const download = async version => {
        const id = version.versionId ?? version.id;
        try {
            const response = await API.get(`/api/documents/download/${id}`, { responseType: "blob" });
            const url = URL.createObjectURL(response.data);
            const a = document.createElement("a"); a.href = url; a.download = version.fileName || `version-${id}`; a.click(); URL.revokeObjectURL(url);
        } catch (error) { console.log(error); alert("Version download endpoint may require the document ID."); }
    };

    return (
        <div className="container-fluid mt-4">
            <h2 className="fw-bold">Version History</h2><p className="text-muted">Select a document to view its versions.</p>
            <div className="card shadow-sm"><div className="card-body table-responsive"><table className="table table-hover"><thead className="table-dark"><tr><th>ID</th><th>Document</th><th>Owner</th><th>Action</th></tr></thead><tbody>
                {documents.map(doc => <tr key={doc.documentId}><td>{doc.documentId}</td><td>{doc.fileName}</td><td>{doc.user?.username || doc.user?.email || "-"}</td><td><button className="btn btn-sm btn-outline-primary" onClick={() => loadVersions(doc)}>View Versions</button></td></tr>)}
            </tbody></table></div></div>
            {selected && <div className="card shadow-sm mt-4"><div className="card-header fw-bold">{selected.fileName} — Versions</div><div className="card-body"><table className="table"><thead><tr><th>Version</th><th>File</th><th>Date</th><th></th></tr></thead><tbody>{versions.length ? versions.map((v,i) => <tr key={v.versionId ?? i}><td>{v.versionNumber ?? i+1}</td><td>{v.fileName || "-"}</td><td>{v.createdAt ? new Date(v.createdAt).toLocaleString() : "-"}</td><td><button className="btn btn-sm btn-outline-success" onClick={() => download(v)}>Download</button></td></tr>) : <tr><td colSpan="4" className="text-center">No versions found.</td></tr>}</tbody></table></div></div>}
        </div>
    );
}
export default AdminVersions;
