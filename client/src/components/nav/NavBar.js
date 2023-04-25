/* ----------- 
NAVIGATION COMPONENT
----------- */

// Dependencies
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
// Styles
import "../../styles/NavBar.css";
// Other components
import GoogleAuth from "./GoogleAuth";
import { withNavigateHook } from "./GoogleAuth.js";
import ExchangeRate from "./ExchangeRate";

// reusable Links Component for navigation bar
class Links extends React.Component {
    activeClassName = "nav-link active";
    // itemsPluralNames = ["wallets", "cards", "savings"];
    itemsSingleNames = ["wallet", "card", "saving"];

    render() {
        return (
            <>
                {this.itemsSingleNames.map((name) => {
                    return (
                        <NavLink
                            // This call will be applied to a <NavLink> when the
                            // route that it links to is currently selected
                            className={({ isActive }) =>
                                isActive ? this.activeClassName : "nav-link"
                            }
                            to={`/${name}s/${this.props.url}`}
                            key={name}>
                            {this.props.url === "new" ? name : `${name}s`}
                        </NavLink>
                    );
                })}
            </>
        );
    }
}

class NavBar extends React.Component {
    constructor(props) {
        super(props);

        // function to listen for outside click
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        // add event to handle click outside of the navbar
        document.addEventListener("mousedown", this.handleClickOutside);
        // if a user didn't sign in, links in navbar and branName (as a link) are disabled
        this.unclicableLinks();
        // highlight navigation buttons ac. to URL path
        this.activeMainNavButton();
    }

    componentDidUpdate() {
        // if a user has just signed out, links in navbar and branName (as a link) are disabled
        this.unclicableLinks();
        // and are not highlighted
        this.activeMainNavButton();

        // event for mobile divices to close navbar dropdown if location pathname was changed
        const togglerButton = document.querySelector(".navbar-toggler");
        togglerButton && !togglerButton.classList.contains("collapsed") && togglerButton.click();
    }

    componentWillUnmount() {
        // remove event listener to handle click outside of the navbar
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    // functuin to close NavBar if there is click outside
    handleClickOutside(event) {
        const clickOver = event.target;
        if (this.wrapperRef.current && !this.wrapperRef.current.contains(clickOver)) {
            const navBarButton = document.querySelector("button.navbar-toggler");
            const navBarList = document.querySelector(".navbar-collapse");
            const isOpened = navBarList.classList.contains("show");
            if (isOpened === true && !clickOver.classList.contains("navbar-toggler")) {
                navBarButton.click();
            }
        }
    }

    // if a user doen't sign in, links in navbar and branName (as a link) are disabled
    unclicableLinks = () => {
        const navBarLinks = document.querySelectorAll(".navbar-nav a");
        const brandName = document.querySelector(".project-name");
        const navBarButton = document.querySelector(".navbar-toggler");
        if (!this.props.isSignedIn) {
            navBarLinks.forEach((link) => (link.style.pointerEvents = "none"));
            brandName.style.pointerEvents = "none";
            navBarButton.style.pointerEvents = "none";
        } else {
            navBarLinks.forEach((link) => (link.style.pointerEvents = "all"));
            brandName.style.pointerEvents = "all";
            navBarButton.style.pointerEvents = "all";
        }
    };

    // highlight navigation buttons ac. to URL path
    activeMainNavButton = () => {
        // find "home", "add a new", "list of all" buttons
        const mainNavButtons = document.querySelectorAll(".navbar-nav > div > .nav-link");
        // define url for dropdown buttons
        mainNavButtons[1].href = "http://localhost:3000/items/new";
        mainNavButtons[2].href = "http://localhost:3000/items/list";
        for (let i = 0; i < mainNavButtons.length - 1; i++) {
            const buttonURL = mainNavButtons[i].href;
            // take only last part of buttons' URL ("/home", "/new", "list")
            const buttonLastQueryString = buttonURL.substring(buttonURL.lastIndexOf("/"));
            const baseURL = this.props.location.pathname;
            // take last part of current URL
            const baseLastQueryString = baseURL.substring(baseURL.lastIndexOf("/"));
            // if they are equal, highlight the button
            if (baseLastQueryString === buttonLastQueryString) {
                mainNavButtons[i].style.backgroundColor = "rgba(128, 128, 128, 0.3)";
                mainNavButtons[i].style.color = "white";
            } else {
                mainNavButtons[i].style.backgroundColor = "transparent";
                mainNavButtons[i].style.color = "rgba(255, 255, 255, 0.55)";
            }
        }

        // event to close NavBar dropdowns for big screens
        document.getElementById("responsive-navbar-nav").click();
    };

    render() {
        return (
            <Navbar variant="dark" expand="md" bg="dark">
                {/* BRAND NAME BUTTON */}
                <Link className="project-name" style={{ padding: 0 }} to="/home">
                    eWallet
                </Link>

                {/* PAGE'S BUTTON */}
                <Container fluid ref={this.wrapperRef}>
                    <div
                        className="nav-links"
                        /* if a user signed in, put nav links exacty in the center of screen */
                        style={
                            this.props.isSignedIn
                                ? { marginRight: "0" }
                                : { margin: "0 165px 0 80px" }
                        }>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            {/* BRAND NAME BUTTON */}
                            <Nav fixed="top" onClick={this.activeMainNavButton}>
                                {/* home page link */}
                                <div>
                                    <Link className="nav-link home" to="/home">
                                        HOME
                                    </Link>
                                </div>

                                {/* add a new item links */}
                                <NavDropdown
                                    id="nav-dropdown-dark"
                                    className="create-new"
                                    title="add"
                                    menuVariant="dark">
                                    <Links url="new" />
                                </NavDropdown>

                                {/* show all item links */}
                                <NavDropdown
                                    id="nav-dropdown-dark"
                                    className="show-list"
                                    title="show"
                                    menuVariant="dark">
                                    <Links url="list" />
                                </NavDropdown>

                                {/* show exchange rate */}
                                <NavDropdown
                                    id="nav-dropdown-dark"
                                    title="Exchange rate"
                                    className="exchange-rate"
                                    menuVariant="dark">
                                    <ExchangeRate currency="USD" />
                                    <ExchangeRate currency="EUR" />
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Container>

                {/* Button to Sing In/Sing Out via Google */}
                <GoogleAuth />
            </Navbar>
        );
    }
}

// withNavigateHook is HOC to pass useLocation hook and Redux State (user's authentication status)
export default withNavigateHook(NavBar);
