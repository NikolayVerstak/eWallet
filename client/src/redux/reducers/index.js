/* ----------- 
METHOD TO CONNECT ALL REDUCERS TO REDUX STORE
----------- */

// Dependencies
import { configureStore } from "@reduxjs/toolkit";
// Styles

// Other components and files
import AuthSlice from "../slices/AuthSlice";
import ItemSlice from "../slices/ItemSlice";
import SumSlice from "../slices/SumSlice";

export const store = configureStore({
    // connect all of reducers and give them the key Name in Redux Store
    reducer: {
        // user's data from Google
        auth: AuthSlice,
        // user's card, wallets and savings
        itemsList: ItemSlice,
        // overall sum; separate sum and quantity for each item type
        sumDetails: SumSlice,
    },
});
