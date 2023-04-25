/* ----------- 
SING IN COMPONENT (with Google)
----------- */

// Dependencies
import React from "react";
import { Button, Dropdown } from "react-bootstrap";
import { AiOutlineGoogle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
// Styles
// Other components and files
import { signIn, signOut } from "../../redux/slices/AuthSlice";
import { initialList } from "../../redux/slices/ItemSlice";
import { initialSumAmount } from "../../redux/slices/SumSlice";
import user from "../../images/user.svg";

// Higher-Order Component for using some hooks and data from Redux Store
export function withNavigateHook(Component) {
    return function WrappedComponent(props) {
        const location = useLocation();
        const navigate = useNavigate();
        const dispatch = useDispatch();
        // from Redux Store: information about user's authentication status
        const isSignedIn = useSelector((state) => state.auth.isSignedIn);
        // and all items list
        const itemsList = useSelector((state) => state.itemsList);

        const itemPluralNames = ["wallets", "cards", "savings"];
        let itemsQty = {};
        // create the object to define items quantities: { wallets: "2 pcs", ... }
        itemPluralNames.map((name) => {
            let unit;
            itemsList[name].length === 1 ? (unit = "pc.") : (unit = "pcs.");
            return (itemsQty[name] = `${itemsList[name].length} ${unit}`);
        });

        return (
            <Component
                {...props}
                navigate={navigate}
                location={location}
                dispatch={dispatch}
                isSignedIn={isSignedIn}
                itemsQty={itemsQty}
            />
        );
    };
}

class GoogleAuth extends React.Component {
    componentDidMount() {
        // loading of internal Google Library
        window.gapi.load("client:auth2", () => {
            // and initialize that library with clientID
            window.gapi.auth2
                .init({
                    // client id from project in https://console.cloud.google.com/
                    clientId: process.env.REACT_APP_CLIENT_ID,
                    // scope shows what parts of the user account we want to get access
                    scope: "email",
                    // plugin name is just additional parametr for Google API work
                    plugin_name: "eWallet",
                })
                .then(() => {
                    // after successful initialization of the library, return GoogleAuth object
                    this.auth = window.gapi.auth2.getAuthInstance();
                    // immediately update state in Redux Store
                    this.onAuthChange(this.auth.isSignedIn.get());
                    // call lister to rerender the component every time when
                    // user's authentication status is changing
                    this.auth.isSignedIn.listen(this.onAuthChange);
                });
        });
    }

    // callback to update state object when user's authentication status is changing
    onAuthChange = (isSignedIn) => {
        if (isSignedIn) {
            // get user's email and id token from Google Auth
            const userEmail = this.auth.currentUser.get().getBasicProfile().getEmail();
            const idToken = this.auth.currentUser.get().getAuthResponse().id_token;
            // if a user signed in, pass to action creator his id from Google
            this.props.dispatch(signIn({ userEmail, idToken }));
            // and save that id token in local storage for server requests
            localStorage.setItem("idToken", idToken);
            // redirect to main user's home page
            if (this.props.location.pathname === "/") {
                this.props.navigate("/home");
            }
        } else {
            this.props.dispatch(signOut());
            // clean Redux store to initial values
            this.props.dispatch(initialList());
            this.props.dispatch(initialSumAmount());
            // redirect to start page
            this.props.navigate("/");
            // delete user's id token
            localStorage.removeItem("idToken");
        }
    };

    // method to show singIn button or user's info with signOut button
    renderAuthButton() {
        if (this.props.isSignedIn === null) {
            return null;
        } else if (this.props.isSignedIn) {
            // user's name from Google
            const userName = this.auth?.currentUser.get().getBasicProfile().getName();
            return (
                // SING OUT BLOCK
                <Dropdown className="user" style={{ animation: "none" }}>
                    {/* users icon */}
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                        <img src={user} className="user-logo" alt="user" />
                    </Dropdown.Toggle>

                    {/* dropdown to show user's information */}
                    <Dropdown.Menu>
                        <p className="user-info">{userName}</p>
                        {["WALLETs", "CARDs", "SAVINGs"].map((name, index) => {
                            return (
                                <p className="user-info" key={index}>
                                    <span>{name}</span>
                                    <span>-</span>
                                    <span>{this.props.itemsQty[name.toLocaleLowerCase()]}</span>
                                </p>
                            );
                        })}
                        {/* sign out button */}
                        <Button className="sign-out" onClick={this.onSignOutClick} variant="danger">
                            <AiOutlineGoogle />
                            <span>Sign Out</span>
                        </Button>
                    </Dropdown.Menu>
                </Dropdown>
            );
        } else {
            return (
                // SING IN BLOCK
                <Button
                    className="sign-in"
                    onClick={this.onSignInClick}
                    variant="danger"
                    style={{ animationPlayState: "running" }}>
                    <AiOutlineGoogle />
                    <span className="d-none d-md-inline tablet-laptop">Sing In with Google</span>
                    <span className="d-md-none mobile">Sing In</span>
                </Button>
            );
        }
    }

    // callbacks for singIn / signOut Buttons
    onSignInClick = () => {
        this.auth.signIn();
    };
    onSignOutClick = () => {
        this.auth.signOut();
    };

    render() {
        return <div className="google-button">{this.renderAuthButton()}</div>;
    }
}

export default withNavigateHook(GoogleAuth);
