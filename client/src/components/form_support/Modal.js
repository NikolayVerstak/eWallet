/* ----------- 
POP-UP COMPONENT THAT APPEARS AFTER FORM SUBMITTING
----------- */

// Dependencies
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// Styles
import "../../styles/Modal.css";
// Other components and files
import { afrerSumbit } from "../form_support/afterSumbit";
import success from "../../images/success.svg";
import attention from "../../images/attention.svg";
import { useModal } from "../../context/ModalProvider";
import { itemDelete } from "../../redux/slices/ItemSlice";
import { calculateSum } from "../../redux/slices/SumSlice";

/* ------ 
MAIN MODAL WINDOW 
------ */
const ModalWindow = () => {
    // from Redux Store: sumDetails is an overall total amounts of money;
    const sumDetails = useSelector((state) => state.sumDetails);
    // data fetching status ("loading", "success", "rejected")
    const status = useSelector((state) => state.itemsList.itemsStatus);
    // justTouchedItem is the item that we have just worked with
    // (name - for cards it's card number, type - [wallet, card, saving], action - edit or delete)
    const { name, item, actionType } = useSelector((state) => state.itemsList.justTouchedItem);

    const dispatch = useDispatch();
    // ModalContext component contains State for showing/hiding modal window
    const modalStatesAndFuncs = useModal();
    const { showModal, showAlert, handleModal, handleAlert } = modalStatesAndFuncs;
    // all formData for deleted item are passed from each component separatelly
    const { initialValues } = modalStatesAndFuncs.modalData;

    // state to handle processing modal window
    const [processing, setProcessing] = useState(false);
    // if user clicks "edit" or "delete", processing modal appears
    useEffect(() => {
        if (status === "loading") {
            setProcessing(true);
        }
        // and after data was changed and fetched from server, wait 1 second and show Main modal
        if (status === "success") {
            setTimeout(() => {
                setProcessing(false);
            }, 1000);
        }
    }, [status]);

    // redirect after an item has been deleted or if user clicks button "GO HOME"
    const location = useLocation();
    const navigate = useNavigate();
    const redirectHome = () => navigate("/home"); // to home page
    const redirectItemDeleted = () => {
        location.pathname.slice(-4) === "edit"
            ? navigate(`/${item}s/new`) // to New item page
            : navigate(`/${item}s/list`); // to List page
    };

    // function to handle deleting of the item
    const deleteItem = () => {
        // show Delete Modal window
        handleAlert(true);
        // dispatch Action Creator
        dispatch(itemDelete({ formData: initialValues, itemSingleName: item }));
        // calculate sum and item amount
        dispatch(calculateSum(initialValues, sumDetails, `${item}s`, "delete"));
        // hide cvv eye-icon, make select inputs as default (didn't touched)
        afrerSumbit();
        // redirect to the form of creation of a NewItem Page or ItemList Page
        redirectItemDeleted();
        // close Delete Modal window
        handleAlert(false);
        // show Main Modal window with message "success"
        handleModal(true);
    };

    // messages that are shown inside Modal windows
    let message = "";
    actionType === "add"
        ? (message = `has been successfully added into the ${item} collection.`)
        : actionType === "edit"
        ? (message = `has been successfully edited.`)
        : (message = `has been successfully deleted from the ${item} collection.`);

    return (
        <>
            {/* MODAL WINDOW FOR SUCCESS RESULT */}
            <Modal
                show={showModal}
                // fullscreen="sm-down"
                onHide={() => handleModal(false)}
                backdrop="static"
                keyboard={false}>
                {/* PROCESSING MODAL BEFORE DATA IS CHANGED AND FETCHED FROM SERVER  */}
                {processing ? (
                    <PreModal />
                ) : (
                    // Main Modal body with succes reult after data was changed and fetched from server
                    <>
                        <Modal.Header closeButton>
                            <img src={success} alt="tick" />
                        </Modal.Header>
                        <Modal.Body>
                            <Modal.Title>SUCCESS</Modal.Title>
                            Your {item}&nbsp;
                            <span>"{name}"</span>
                            &nbsp;{message}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => handleModal(false)}>
                                Close
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    handleModal(false);
                                    redirectHome();
                                }}>
                                Back to Home
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>

            {/* DELETE MODAL WINDOW */}
            <Modal
                show={showAlert}
                // fullscreen="sm-down"
                onHide={() => handleAlert(false)}
                backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton className="delete">
                    <img src={attention} alt="exclamation mark" />
                </Modal.Header>
                <Modal.Body>
                    <Modal.Title className="delete">ATTENTION</Modal.Title>
                    Are you sure that you want to delete the {item}&nbsp;
                    <span>"{name}"</span>?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            deleteItem();
                        }}>
                        Delete
                    </Button>
                    <Button variant="primary" onClick={() => handleAlert(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalWindow;

/* ------ 
PROCESSING WINDOW 
------ */
// if user clicks "edit" or "delete", Processing Modal appears and wait
// till data is changed and fetched from server
function PreModal() {
    return (
        <article className="processing-premodal">
            {/* processing wave */}
            <p className="processing-wave-wrapper">
                <span className="processing-wave"></span>
            </p>
            {/* text "Processing..." */}
            <p className="processing-loader">
                {["Pro", "ce", "ss", "in", "g..."].map((text, index) => {
                    // animation delay to change opacity of each part of the text
                    const delay = index * 0.2 + 0.2;
                    return (
                        <span
                            className="processing-text"
                            key={index}
                            style={{ animationDelay: `${delay}s` }}>
                            {text}
                        </span>
                    );
                })}
            </p>
        </article>
    );
}
