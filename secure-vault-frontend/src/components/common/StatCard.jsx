function StatCard({
    title,
    value,
    icon,
    color = "primary",
    subtitle = ""
}) {

    return (

        <div className="card shadow-sm h-100 border-0">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <p className="text-muted mb-1">
                            {title}
                        </p>

                        <h2 className="fw-bold">
                            {value}
                        </h2>

                        {subtitle && (

                            <small className="text-muted">
                                {subtitle}
                            </small>

                        )}

                    </div>

                    <div
                        className={`bg-${color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center`}
                        style={{
                            width: "70px",
                            height: "70px"
                        }}
                    >

                        <i
                            className={`bi ${icon} text-${color}`}
                            style={{
                                fontSize: "2rem"
                            }}
                        ></i>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default StatCard;