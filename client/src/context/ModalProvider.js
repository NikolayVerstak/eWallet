/* ----------- 
CONTEXT PROVIDER TO CONNECT COMPONENTS WITH MODAL WINDOWS
----------- */

// Dependencies
import { useContext, useState } from "react";
// Other components and files
import { ModalContext } from "./index.js";

export const ModalProvider = ({ children }) => {
    // context that allows calling Modal from all other components
    // state for Modal and delete alert
    const [showModal, setShowModal] = useState(false);
    // delete modal window
    const [showAlert, setShowAlert] = useState(false);
    const [modalData, setModalData] = useState({});
    // functions for Modal and Alert to show/hide them
    const handleModal = (boolean) => setShowModal(boolean);
    const handleAlert = (boolean) => setShowAlert(boolean);
    const passToModal = (data) => setModalData(data);
    // data that is passed as Context value to other components
    const value = { showModal, showAlert, modalData, passToModal, handleModal, handleAlert };

    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

// create a custom hook
export const useModal = () => {
    return useContext(ModalContext);
};
