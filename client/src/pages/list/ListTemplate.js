/* ----------- 
LIST COMPONENT TO DISPLAY THE COLLECTION OF A PARTICULAR ITEM
----------- */

// Dependencies
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import accounting from "accounting-js";
// Styles
import "../../styles/ListTemplate.css";
// Other components and files
import ItemImage from "../../components/home_support/ItemImage";
import { defaultView } from "../../components/home_support/Home_support";
import BreadCrumb from "../../components/nav/BreadCrumb";
import Loading from "../loading/Loading";
import { useModal } from "../../context/ModalProvider";
import { itemsGet } from "../../redux/slices/ItemSlice";
import { newTouchedItem } from "../../redux/slices/ItemSlice";
import addBtn from "../../images/add-icon.png";
import editBtn from "../../images/edit-icon.png";
import deleteBtn from "../../images/delete-icon-grey.png";

const ListTemplate = () => {
    const dispatch = useDispatch();
    // functions to show Modal windows and pass form data to them
    const modalFunctions = useModal();
    const { handleAlert, passToModal } = modalFunctions;
    // from Redux Store: a list of wallets, cards, savings
    const itemsList = useSelector((state) => state.itemsList);
    // data fetching status ("loading", "success", "rejected")
    const status = useSelector((state) => state.itemsList.itemsStatus);
    // user's authentication status
    const { isSignedIn } = useSelector((state) => state.auth);

    // item plural name form URL path name
    const navigate = useNavigate();
    const { itemPluralName } = useParams(); // ex. "wallets"

    const itemSingleName = itemPluralName.slice(0, -1); // ex. "wallet"
    const itemList = itemsList[itemPluralName];
    const listLength = itemsList[itemPluralName].length;

    // state to follow window width and change the NUMBERS of BLOCKS accordingly
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const detectWidth = () => setWindowWidth(window.innerWidth);
    // when the component is mounting or the width has been changed, update the numbers of the block
    useEffect(() => {
        window.addEventListener("resize", detectWidth);
        // if ListTemplate component was unmounted then remove that eventListener
        return () => {
            window.removeEventListener("resize", detectWidth);
        };
    }, [windowWidth]);
    let blockNumber = 6;
    // for the big screen the number is 6, for tablets - 4, for mobiles - 2
    windowWidth < 718
        ? (blockNumber = 2)
        : windowWidth < 1284
        ? (blockNumber = 4)
        : (blockNumber = 6);

    // load all items list from the server and calculate sums values for using when edit
    useEffect(() => {
        isSignedIn && dispatch(itemsGet());
        // eslint-disable-next-line
    }, [isSignedIn]);

    /* -----
    LOADING PAGE (if data is loading)
    ----- */
    const { showModal } = useModal();
    if (status === "loading" && !showModal) return <Loading show="show" />;

    /* -----
    ICONS to EDIT and DELETE the item
    ----- */
    const EditDeleteButtons = ({ item }) => {
        // convert money form accounting format to a number
        const formatMoney = `${Math.floor(accounting.unformat(item.money.slice(0, -2)))}`;
        // make data that will be sent to Modal window component
        const data = { initialValues: { ...item, money: formatMoney } };
        let name = "";
        itemPluralName === "cards" ? (name = item.hiddenNumber) : (name = item.name);

        return (
            <>
                {/* edit icon */}
                <img
                    src={editBtn}
                    onClick={() => navigate(`/${itemPluralName}/${item.id}/edit`)}
                    className="edit-btn"
                    alt="edit"
                />
                {/* delete icon */}
                <img
                    src={deleteBtn}
                    onClick={() => {
                        // change justTouchedItem in Redux Store
                        dispatch(
                            newTouchedItem({
                                name,
                                item: `${itemSingleName}`,
                                actionType: "delete",
                            })
                        );
                        passToModal(data); // send data to Modal windows
                        handleAlert(true); // show delete Alert
                    }}
                    className="delete-btn"
                    alt="delete"
                />
            </>
        );
    };

    /* -----
    EMPTY BLOCK to show possible placement for the item
    ----- */
    const EmptyItem = () => {
        return (
            <Col className={`${itemPluralName}-column empty`} id={`${itemPluralName}-list`}>
                <Link to={`/${itemPluralName}/new`}>
                    <img src={addBtn} className="add-btn" alt="add" />
                </Link>
                <h4>Add a new {itemSingleName}</h4>
            </Col>
        );
    };

    /* -----
    GENERAL LIST (some block are filled with added items, some are empty)
    ----- */
    return (
        <main className="list-wrapper">
            {/* Navigation to Home Page */}
            <BreadCrumb activePage={`List of all ${itemPluralName}`} />
            <Row className="list-form-and-view">
                {/* FILLED BLOCKS */}
                {itemList.map((item, i) => {
                    return (
                        <Col
                            key={i}
                            className={`${itemPluralName}-column`}
                            id={`${itemPluralName}-list`}>
                            <ItemImage
                                item={item}
                                itemSingleName={itemSingleName}
                                defaultView={defaultView[itemSingleName]}
                            />
                            <EditDeleteButtons item={item} />
                        </Col>
                    );
                })}
                {/* EMPTY BLOCKS (according to created items and window width */}
                {listLength < blockNumber ? (
                    <>
                        {/* ex. for big screen blockNumber is 6, and a user created 2 cards, 
                            so the quantity of empty blocks is 6-2 = 4 pcs. */}
                        {Array.from({ length: blockNumber - listLength }, (_, i) => {
                            return <EmptyItem key={i} />;
                        })}
                    </>
                ) : (
                    <EmptyItem />
                )}
                ;
            </Row>
        </main>
    );
};

export default ListTemplate;
