import { useEffect, useState } from "react";
import API from "../services/api";

import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import DataTable from "../components/common/DataTable";
import LoadingSpinner from "../components/common/LoadingSpinner";

function AuditLogs() {

    const [logs, setLogs] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [loading, setLoading] = useState(false);

    const loadLogs = async () => {
        try {
            setLoading(true);

            const response = await API.get("/api/audit");

            setLogs(response.data);

        } catch (error) {
            alert("Failed to load audit logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    const filteredLogs = logs
        .filter((log) =>
            log.email?.toLowerCase().includes(keyword.toLowerCase()) ||
            log.action?.toLowerCase().includes(keyword.toLowerCase()) ||
            log.documentName?.toLowerCase().includes(keyword.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.actionTime) - new Date(a.actionTime);
            }

            if (sortBy === "oldest") {
                return new Date(a.actionTime) - new Date(b.actionTime);
            }

            if (sortBy === "action") {
                return a.action.localeCompare(b.action);
            }

            return 0;
        });

    const columns = [
        {
            key: "logId",
            label: "Log ID"
        },
        {
            key: "email",
            label: "Email"
        },
        {
            key: "action",
            label: "Action",
            render: (log) => (
                <span className="badge bg-primary">
                    {log.action}
                </span>
            )
        },
        {
            key: "documentName",
            label: "Details"
        },
        {
            key: "actionTime",
            label: "Time",
            render: (log) =>
                log.actionTime
                    ? new Date(log.actionTime).toLocaleString()
                    : "-"
        }
    ];

    return (
        <>
            <PageHeader
                title="Audit Logs"
                subtitle="Monitor all user and document activities."
                icon="bi-clock-history"
            />

            <div className="card p-4">

                <div className="d-flex gap-2 mb-3">
                    <div className="flex-grow-1">
                        <SearchBar
                            keyword={keyword}
                            setKeyword={setKeyword}
                            onSearch={() => {}}
                            onReset={() => {
                                setKeyword("");
                                setSortBy("newest");
                            }}
                            placeholder="Search by email, action, document..."
                        />
                    </div>

                    <select
                        className="form-select"
                        style={{ maxWidth: "220px", height: "38px" }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="action">Sort by Action</option>
                    </select>
                </div>

                {loading ? (
                    <LoadingSpinner text="Loading audit logs..." />
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredLogs}
                        emptyTitle="No Audit Logs Found"
                        emptyMessage="No matching activity records are available."
                    />
                )}

            </div>
        </>
    );
}

export default AuditLogs;