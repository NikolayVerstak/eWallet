/* ----------- 
HOME PAGE HELPER COMPONENTS
----------- */

// Dependencies
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Carousel, Form, Dropdown, DropdownButton } from "react-bootstrap";
// Styles
import "../../styles/HomePage.css";
// Other components and files
import {
    formatMoneyAmounts_integer,
    formatMoneyAmount_integer,
} from "../support_func/convertMoneyFunc";
import ItemImage from "./ItemImage";

// default values for image filling if there are no added item
export const defaultView = {
    card: {
        bankName: "Bank Name",
        hiddenNumber: "---- ---- ---- ----",
        cardType: "Debit",
        currency: "UAH",
        firstName: "NAME",
        lastName: "SURNAME",
        money: "0.00 ₴",
        month: "MM",
        paymentNetwork: "Visa",
        year: "YYYY",
    },
    wallet: {
        name: "WALLET NAME ",
        money: "0 ₴",
    },
    saving: {
        name: "SAVING NAME ",
        money: "0 ₴",
        target: "0 ₴",
        progress: "0",
    },
};

/* ----------- 
REUSABLE IMAGE CAROUSEL SECTION
----------- */
export const ImageCarousel = ({ itemSingleName, list }) => {
    // state to control index of the active image in carousel
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    // logic to find item ID for EditButton
    let id = "";
    if (list && list.length === 1) {
        // if there is only one item in carousel, edit button has a link to that one item
        id = list[0].id;
    } else if (list && list.length > 1) {
        // if there is several items in carousel, edit button has a link to the item in a list
        // that has the same index as index of the active item in carousel
        id = list[index].id;
    }

    return (
        <>
            {/* if added at list one item exists, fill it with coming data */}
            {list && list.length > 0 ? (
                <div className={`${itemSingleName}s-carousel images`}>
                    {/* make carousel if added items qty is more that 1 */}
                    {list.length > 1 ? (
                        <Carousel fade activeIndex={index} onSelect={handleSelect}>
                            {list.map((item, i) => {
                                return (
                                    <Carousel.Item key={i}>
                                        <ItemImage
                                            key={i}
                                            itemSingleName={itemSingleName}
                                            item={item}
                                            defaultView={defaultView[itemSingleName]}
                                        />
                                    </Carousel.Item>
                                );
                            })}
                        </Carousel>
                    ) : (
                        <ItemImage
                            itemSingleName={itemSingleName}
                            defaultView={defaultView[itemSingleName]}
                            item={list[0]}
                        />
                    )}
                </div>
            ) : (
                // if there are no added item, fill image with default values
                <ItemImage itemSingleName={itemSingleName} item={defaultView[itemSingleName]} />
            )}

            {/* EDIT BUTTON that takes index (id) from carousel */}
            <RedirectButton
                index={index}
                link={id ? `/${itemSingleName}s/${id}/edit` : "/home"}
                text={`edit this ${itemSingleName}`}
                className="edit-this"
                disabled={list && list.length > 0 ? false : true}
            />
        </>
    );
};

/* ----------- 
REUSABLE REDIRECT BUTTONS  - EDIT, ADD A NEW, SHOW ALL
----------- */
export const RedirectButton = ({ link, text, className, disabled }) => {
    return (
        // if there are no added items, editButton is disabled
        <Link to={link} style={disabled ? { pointerEvents: "none" } : { pointerEvents: "all" }}>
            <button className={`${className} button`} disabled={disabled}>
                <span className="button-circle">
                    <span className="button-arrow-icon"></span>
                </span>
                <span className="button-text">{text}</span>
            </button>
        </Link>
    );
};

/* ----------- 
REUSABLE BUTTONS SECTION (Add a new Item - Show list of Items )
----------- */
export const ButtonsList = ({ itemPluralName }) => {
    // receive name to create buttons for particular item ( card, wallet, saving )
    const itemSingleName = itemPluralName.slice(0, -1);
    return (
        <div className={`${itemPluralName}-buttons buttons`}>
            {/* Add a new Item Button */}
            <RedirectButton
                link={`/${itemPluralName}/new`}
                text={`add a new ${itemSingleName}`}
                className="add-new"
            />
            {/*  Show list of Items Button */}
            <RedirectButton
                link={`/${itemPluralName}/list`}
                text={`show all ${itemPluralName}`}
                className="show-all"
            />
        </div>
    );
};

/* ----------- 
REUSABLE DETAILS TABLE SECTION
----------- */
// (for ditails of each type of Items: |description|value|)
export const DetailsTable = ({ item, itemDetails }) => {
    // receive itemDetails {{ UAH: {amount: , qty}, USD: { ... },  EUR: { ... } }
    const currencies = Object.keys(itemDetails); // [UAH, USD, EUR]

    /*---- 1st column settings (Description) ----*/
    const textClassNames = ["item-type", "qty-text", "total-text"];
    const spanText = [
        `${item} currency type`,
        `Quantity of ${item.toLowerCase()}`,
        "Total amount of money:",
    ];
    const TextSpans = () => {
        return textClassNames.map((name, index) => {
            return (
                <span key={name} className={name}>
                    {spanText[index]}
                </span>
            );
        });
    };

    /* ---- Dropdown of currencies ----*/
    const UAH = currencies[0]; // default currency
    const [currency, setCurrency] = useState(UAH); // state for switching between currencies
    // function to switch currency
    const handleSelect = (e) => {
        setCurrency(e);
    };

    const qty = itemDetails[currency].qty;
    const amount = itemDetails[currency].amount;

    /*---- 2nd column settings (Number) ----*/
    const NumberSpans = () => {
        return (
            <>
                {/* dropdown of currencies */}
                <DropdownButton
                    id="dropdown-button-dark-example2"
                    title={currency}
                    className="item-currency"
                    onSelect={handleSelect}>
                    {currencies.map((currency_i, index) => {
                        return (
                            <Dropdown.Item
                                eventKey={currency_i}
                                key={index}
                                className={currency_i === currency ? "active" : ""}>
                                {currency_i}
                            </Dropdown.Item>
                        );
                    })}
                </DropdownButton>
                {/* item qty */}
                <span className="qty-amount">
                    {qty} {qty === 1 ? "pc." : "pcs."}
                </span>
                {/* item Amount of money in selected currency */}
                <span className="total-amount">{formatMoneyAmount_integer(amount, currency)}</span>
            </>
        );
    };

    /*---- table contains two columns |Description|Number| ----*/
    return (
        <div className={`${item.slice(0, -3).toLowerCase()}s-details item-total-amount`}>
            <p className="table-title">Details</p>
            <TextSpans />
            <NumberSpans />
        </div>
    );
};

/* ----------- 
REUSABLE OVERALL BALANCE SECTION
----------- */
export const BalanceDetails = ({ balance }) => {
    const currencies = Object.keys(balance); // [UAH, USD, EUR]
    // convert numbers to accounting format
    const formatAmounts = Object.values(balance).map((value, i) =>
        formatMoneyAmounts_integer(value, i, currencies)
    );
    // dropdown of overall amount for for Mobile devices
    const firstAmount = formatAmounts[0]; // default amount - sum in UAH
    const [value, setValue] = useState(firstAmount); // state for switching between currencies
    // function to switch currency/amount
    const handleSelect = (e) => {
        setValue(e);
    };

    useEffect(() => {
        // change overall balance amount from default value to selected value
        if (formatAmounts[0] !== "0 ₴" && value === "0 ₴") {
            setValue(formatAmounts[0]);
        }
        // eslint-disable-next-line
    }, [balance]);

    return (
        <>
            <Col className="title-balance">Your overall balance</Col>
            {/* DROPDOWN BALANCE FOR MOBIE DIVICES */}
            <Col className="info-balance">
                <DropdownButton
                    id="dropdown-button-dark-example2"
                    title={value}
                    className="dropdown-balance"
                    onSelect={handleSelect}>
                    {formatAmounts.map((amount, index) => {
                        return (
                            <Dropdown.Item
                                eventKey={amount}
                                key={index}
                                style={
                                    // align 0 $, 0 $ and 0 € in one line
                                    amount.slice(0, 1) === "0"
                                        ? {
                                              paddingLeft: "calc((100% - 30px) /2)",
                                              textAlign: "left",
                                          }
                                        : { padding: "4px 16px", textAlign: "center" }
                                }>
                                {amount}
                            </Dropdown.Item>
                        );
                    })}
                </DropdownButton>

                {/* EXPANDED LIST FOR LARGER SCREENS */}
                <div className="expanded-balance">
                    {formatAmounts.map((amount, index) => {
                        return <span key={index}>{amount}</span>;
                    })}
                </div>
            </Col>
        </>
    );
};

/* ----------- 
NAVIGATION FOR MOBILE DEVICES (via clickable arrows and dots for visualisation)
----------- */
export const ItemsMobileNavigation = ({ changeItem }) => {
    return (
        <>
            <span className="arrow-previous visible" onClick={(e) => changeItem(e)}>
                Wallets
            </span>
            {/* Dots for visual navigation */}
            <span className="radios">
                <Form.Check type="radio" name="item-radio" className="wallets-radio" />
                <Form.Check type="radio" name="item-radio" className="cards-radio" defaultChecked />
                <Form.Check type="radio" name="item-radio" className="savings-radio" />
            </span>
            <span className="arrow-next visible" onClick={(e) => changeItem(e)}>
                Savings
            </span>
        </>
    );
};
