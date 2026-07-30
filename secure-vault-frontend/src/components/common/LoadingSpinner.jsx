function LoadingSpinner({ text = "Loading..." }) {
    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center py-5"
        >
            <div
                className="spinner-border text-primary mb-3"
                role="status"
            >
                <span className="visually-hidden">
                    Loading...
                </span>
            </div>

            <h6 className="text-muted">
                {text}
            </h6>
        </div>
    );
}

export default LoadingSpinner;