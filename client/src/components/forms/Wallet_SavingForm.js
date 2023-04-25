/* ----------- 
FORM TO CREATE, EDIT AND DELETE WALLET or SAVING
----------- */

// Dependencies
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
// Styles
import "../../styles/Wallet_SavingForm.css";
// Other components and files
import { formatMoneyAmount_integer } from "../support_func/convertMoneyFunc";
import { TextAndNumberInput, SetectInput, RequiredMessage } from "../form_support/Inputs.js";
import { calculatePercentage, compareValues, isNumber } from "../form_support/saving_func";
import { colorizeInputs } from "../form_support/Inputs.js";
import { afrerSumbit } from "../form_support/afterSumbit";
import { pattern } from "../form_support/patterns";
import { isUnique } from "../form_support/isUnique";
import { MovingLabel, MoneyParagraphView } from "../form_support/visualization";
import { itemCreate, itemEdit, newTouchedItem } from "../../redux/slices/ItemSlice";
import { calculateSum } from "../../redux/slices/SumSlice";
import { useModal } from "../../context/ModalProvider";
import BreadCrumb from "../nav/BreadCrumb";
import deleteBtn from "../../images/delete-icon-white.png";

const WalletSavingForm = ({ type, initialValues, itemName }) => {
    const dispatch = useDispatch();
    const itemPluralName = `${itemName}s`;

    // from Redux Store: a list all items (wallets and savings)
    const itemsList = useSelector((state) => state.itemsList);
    // overall total amounts of money and total amount for each item separately
    const sumDetails = useSelector((state) => state.sumDetails);

    // functions to show Modal windows and pass form data to them
    const modalFunctions = useModal();
    const { handleModal, handleAlert, passToModal } = modalFunctions;

    // when a user edit wallet or saving, color inputs and selects in grey (as disabled)
    useEffect(() => {
        if (type === "Edit") {
            colorizeInputs();
        }
    });

    // set keys for the formData object that will be created after form submission
    // if it's item creation, use defaultValues, otherwise use received initialValues
    let defaultValues = {};
    initialValues
        ? (defaultValues = initialValues)
        : (defaultValues = {
              name: "",
              money: "",
              currency: "UAH",
              target: "",
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
        const { currency, money, target } = data;
        // convert money amounts to accounting format
        const formatMoney = formatMoneyAmount_integer(money, currency);
        let formData = {};
        // if it's a creation of a wallet, remove target key-value pair
        if (itemName === "wallet") {
            const newData = _.omit(data, "target");
            formData = {
                ...newData,
                money: formatMoney,
            };
        } else if (itemName === "saving") {
            const formatTarget = formatMoneyAmount_integer(target, currency);
            const progress = Math.floor((Number(money) / Number(target)) * 100); // calculate %
            formData = {
                ...data,
                money: formatMoney,
                target: formatTarget,
                progress,
            };
        }
        if (type === "Add") {
            formData = { ...formData, id: uuidv4() };
            // add a new item to action creator -> reducer -> Redux Store
            dispatch(itemCreate({ formData, itemSingleName: itemName }));
            // pass a new item to function that calculate overall sum in Redux Store
            dispatch(calculateSum(data, sumDetails, itemPluralName, "add"));
            // clean the form
            reset();
        } else if (type === "Edit") {
            // add a new item to action creator -> reducer -> Redux Store
            dispatch(itemEdit({ formData, itemSingleName: itemName }));
            // store money value before changes to change overall sum accordingly
            const prevMoneyValue = initialValues.money;
            // pass a new item to function that calculate overall sum in Redux Store
            dispatch(calculateSum(data, sumDetails, itemPluralName, "edit", prevMoneyValue));
            // reset form and make new form data as defaultValues
            reset(data);
        }
        // make select inputs as default (didn't touched)
        afrerSumbit();
        // pass form data to Modal window
        passToModal({ initialValues });
        // show modal window
        handleModal(true);
    };

    return (
        <main className="form-wrapper">
            {/* Navigation to Home Page */}
            <BreadCrumb
                activePage={type === "Add" ? `Add a new ${itemName}` : `${type} the ${itemName}`}
            />
            <Row className={`${itemName}-form-and-view`}>
                <Col lg={true} className={`${itemName}-create-form`}>
                    <h1>{itemName} DETAILS</h1>

                    {/* ----------- 
                    WALLET or SAVING  FORM
                    ----------- */}
                    <Form onSubmit={handleSubmit(onSubmit)} className="form-inputs">
                        {/* NAME */}
                        <div className={`${itemName}-name`}>
                            <TextAndNumberInput
                                type="text"
                                label="name"
                                title="Name"
                                register={register}
                                placeholder="Enter a name"
                                required={pattern.required}
                                maxLength={30}
                                pattern={{
                                    value: pattern.latinCharsAndSpace,
                                    message: pattern.latinCharsError,
                                }}
                                validate={{
                                    // check if a name hasn't been used yet
                                    unique: (itemName) =>
                                        isUnique(
                                            itemsList[itemPluralName],
                                            itemName,
                                            type,
                                            itemName
                                        ) || pattern.notUniqueName,
                                    // if there is a space after a word and the next word doesn't exist
                                    wordAfterSpace: (itemName) =>
                                        pattern.nextWord(itemName) || pattern.nextWordError,
                                    // if there is more than one whitespace
                                    extraSpaces: (itemName) =>
                                        pattern.extraSpaces(itemName) || pattern.extraSpacesError,
                                    // if the first character is not Latin letter
                                    nonValidStart: (itemName) =>
                                        pattern.symbolStart(itemName) || pattern.extraSpacesError,
                                    // each word should consist of at least 3 chars
                                    lessThanThreeChars: (itemName) =>
                                        pattern.smallFirstWord(itemName) ||
                                        pattern.smallFirstWordError,
                                }}
                                // a user can't change created item name - it's like unique ID
                                disabled={type === "Edit" ? true : false}
                            />
                            <RequiredMessage errors={errors} label="name" />
                        </div>

                        {/* CURRENCY */}
                        <div className={`${itemName}-currency`}>
                            <SetectInput
                                title="Currency"
                                label="currency"
                                register={register}
                                errors={errors}
                                values={["UAH", "USD", "EUR"]}
                                watch={watch}
                                // a user can't change created item currency
                                disabled={type === "Edit" ? true : false}
                            />
                        </div>

                        {/* MONEY AMOUNT */}
                        <div className={`${itemName}-money`}>
                            <TextAndNumberInput
                                type="text"
                                maxLength={9}
                                title="Current amount of Money"
                                label="money"
                                register={register}
                                placeholder="Example: 5678"
                                required={pattern.required}
                                pattern={{
                                    value: pattern.onlyDigits,
                                    message: pattern.onlyDigitsError,
                                }}
                                validate={{
                                    // forbid any digits, if the first digit is zero
                                    nonZeroStart: (itemMoneyValue) =>
                                        itemMoneyValue[0] === "0" && itemMoneyValue.length > 1
                                            ? pattern.nonZeroError
                                            : true,
                                    // current amount of money should be less that target for saving
                                    lessThanTarget: (itemMoneyValue) =>
                                        itemName === "saving"
                                            ? compareValues(
                                                  itemMoneyValue,
                                                  show.target,
                                                  setError,
                                                  clearErrors
                                              ) || pattern.overflowAmountError
                                            : true,
                                }}
                                step="any"
                            />
                            <RequiredMessage errors={errors} label="money" />
                        </div>

                        {/* SAVING TARGET AMOINT*/}
                        {itemName === "saving" ? (
                            <div className={`${itemName}-money-target`}>
                                <TextAndNumberInput
                                    type="text"
                                    maxLength={10}
                                    title="Target amount of Money"
                                    label="target"
                                    register={register}
                                    placeholder="Example: 500000"
                                    required={pattern.required}
                                    pattern={{
                                        value: pattern.onlyDigits,
                                        message: pattern.onlyDigitsError,
                                    }}
                                    validate={{
                                        // target amount can't be zero
                                        nonZeroAmount: (savingMoneyTarget) =>
                                            savingMoneyTarget !== "0" || pattern.nonZeroAmountError,
                                        // forbid any digits, if the first digit is zero
                                        nonZeroStart: (savingMoneyTarget) =>
                                            savingMoneyTarget[0] === "0" &&
                                            savingMoneyTarget.length > 1
                                                ? pattern.nonZeroError
                                                : true,
                                        // current amount of money should be less that target for saving
                                        moreThanCurrent: (savingMoneyTarget) =>
                                            compareValues(
                                                show.money,
                                                savingMoneyTarget,
                                                setError,
                                                clearErrors
                                            ),
                                    }}
                                    step="any"
                                />
                                <RequiredMessage errors={errors} label="target" />
                            </div>
                        ) : null}

                        {/* SUBMIT BUTTON */}
                        <div className={`${itemName}-form-submit`}>
                            <Form.Control
                                type="submit"
                                value={type === "Edit" ? "Edit" : "Submit"}
                                style={{ color: "rgba(255, 255, 255, 0.85" }}
                                // if form is changed, Edit button is disabled
                                disabled={!isDirty}
                            />
                            {type === "Edit" ? (
                                <Button
                                    className={`${itemName}-form-delete`}
                                    // show delete Delete Modal window
                                    onClick={() => {
                                        // change justTouchedItem in Redux Store
                                        dispatch(
                                            newTouchedItem({
                                                name: initialValues.name,
                                                item: itemName,
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
                     WALLET/SAVING FRONT VIEW
                    ----------- */}
                <Col lg={true} className={`${itemName}-view`}>
                    <div className={`${itemName}-front-view`}>
                        {/* item name */}
                        <div className="name-view">
                            <p id="name-view">{show.name}</p>
                            {/* full-size label before typing and small(above input) label afrer */}
                            <MovingLabel
                                inputName="name"
                                watch={show.name}
                                text={`${itemName} Name`}
                            />
                        </div>
                        {/* wallet money */}
                        {itemName === "wallet" ? (
                            <div className="money-view">
                                {show.money ? (
                                    <MoneyParagraphView
                                        watchValue={show.money}
                                        watchSymbol={show.currency}
                                        id="money-view"
                                    />
                                ) : null}
                                <MovingLabel
                                    inputName="money"
                                    watch={show.money}
                                    text="Amount of money"
                                />
                            </div>
                        ) : (
                            <>
                                {/* saving current / target amounts */}
                                <div className="money-target-view">
                                    {show.money || show.target ? (
                                        <>
                                            <MoneyParagraphView
                                                watchValue={show.money}
                                                watchSymbol={show.currency}
                                                id="money-view"
                                            />
                                            <span id="from">from</span>
                                            <MoneyParagraphView
                                                watchValue={show.target}
                                                watchSymbol={show.currency}
                                                id="money-target-view"
                                            />
                                        </>
                                    ) : null}
                                    <MovingLabel
                                        inputName="money-target"
                                        watch={show.money || show.target}
                                        text="Current Amount / Target"
                                    />
                                </div>

                                {/* saving % */}
                                <div className="progress-view">
                                    {isNumber(show.money, show.target) ? (
                                        <p id="progress">
                                            {calculatePercentage(show.money, show.target)}% done
                                        </p>
                                    ) : null}
                                    <MovingLabel
                                        inputName="progress"
                                        watch={isNumber(show.money, show.target)}
                                        text="Money accumulation"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </Col>
            </Row>
        </main>
    );
};

export default WalletSavingForm;
