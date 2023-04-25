/* ----------- 
ACTION CREATORS AND REDUCERS TO CALCULATE OVERALL SUM
----------- */

// Dependencies
import { createAction, createSlice } from "@reduxjs/toolkit";
// Other components
import totalAmount from "../../components/support_func/totalAmount";
import { firstTotalAmount } from "../../components/support_func/totalAmount";
import { itemsGet } from "./ItemSlice";

// define the initial values of state when the app is rendering for the first time
const INITIAL_STATE = {
    totalAmount: { UAH: 0, USD: 0, EUR: 0 }, // overall total amounts of money
    // total amount and quantity for each item separately
    amountOfItem: {
        wallets: {
            UAH: { amount: 0, qty: 0 },
            USD: { amount: 0, qty: 0 },
            EUR: { amount: 0, qty: 0 },
        },
        cards: {
            UAH: { amount: 0, qty: 0 },
            USD: { amount: 0, qty: 0 },
            EUR: { amount: 0, qty: 0 },
        },
        savings: {
            UAH: { amount: 0, qty: 0 },
            USD: { amount: 0, qty: 0 },
            EUR: { amount: 0, qty: 0 },
        },
    },
};

// action creator to calculate overall balance and sum/quantity values for each item type
export const calculateSum = createAction(
    "moneyAmount/calculateSum",
    (formData, sumDetails, itemPluralName, formType, prevMoneyValue) => {
        return {
            payload: totalAmount(formData, sumDetails, itemPluralName, formType, prevMoneyValue),
        };
    }
);

// sum calculation slice
export const SumSlice = createSlice({
    name: "moneyAmount",
    initialState: INITIAL_STATE,
    reducers: {
        // reducer to return state to initial values after a user signed out
        initialSumAmount: (state) => {
            return (state = INITIAL_STATE);
        },
        // reducer that calculates total amount of money and items quantities (after "calculateSum" action ran)
        calculateSum: (state, action) => {
            const { newAmountOfItem, newTotalAmount } = action.payload;
            state.totalAmount = newTotalAmount;
            state.amountOfItem = newAmountOfItem;
        },
    },
    extraReducers: (builder) => {
        // reducer that calculates total amount of money and items quantities
        // when the component is rendering for the first time (after "itemsGet" action ran)
        builder.addCase(itemsGet.fulfilled, (state, action) => {
            const { serverAmountOfItem, serverTotalAmount } = firstTotalAmount(action.payload);
            state.totalAmount = serverTotalAmount;
            state.amountOfItem = serverAmountOfItem;
        });
    },
});

// action creators from SumSlice
export const { initialSumAmount } = SumSlice.actions;

export default SumSlice.reducer;
