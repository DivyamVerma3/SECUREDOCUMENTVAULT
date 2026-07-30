import { useEffect, useRef } from "react";
import { Tooltip } from "bootstrap";

function InfoTooltip({ text }) {

    const tooltipRef = useRef(null);

    useEffect(() => {

        const tooltip = new Tooltip(tooltipRef.current);

        return () => {
            tooltip.dispose();
        };

    }, []);

    return (

        <i
            ref={tooltipRef}
            className="bi bi-info-circle-fill text-primary ms-2"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title={text}
            style={{
                cursor: "pointer"
            }}
        ></i>

    );

}

export default InfoTooltip;