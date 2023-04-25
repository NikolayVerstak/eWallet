// Dependencies
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/reducers";

// Other components and files
import App from "./components/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // passing Redux Store as a prop at the top of app hierarchy
    <Provider store={store}>
        <App />
    </Provider>
);
