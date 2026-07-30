import { Link } from "react-router-dom";

function EmptyState({
    icon = "bi-folder-x",
    title = "No Data Found",
    message = "There is nothing to show right now.",
    buttonText,
    buttonLink
}) {
    return (
        <div className="text-center py-5">
            <i
                className={`bi ${icon} text-secondary`}
                style={{ fontSize: "4rem" }}
            ></i>

            <h5 className="fw-bold mt-3">
                {title}
            </h5>

            <p className="text-muted">
                {message}
            </p>

            {buttonText && buttonLink && (
                <Link
                    to={buttonLink}
                    className="btn btn-primary mt-2"
                >
                    {buttonText}
                </Link>
            )}
        </div>
    );
}

export default EmptyState;