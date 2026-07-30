function PageHeader({ title, subtitle, icon }) {
    return (
        <div className="mb-4">
            <h2 className="fw-bold mb-1">
                {icon && <i className={`bi ${icon} me-2 text-primary`}></i>}
                {title}
            </h2>

            {subtitle && (
                <p className="text-muted mb-0">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

export default PageHeader;