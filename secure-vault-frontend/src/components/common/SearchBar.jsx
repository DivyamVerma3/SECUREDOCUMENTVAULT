function SearchBar({
    keyword,
    setKeyword,
    onSearch,
    onReset,
    placeholder = "Search..."
}) {
    return (
        <div className="d-flex gap-2 mb-3">
            <div className="input-group">
                <span className="input-group-text bg-light">
                    <i className="bi bi-search"></i>
                </span>

                <input
                    className="form-control"
                    placeholder={placeholder}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            <button
                className="btn btn-primary"
                onClick={onSearch}
            >
                Search
            </button>

            <button
                className="btn btn-outline-secondary"
                onClick={onReset}
            >
                Reset
            </button>
        </div>
    );
}

export default SearchBar;