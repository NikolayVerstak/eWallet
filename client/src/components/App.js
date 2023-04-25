/* ----------- 
MAIN COMPONENT THAT ASSOCIATE ALL OTHERS
----------- */

// Dependencies
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/App.css";
// Other components and files
import NavBar from "./nav/NavBar";
import HomePage from "../pages/home/HomePage";
import CreateWallet from "../pages/create/CreateWallet";
import CreateCard from "../pages/create/CreateCard";
import CreateSaving from "../pages/create/CreateSaving";
import EditPage from "../pages/edit/EditPage";
import ListPage from "../pages/list/ListTemplate";
import SignIn from "../pages/signIn/SignIn";
import { PageNotFound } from "../pages/errors/Errors";
import Layout from "./layout/Layout";
import ModalWindow from "./form_support/Modal";
import { ModalProvider } from "../context/ModalProvider";

const App = () => {
    // if a user signed in then redirect to Home Page, otherwise, display Start (SignIn) page
    const isSignedIn = useSelector((state) => state.auth.isSignedIn);

    return (
        <BrowserRouter>
            <NavBar />
            {/* modal provider make connection between all components and modal window */}
            <ModalProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route
                            path="/"
                            element={isSignedIn ? <Navigate to="/home" replace /> : <SignIn />}
                        />
                        <>
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/cards/new" element={<CreateCard />} />
                            <Route path="/wallets/new" element={<CreateWallet />} />
                            <Route path="/savings/new" element={<CreateSaving />} />
                            <Route path="/:itemPluralName/:id/edit" element={<EditPage />} />
                            <Route path="/:itemPluralName/list" element={<ListPage />} />
                            <Route path="*" element={<PageNotFound />} />
                        </>
                    </Route>
                </Routes>
                {/* modal window */}
                <ModalWindow />
            </ModalProvider>
        </BrowserRouter>
    );
};

export default App;
