/* ----------- 
EDIT PAGE TEMPLATE FOR WALLET, CREDIT CARD AND SAVING
----------- */

// Dependencies
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import accounting from "accounting-js";
// Other components and files
import CardForm from "../../components/forms/CardForm";
import WalletSavingForm from "../../components/forms/Wallet_SavingForm";
import Loading from "../../pages/loading/Loading";
import { PageNotFound } from "../errors/Errors";
import { useModal } from "../../context/ModalProvider";
import { itemsGet } from "../../redux/slices/ItemSlice";

const EditPageTemplate = () => {
    // get item name (wallets, cards or savings) and its id from URL
    const { itemPluralName, id } = useParams();

    // from Redux Store: a list of a particular item
    const itemList = useSelector((state) => state.itemsList[itemPluralName]);
    // status means data fetching status ("loading", "success", "rejected")
    const status = useSelector((state) => state.itemsList.itemsStatus);
    // user's authentication status
    const { isSignedIn } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

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
    ERROR PAGE (if there is no searched item in the database)
    ----- */
    if (status === "success" && !itemList.filter((item) => item.id === id)[0])
        return <PageNotFound />;

    let itemValues = {};
    // find from a list the item with the same id as from URL
    itemList.length
        ? (itemValues = itemList.filter((item) => item.id === id)[0])
        : // or if there is only one item, use it
          (itemValues = itemList);
    // fill the form with initial values from Redux Store
    let initialValues = {};
    // and convert money amount (and target amount for saving) to a pure number
    itemPluralName === "savings"
        ? (initialValues = {
              ...itemValues,
              money: `${accounting.unformat(itemValues.money)}`,
              target: `${accounting.unformat(itemValues.target)}`,
          })
        : (initialValues = { ...itemValues, money: `${accounting.unformat(itemValues.money)}` });

    return (
        <>
            {/* card form */}
            {itemPluralName === "cards" ? (
                <CardForm initialValues={initialValues} type="Edit" />
            ) : (
                // wallet/saving form
                <WalletSavingForm
                    initialValues={initialValues}
                    itemName={itemPluralName.slice(0, -1)} // "saving" or "wallet"
                    type="Edit"
                />
            )}
        </>
    );
};

export default EditPageTemplate;
