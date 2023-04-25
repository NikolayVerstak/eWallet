/* ----------- 
PAGE FOR CLIENT-SIDE AND SERVER-SIDE ERRORS
----------- */

// Dependencies
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
// Styles
import "../../styles/Errors.css";
// Other components and files
import badRequest from "../../images/error-404.png";
import serverError from "../../images/error-500.png";
import home from "../../images/home.svg";

// server-side 500 error
export function ServerError() {
    const location = useLocation();
    // Google authentication error
    const { authError } = useSelector((state) => state.auth);

    return (
        <main className="server-error">
            <section>
                <img src={serverError} className="error-img" alt="error 500" />
                <div className="error-text">
                    <p>Something went wrong at our end.</p>
                    <p>Don't worry, it’s not you - it’s us. Sorry about that.</p>
                </div>
                {/* show redirect to Home Page button only if an error appears on other pages  */}
                {location.pathname !== "/home" && !authError && (
                    <a href="/home">
                        <span>GO HOME</span>
                        <img src={home} alt="home icon" />
                    </a>
                )}
            </section>
        </main>
    );
}

// client-side 404 error
export function PageNotFound() {
    return (
        <main className="page-not-found">
            <section>
                <img className="error-img" src={badRequest} alt="error 404" />
                <div className="error-text">
                    <p>We couldn't find the page you were looking for.</p>
                    <p>Please check the URL address and try again.</p>
                </div>
                <Link to="/home">
                    <span>GO HOME</span>
                    <img src={home} alt="home icon" />
                </Link>
            </section>
        </main>
    );
}
