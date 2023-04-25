/* ----------- 
FORM TO CREATE, EDIT AND DELETE CREDIT CARD
----------- */

// Dependencies
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Row, Col, Form, Button } from "react-bootstrap";
import Inputmask from "inputmask";
import accounting from "accounting-js";
import getSymbolFromCurrency from "currency-symbol-map";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
// Styles
import "../../styles/CardForm.css";
// Other components and files
import { afrerSumbit } from "../form_support/afterSumbit";
import { formatMoneyAmount_decimal } from "../support_func/convertMoneyFunc";
import { TextAndNumberInput, SetectInput, RequiredMessage } from "../form_support/Inputs.js";
import { colorizeInputs } from "../form_support/Inputs.js";
import { showCardBackSide, hideCardBackSide, notExpiredCard } from "../form_support/card_func.js";
import { showHideCVV, maskCVV, divideByFour } from "../form_support/card_func.js";
import { pattern } from "../form_support/patterns";
import { isUnique } from "../form_support/isUnique";
import visa from "../../images/visa-icon.svg";
import mastercard from "../../images/mastercard-icon.svg";
import eyeShow from "../../images/eye-show.svg";
import eyeHide from "../../images/eye-hide.svg";
import deleteBtn from "../../images/delete-icon-white.png";
import BreadCrumb from "../nav/BreadCrumb";
import { useModal } from "../../context/ModalProvider";
import { itemCreate, itemEdit, newTouchedItem } from "../../redux/slices/ItemSlice";
import { calculateSum } from "../../redux/slices/SumSlice";

// select data
let dataForSelect = {
    paymentNetwork: ["Mastercard", "Visa"],
    cardType: ["Debit", "Credit"],
    currencies: ["UAH", "USD", "EUR"],
    months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    years: ["2023", "2024", "2025", "2026", "2027", "2028", "2029"],
};

const CardForm = ({ type, initialValues }) => {
    const dispatch = useDispatch();
    // from Redux Store: a list all cards
    const cards = useSelector((state) => state.itemsList.cards);
    // overall total amounts of money and total amount for each item separately
    const sumDetails = useSelector((state) => state.sumDetails);

    // functions to show Modal windows and pass form data to them
    const modalFunctions = useModal();
    const { handleModal, handleAlert, passToModal } = modalFunctions;

    // when a user is opening edit card form
    useEffect(() => {
        if (type === "Edit") {
            // show "closed eye" icon, because CVV number is full
            const eyeShowCVV = document.querySelector("img.show-cvv-icon");
            eyeShowCVV && eyeShowCVV.classList.toggle("visible");
            // and mask cvv-code
            const CVV = document.getElementById("CVV");
            CVV.type = "password";

            // color inputs and selects in grey as default
            colorizeInputs();
        }
        // eslint-disable-next-line
    }, []);

    // set keys for the formData object that will be created after form submission
    // if it's card creation, use defaultValues, otherwise use received initialValues
    let defaultValues = {};
    initialValues
        ? (defaultValues = initialValues)
        : (defaultValues = {
              firstName: "",
              lastName: "",
              bankName: "",
              paymentNetwork: "Visa",
              cardNumber: "",
              cardType: "Debit",
              money: "",
              currency: "UAH",
              month: "",
              year: "",
              CVV: "",
          });

    // hook useForm for React-Hook-Form creation
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setError,
        clearErrors,
        formState: { errors, isDirty },
    } = useForm({
        mode: "onChange",
        defaultValues,
    });

    // array with all Inputs' names (Object Keys) for function watch(defaultNames[i])
    const defaultNames = Object.keys(defaultValues);
    let show = {};
    defaultNames.forEach((inputName, i) => (show[inputName] = watch(defaultNames[i])));

    // callback of Submit Button
    const onSubmit = (data) => {
        const { cardNumber, money, currency } = data;
        // format card number to hide 8 center digits
        const hiddenNumber = `${cardNumber.slice(0, 4)} **** **** ${cardNumber.slice(-4)}`;
        // convert money amount to accounting format with decimal
        const formatMoney = `${formatMoneyAmount_decimal(money, currency)}`;
        let formData = {
            ...data,
            money: formatMoney,
            hiddenNumber: hiddenNumber,
        };
        if (type === "Add") {
            formData = { ...formData, id: uuidv4() };
            // add a new card to action creator -> reducer -> Redux Store
            dispatch(itemCreate({ formData, itemSingleName: "card" }));
            // pass a new item to function that calculate overall sum in Redux Store
            dispatch(calculateSum(data, sumDetails, "cards", "add"));
            // remove "eye"-icon that shows/hides cvv-code
            const cvvEye = document.querySelector(".cvv-icons img.visible");
            cvvEye && cvvEye.classList.remove("visible");
            // clean the form
            reset();
        } else if (type === "Edit") {
            // send id and form data to action creator -> reducer -> Redux Store
            dispatch(itemEdit({ formData, itemSingleName: "card" }));
            const prevMoneyValue = initialValues.money;
            // pass a new item to function that calculate overall sum in Redux Store
            dispatch(calculateSum(data, sumDetails, "cards", "edit", prevMoneyValue));
            // reset form and make new form data as defaultValues
            reset(data);
        }
        // make select inputs as default (weren't touched)
        afrerSumbit();
        // pass form data to Modal window
        passToModal({ initialValues });
        // show modal window
        handleModal(true);
    };

    // mask Card Number Input - divide by 4 letters inside the input
    const cardNumberInput = document.getElementById("Card Number");
    cardNumberInput && Inputmask({ mask: "9999 9999 9999 9999" }).mask(cardNumberInput);

    return (
        <main className="form-wrapper">
            {/* Navigation to Home Page */}
            <BreadCrumb activePage={type === "Add" ? "Add a new card" : `${type} the card`} />
            <Row className="card-form-and-view">
                <Col lg={true} className="card-create-form">
                    <h1>CARD DETAILS</h1>

                    {/* ----------- 
                    CREDIT CARD FORM
                    ----------- */}
                    <Form onSubmit={handleSubmit(onSubmit)} className="form-inputs">
                        {/* FIRST NAME */}
                        <div className="card-first-name">
                            <TextAndNumberInput
                                type="text"
                                title="First Name"
                                label="firstName"
                                register={register}
                                placeholder="Taras"
                                maxLength={13}
                                pattern={{
                                    value: pattern.latinChars,
                                    message: pattern.latinCharsError,
                                }}
                                validate={{
                                    // name should consists of at least 3 chars
                                    lessThanThreeChars: (userFirstName) =>
                                        pattern.smallFirstWord(userFirstName) ||
                                        pattern.smallNameError,
                                }}
                            />
                            <RequiredMessage errors={errors} label="firstName" />
                        </div>

                        {/* LAST NAME */}
                        <div className="card-last-name">
                            <TextAndNumberInput
                                type="text"
                                title="Last Name"
                                label="lastName"
                                register={register}
                                placeholder="Shevchenko"
                                maxLength={13}
                                pattern={{
                                    value: pattern.latinChars,
                                    message: pattern.latinCharsError,
                                }}
                                validate={{
                                    // name should consists of at least 3 chars
                                    lessThanThreeChars: (userLastName) =>
                                        pattern.smallFirstWord(userLastName) ||
                                        pattern.smallNameError,
                                }}
                            />
                            <RequiredMessage errors={errors} label="lastName" />
                        </div>

                        {/* BACK NAME */}
                        <div className="card-bank">
                            <TextAndNumberInput
                                type="text"
                                title="Bank Name"
                                label="bankName"
                                register={register}
                                placeholder="Raiffeisen Bank"
                                maxLength={26}
                                pattern={{
                                    value: pattern.latinCharsAndSpace,
                                    message: pattern.latinCharsError,
                                }}
                                validate={{
                                    // if there is a space after a word and the next word doesn't exist
                                    wordAfterSpace: (bankName) =>
                                        pattern.nextWord(bankName) || pattern.nextWordError,
                                    // if there is more than one whitespace
                                    extraSpaces: (bankName) =>
                                        pattern.extraSpaces(bankName) || pattern.extraSpacesError,
                                    // if the first character is not Latin letter
                                    nonValidStart: (bankName) =>
                                        pattern.symbolStart(bankName) || pattern.extraSpacesError,
                                    // each word should consists of at least 3 chars
                                    lessThanThreeChars: (bankName) =>
                                        pattern.smallWords(bankName) || pattern.smallWordsError,
                                }}
                            />
                            <RequiredMessage errors={errors} label="bankName" />
                        </div>

                        {/* VISA OR MASTERCARD */}
                        <div className="card-payment-network">
                            <SetectInput
                                title="Card Network"
                                label="paymentNetwork"
                                register={register}
                                errors={errors}
                                values={dataForSelect.paymentNetwork}
                                watch={watch}
                            />
                        </div>

                        {/* CARD NUMBER */}
                        <div className="card-number">
                            <TextAndNumberInput
                                type="text"
                                title="Card Number"
                                maxLength={19}
                                label="cardNumber"
                                register={register}
                                placeholder="1111 2222 3333 4444"
                                required={pattern.required}
                                pattern={{
                                    value: pattern.sixteenDigits,
                                    message: pattern.sixteenDigitsError,
                                }}
                                validate={{
                                    // check if this card number hasn't been used yet
                                    unique: (cardNumber) =>
                                        isUnique(cards, "card", type, cardNumber) ||
                                        pattern.notUniqueCard,
                                    // check if this card number matches payment system rules
                                    validNumber: (cardNumber) =>
                                        pattern.isValidNumber(cardNumber) ||
                                        pattern.isValidNumberError,
                                }}
                                // a user can't change created card number - it's like unique ID
                                disabled={type === "Edit" ? true : false}
                            />
                            <RequiredMessage errors={errors} label="cardNumber" />
                        </div>

                        {/* DEBIT OR CREDIT */}
                        <div className="card-type">
                            <SetectInput
                                title="Card Type"
                                label="cardType"
                                register={register}
                                errors={errors}
                                values={dataForSelect.cardType}
                                watch={watch}
                            />
                        </div>

                        {/* MONEY AMOUNT */}
                        <div className="card-money">
                            <TextAndNumberInput
                                type="text"
                                maxLength={12}
                                title="Amount of Money"
                                label="money"
                                register={register}
                                placeholder="Example: 5678.90"
                                required={pattern.required}
                                pattern={{
                                    value: pattern.onlyDigitsAndDot,
                                    message: pattern.onlyDigitsError,
                                }}
                                validate={{
                                    // if the first character is not a digit
                                    nonValidStart: (cardMoneyValue) =>
                                        pattern.nonFirstDigit(cardMoneyValue) ||
                                        pattern.nonFirstDigitError,
                                    // forbid any digits, if the first digit is zero
                                    nonZeroStart: (cardMoneyValue) =>
                                        cardMoneyValue[0] === "0" &&
                                        cardMoneyValue.length > 1 &&
                                        cardMoneyValue[1] !== "."
                                            ? pattern.nonZeroError
                                            : true,
                                    // reminder to add only 2 digits after the dot
                                    twoDigitsAfterDot: (cardMoneyValue) =>
                                        pattern.moneyDecimal(cardMoneyValue) ||
                                        pattern.moneyDecimalError,
                                }}
                                step="any"
                            />
                            <RequiredMessage errors={errors} label="money" />
                        </div>

                        {/* CURRENCY */}
                        <div className="card-currency">
                            <SetectInput
                                title="Currency"
                                label="currency"
                                register={register}
                                errors={errors}
                                values={dataForSelect.currencies}
                                watch={watch}
                                // a user can't change created card currency
                                disabled={type === "Edit" ? true : false}
                            />
                        </div>

                        {/* EXPIRATION MONTH */}
                        <div className="card-expiry-month">
                            <SetectInput
                                title="Expiry month"
                                label="month"
                                register={register}
                                required={pattern.required}
                                placeholder="MM"
                                errors={errors}
                                values={dataForSelect.months}
                                watch={watch}
                                validate={{
                                    // function to compare the expiration date with current date
                                    isValidDate: (expMonth) =>
                                        notExpiredCard(
                                            expMonth,
                                            show.year,
                                            clearErrors,
                                            setError
                                        ) || pattern.notExpiredCardError,
                                }}
                            />
                            <RequiredMessage errors={errors} label="month" />
                        </div>

                        {/* EXPIRATION YEAR */}
                        <div className="card-expiry-year">
                            <SetectInput
                                title="Expiry year"
                                label="year"
                                register={register}
                                required={pattern.required}
                                placeholder="YYYY"
                                errors={errors}
                                values={dataForSelect.years}
                                watch={watch}
                                validate={{
                                    // function to compare the expiration date with current date
                                    isValidDate: (expYear) =>
                                        notExpiredCard(show.month, expYear, clearErrors, setError),
                                }}
                            />
                            <RequiredMessage errors={errors} label="year" />
                        </div>

                        {/* CVV-CODE */}
                        <div
                            className="card-cvv"
                            onMouseEnter={() => showCardBackSide()}
                            onMouseLeave={(e) => hideCardBackSide(e)}>
                            <TextAndNumberInput
                                type="password"
                                maxLength={3}
                                title="CVV"
                                label="CVV"
                                register={register}
                                placeholder="123"
                                required={pattern.required}
                                pattern={{
                                    value: pattern.cvvNumber,
                                    message: pattern.cvvNumberError,
                                }}
                                onInput={() => showCardBackSide()}
                                onBlur={(e) => hideCardBackSide(e)}
                            />
                            {/* eye icon to show/hide cvv-code */}
                            <span className="cvv-icons" tabIndex={1}>
                                <img
                                    className="show-cvv-icon"
                                    src={eyeShow}
                                    alt="show eye"
                                    onClick={(e) => showHideCVV(e)}
                                />
                                <img
                                    className="hide-cvv-icon"
                                    src={eyeHide}
                                    alt="hide eye"
                                    onClick={(e) => showHideCVV(e)}
                                />
                            </span>
                            <RequiredMessage errors={errors} label="CVV" />
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="card-form-submit" id="card-form-submit">
                            <Form.Control
                                type="submit"
                                value={type === "Edit" ? "Edit" : "Submit"}
                                style={{ color: "rgba(255, 255, 255, 0.85" }}
                                // if form is changed, Edit button is disabled
                                disabled={!isDirty}
                            />
                            {type === "Edit" ? (
                                <Button
                                    className="card-form-delete"
                                    // show delete Delete Modal window
                                    onClick={() => {
                                        // change justTouchedItem in Redux Store
                                        dispatch(
                                            newTouchedItem({
                                                name: initialValues.hiddenNumber,
                                                item: "card",
                                                actionType: "delete",
                                            })
                                        );
                                        // send data to Modal window and show Delete Modal
                                        passToModal({ initialValues });
                                        handleAlert(true);
                                    }}>
                                    Delete
                                    <img src={deleteBtn} className="delete-icon" alt="delete" />
                                </Button>
                            ) : null}
                        </div>
                    </Form>
                </Col>

                {/* ----------- 
                    CREDIT CARD FRONT AND BACK SIDE (VIEWS)
                    ----------- */}
                <Col lg={true} className="card-view">
                    {/* FRONT VIEW */}
                    <div className="card-front-view visible">
                        {/* bank name */}
                        <div className="bank-view">
                            <p>{show.bankName}</p>
                            <p className={`bank-name-${show.bankName ? "above" : "full"}-view`}>
                                Bank Name
                            </p>
                        </div>
                        {/* visa or mastercard */}
                        <div className="payment-network-view">
                            <p>
                                {show.paymentNetwork === "Visa" ? (
                                    <img src={visa} alt="visa" />
                                ) : (
                                    <img src={mastercard} alt="mastercard" />
                                )}
                            </p>
                        </div>
                        {/* chip icon */}
                        <div className="chip-view"></div>
                        {/* money value */}
                        <div className="money-view">
                            <p>
                                {/* if a user didn't pass validation for money input, show 0.00 */}
                                {errors.money
                                    ? "0.00"
                                    : // otherwise, format number as a money value
                                      accounting.formatNumber(show.money)}
                                &nbsp;{getSymbolFromCurrency(show.currency)}
                            </p>
                        </div>
                        {/* debit or credit */}
                        <div className="type-view">
                            <p>{show.cardType || "DEBIT"}</p>
                        </div>
                        {/* card number */}
                        <div className="number-view">
                            <p>{divideByFour(show.cardNumber, 5)}</p>
                        </div>
                        {/* full name */}
                        <div className="holder-view">
                            <p>
                                {show.firstName} {show.lastName}
                            </p>
                            <p
                                className={`card-holder-${
                                    show.firstName || show.lastName ? "above" : "full"
                                }-view`}>
                                CARD HOLDER
                            </p>
                        </div>
                        {/* expiration date */}
                        <div className="date-view">
                            <p>
                                {show.month || "**"}&nbsp;/&nbsp;{show.year || "**"}
                            </p>
                        </div>
                    </div>

                    {/* BACK VIEW */}
                    <div className="card-back-view hidden">
                        {/* cvv-code */}
                        <span className="cvv-masked">
                            {show.CVV ? maskCVV(show.CVV, "*") : "CVV"}
                        </span>
                        <span className="cvv-visible">{show.CVV || "CVV"}</span>
                    </div>
                </Col>
            </Row>
        </main>
    );
};

export default CardForm;
