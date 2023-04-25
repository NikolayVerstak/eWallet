/* ----------- 
CLIENT PAGE COMPONENT WHERE STORES INFO ABOUT ALL CARDS, WALLETS, SAVINGS
----------- */

// Dependencies
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// Styles
import "../../styles/HomePage.css";
// Other components and files
import {
    ButtonsList,
    DetailsTable,
    ImageCarousel,
    BalanceDetails,
    ItemsMobileNavigation,
} from "../../components/home_support/Home_support";
import { itemsGet } from "../../redux/slices/ItemSlice";
import Loading from "../loading/Loading";

const HomePage = () => {
    // from Redux Store: a list of wallets, cards, savings
    const { wallets, cards, savings } = useSelector((state) => state.itemsList);
    // overall total amounts of money and total amount for each item separately
    const { amountOfItem, totalAmount } = useSelector((state) => state.sumDetails);
    // data fetching status ("loading", "success", "rejected")
    const status = useSelector((state) => state.itemsList.itemsStatus);
    // user's authentication status
    const { isSignedIn } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    // load all items list from the server and calculate sums values for using when edit
    useEffect(() => {
        isSignedIn && dispatch(itemsGet());
        // eslint-disable-next-line
    }, [isSignedIn]);

    // function for Modile Navigation
    const changeItem = (e) => {
        if (e.target.innerText) {
            const items = ["cards", "wallets", "savings"];
            const targetValue = e.target.innerText.toLowerCase();

            for (let i = 0; i < items.length; i++) {
                const displayValue = document.querySelector(`.${items[i]}-column`).classList;
                // if target.value is equal to Item's className,
                if (targetValue === items[i]) {
                    // then show that Item and highlight Navigation dot related to it
                    document.querySelector(`.${targetValue}-radio input`).checked = true;
                    !displayValue.contains("display-block") &&
                        displayValue.replace("display-none", "display-block");
                } else {
                    // otherwise, hide the Item and leave Navigation dots as default
                    document.querySelector(`.${items[i]}-radio input`).checked = false;
                    displayValue.contains("display-block") &&
                        displayValue.replace("display-block", "display-none");
                    displayValue.add("display-none");
                }
            }

            var showNextItem = document.querySelector(".arrow-next");
            var showPreviousItem = document.querySelector(".arrow-previous");
            // there is an order: Wallets - Cards - Savings
            switch (targetValue) {
                /* if a user clicked "Wallets", 
                then hide left navigation button and name right one as "Cards" */
                case "wallets":
                    showPreviousItem.classList.replace("visible", "hidden");
                    showNextItem.innerText = "CARDS";
                    break;
                /* if a user clicked "Savings", 
                then hide right navigation button and name left one as "Cards" */
                case "savings":
                    showNextItem.classList.replace("visible", "hidden");
                    showPreviousItem.innerText = "CARDS";
                    break;
                /* if a user clicked "Cards", then return both navigation buttons  */
                case "cards":
                    showPreviousItem.classList.replace("hidden", "visible");
                    showPreviousItem.innerText = "WALLETS";
                    showNextItem.classList.replace("hidden", "visible");
                    showNextItem.innerText = "Savings";
                    break;
                default:
                    return;
            }
        }
    };

    // function for Tablet Navigation
    const moveToCenter = (e) => {
        if (window.innerWidth < 1300 && window.innerWidth > 786 && e.target.classList[1]) {
            const centerItem = document.querySelector(".show-center");
            // there is the order: Wallets - Cards - Savings
            switch (e.target.classList[1]) {
                // if a user clicked left Item Card, then replace it with center one
                case "show-left":
                    e.target.classList.replace("show-left", "show-center");
                    centerItem.classList.replace("show-center", "show-left");
                    break;
                // if a user clicked right Item Card, then replace it with center one
                case "show-right":
                    e.target.classList.replace("show-right", "show-center");
                    centerItem.classList.replace("show-center", "show-right");
                    break;
                default:
                    return;
            }
        }
    };

    // if data is loading, show Loading Page
    if (status === "loading") return <Loading show="show" />;

    return (
        <div className="client-page-wrapper">
            <Container fluid className="client-page">
                {/* Overall BALANCE */}
                <Row className="client-balance">
                    <BalanceDetails balance={totalAmount} />
                </Row>
                <Row
                    className="client-page-content"
                    id="client-main-row"
                    onClick={(e) => moveToCenter(e)}>
                    {/* WALLETS SECTION */}
                    <Col lg={true} className="wallets-column show-right display-none">
                        <ImageCarousel list={wallets} itemSingleName="wallet" />
                        <ButtonsList itemPluralName="wallets" />
                        <DetailsTable item="Wallet(s)" itemDetails={amountOfItem.wallets} />
                    </Col>
                    {/* CARDS SECTION */}
                    <Col lg={true} className="cards-column show-center display-block">
                        <ImageCarousel list={cards} itemSingleName="card" />
                        <ButtonsList itemPluralName="cards" />
                        <DetailsTable item="Card(s)" itemDetails={amountOfItem.cards} />
                    </Col>
                    {/* SAVINGS SECTION */}
                    <Col lg={true} className="savings-column show-left display-none">
                        <ImageCarousel list={savings} itemSingleName="saving" />
                        <ButtonsList itemPluralName="savings" />
                        <DetailsTable item="Saving(s)" itemDetails={amountOfItem.savings} />
                    </Col>
                </Row>
                {/* NAVIGATION between items for modile devices */}
                <Row className="items-radio-buttons">
                    <ItemsMobileNavigation changeItem={changeItem} />
                </Row>
            </Container>
        </div>
    );
};

export default HomePage;
