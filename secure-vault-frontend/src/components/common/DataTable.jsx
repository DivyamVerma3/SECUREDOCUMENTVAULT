import EmptyState from "./EmptyState";

function DataTable({
    columns = [],
    data = [],
    loading = false,
    emptyTitle = "No Records Found",
    emptyMessage = "There is no data available."
}) {
    if (loading) {
        return (
            <div className="text-center py-5">
                Loading...
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length}>
                                <EmptyState
                                    title={emptyTitle}
                                    message={emptyMessage}
                                />
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr key={row.id || index}>
                                {columns.map((column) => (
                                    <td key={column.key}>
                                        {column.render
                                            ? column.render(row)
                                            : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;