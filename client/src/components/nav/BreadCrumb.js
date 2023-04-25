/* ----------- 
SECONDARY NAVIGATION SCHEME THAT REVEALS THE USER'S LOCATION
----------- */

// Dependencies
import { useEffect } from "react";
import { Link } from "react-router-dom";
// Styles
import "../../styles/BreadCrumb.css";

function BreadCrumb({ activePage }) {
    // add background color and z-index for each Link in breadcrumb
    useEffect(() => {
        const allLi = document.querySelectorAll(".breadcrumb-nav li");
        allLi.forEach((li, index) => {
            let color = 68 + 40 * index;
            li.style.backgroundColor = `rgba(${color}, ${color}, ${color})`;
            li.style.zIndex = 4 - index;
        });
    });

    return (
        <nav className="breadcrumb-nav">
            <ul className="breadcrumb">
                {/* Home Page */}
                <li className="breadcrumb-item">
                    <Link to="/home">Home</Link>
                </li>
                {/* Current Page */}
                <li className="breadcrumb-item active">
                    <Link to="/" style={{ pointerEvents: "none" }}>
                        {activePage}
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default BreadCrumb;
