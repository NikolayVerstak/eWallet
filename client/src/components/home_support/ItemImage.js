/* ----------- 
HOME PAGE HELPER COMPONENTS (carousel image filling)
----------- */

// Dependencies
import React, { useContext, useState } from "react";
import { ItemDataContext } from "../../context";
import { ProgressBar } from "react-bootstrap";
// Styles
// Other components and files
import visa from "../../images/visa-icon.svg";
import mastercard from "../../images/mastercard-icon.svg";

/* ----------- 
CREDIT CARD IMAGE FILLING TEMPLATE
----------- */
const CardsViewTemplate = () => {
    const value = useContext(ItemDataContext); // data for filling comes from ItemImage component
    const { className, defaultView } = value;
    const {
        bankName,
        paymentNetwork,
        money,
        cardType,
        cardNumber,
        hiddenNumber,
        firstName,
        lastName,
        month,
        year,
    } = value.item;

    // show/hides card number
    const [showNumber, setShowNumber] = useState(false);
    const showFullNumber = (e) => {
        // only if user clicks on middle 8 digits
        if (e.target.id === "1" || e.target.id === "2") {
            setShowNumber(!showNumber);
        }
    };
    let number = "";
    showNumber ? (number = cardNumber) : (number = hiddenNumber);

    return (
        // structure to show card data over the image
        <section className={className}>
            {/* bank name */}
            <div className="bank-view">
                <p className="bank-name">{bankName ? bankName : defaultView.bankName}</p>
            </div>
            {/* visa or mastercard */}
            <div className="payment-network-view">
                <p>
                    {paymentNetwork === "Visa" ? (
                        <img src={visa} alt="visa" />
                    ) : (
                        <img src={mastercard} alt="mastercard" />
                    )}
                </p>
            </div>
            {/* chip */}
            <div className="chip-view"></div>
            {/* money value */}
            <div className="money-view">
                <p>{money}</p>
            </div>
            {/* debit or credit */}
            <div className="type-view">
                <p>{cardType}</p>
            </div>
            {/* card number */}
            <div className="number-view">
                <p>
                    {/* split card number by 4 */}
                    {number.split(" ").map((fourDigits, index) => {
                        return (
                            <span
                                onClick={cardNumber && ((e) => showFullNumber(e))}
                                id={index}
                                key={index}
                                style={cardNumber ? { cursor: "pointer" } : { cursor: "default" }}>
                                {fourDigits}
                            </span>
                        );
                    })}
                </p>
            </div>
            {/* full name */}
            <div className="holder-view">
                <p className="card-holder">
                    {/* if first and last names don't exist, show defualt "NAME SURNAME" */}
                    {firstName || lastName
                        ? `${firstName} ${lastName}`
                        : `${defaultView.firstName} ${defaultView.lastName}`}
                </p>
            </div>
            {/* expiration date */}
            <div className="date-view">
                <p>
                    {month}&nbsp;/&nbsp;
                    {year}
                </p>
            </div>
        </section>
    );
};

/* ----------- 
WALLET IMAGE FILLING TEMPLATE
----------- */
const WalletsViewTemplate = () => {
    const value = useContext(ItemDataContext); // data for filling comes from ItemImage component
    const { className } = value;
    const { name, money } = value.item;

    return (
        <section className={className}>
            {/* wallet name */}
            <div className="name-view">
                {name === "WALLET NAME " ? (
                    <p className={`name-full-view`}>{name}</p>
                ) : (
                    <>
                        <p className={`name-above-view`}>Wallet Name</p>
                        <p id="name-view">{name}</p>
                    </>
                )}
            </div>
            {/* money value */}
            <div className="money-view">
                <p className={`money-above-view`}>Amount of Money</p>
                <p id="money-view">{money}</p>
            </div>
        </section>
    );
};

/* ----------- 
SAVING IMAGE FILLING TEMPLATE
----------- */
const SavingsViewTemplate = () => {
    const value = useContext(ItemDataContext); // data for filling comes from ItemImage component
    const { className } = value;
    const { name, money, progress } = value.item;
    // if progress < 20% that move label to the right side in progress bar on some
    const leftPosition = progress < 5 ? 10 : progress < 10 ? 15 : Number(progress) * 1.8;
    return (
        <section className={className}>
            {/* saving name */}
            <div className="name-view">
                {name === "SAVING NAME " ? (
                    <p className={`name-full-view`}>{name}</p>
                ) : (
                    <>
                        <p className={`name-above-view`}>Saving Name</p>
                        <p id="name-view">{name}</p>
                    </>
                )}
            </div>
            {/* money value */}
            <div className="money-target-view">
                <p className="money-target-above-view">Current Amount</p>
                <p id="money-view">{money}</p>
            </div>

            {/* progressv bar */}
            <div className="progress-view">
                {/* if progress less than 20%, label appears on the right side, 
                    if more, than in the center of progress bar*/}
                {progress < 20 ? (
                    <>
                        <ProgressBar now={progress} animated />
                        <span
                            className="progress-label"
                            style={
                                progress !== "0"
                                    ? {
                                          left: `${leftPosition}px`,
                                      }
                                    : { left: "33%" }
                            }>
                            {progress}%
                        </span>
                    </>
                ) : (
                    <ProgressBar now={progress} animated label={`${progress}%`} />
                )}
            </div>
        </section>
    );
};

/* ----------- 
IMAGE COMPONENT (with item form data over image) for carousel
----------- */
const ItemImage = ({ itemSingleName, item, defaultView }) => {
    /*  receive itemSingleName is [card, wallet or savings]; 
        item is form data that will be used for filling in each Image Template 
        and default data values if there no created items */
    const className = `${itemSingleName}s ewallet-img`;
    // those received data are passed as Context to all Image Templates
    const value = { className, item, defaultView };
    return (
        <ItemDataContext.Provider value={value}>
            {itemSingleName === "card" ? (
                <CardsViewTemplate />
            ) : itemSingleName === "wallet" ? (
                <WalletsViewTemplate />
            ) : (
                <SavingsViewTemplate />
            )}
        </ItemDataContext.Provider>
    );
};

export default ItemImage;
