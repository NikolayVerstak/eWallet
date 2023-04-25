/* ----------- 
LAYOUT COMPONENT (PLACEMENT OF COMPONENT'S CONTENT AND BACKGROUND)
----------- */

// Dependencies
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
// Styles
import "../../styles/Layout.css";
// Other components
import { ServerError } from "../../pages/errors/Errors";

function Layout() {
    // Google authentication error
    const { authError } = useSelector((state) => state.auth);
    // data fetching status ("loading", "success", "rejected")
    const status = useSelector((state) => state.itemsList.itemsStatus);

    // if the user's authentication was rejected or if status of data fetching is rejected
    if (authError || status === "rejected") return <ServerError />;

    return (
        <Container fluid className="layout">
            <Outlet />
        </Container>
    );
}

export default Layout;
