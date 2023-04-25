/* ----------- 
ACTION CREATORS AND REDUCERS TO WORK WITH ITEMS (CREATE, EDIT, DELETE)
----------- */

// Dependencies
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Other components
import { baseAxios } from "../../utils/axios";

// define the initial values of state when the app is rendering for the first time
const INITIAL_STATE = {
    wallets: [], // future list of walets
    cards: [], // future list of cards
    savings: [], // future list of savings
    // object to work with just touched item and pass its data to Modal windows
    justTouchedItem: {
        name: "",
        item: "",
        actionType: "",
    },
    // status of data fetching ("loading", "success", "rejected")
    itemsStatus: "loading",
    itemsError: null,
};

// action creator that makes request to the server and creates a new item
export const itemCreate = createAsyncThunk(
    "itemsList/itemCreate",
    async ({ formData, itemSingleName }, { rejectWithValue }) => {
        try {
            const response = await baseAxios.post(`/money/${itemSingleName}s`, {
                itemSingleName,
                formData,
            });
            // console.log(response.data);
            return { formData: response.data.createdItem, itemSingleName };
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

// action creator that makes request to the server and edits the item ac. to its id
export const itemEdit = createAsyncThunk(
    "itemsList/itemEdit",
    async ({ formData, itemSingleName }, { rejectWithValue }) => {
        try {
            const response = await baseAxios.put(`/money/${itemSingleName}s/${formData.id}`, {
                formData,
                itemSingleName,
            });
            // console.log(response.data);
            return { editedItemList: response.data.editedItemList, formData, itemSingleName };
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

// action creator that makes request to the server and delete the item ac. to its id
export const itemDelete = createAsyncThunk(
    "itemsList/itemDelete",
    async ({ formData, itemSingleName }, { rejectWithValue }) => {
        try {
            const response = await baseAxios.delete(`/money/${itemSingleName}s/${formData.id}`);
            // console.log(response.data);
            return { editedItemList: response.data.editedItemList, formData, itemSingleName };
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

// action creator that gets all items from the server when the component is rendering for the first time
export const itemsGet = createAsyncThunk(
    "itemsList/itemsGet",
    async (id = null, { rejectWithValue }) => {
        try {
            const response = await baseAxios.get(`/money/allItems`);
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

// function to update itemsList after some action ran
function updateItemsList(state, actionData, updateType) {
    const { itemSingleName, formData, editedItemList } = actionData;
    const itemPluralName = `${itemSingleName}s`;
    let newName = "";
    itemSingleName === "card" ? (newName = formData.hiddenNumber) : (newName = formData.name);

    // update the data about just touched item
    state.justTouchedItem = { name: newName, item: `${itemSingleName}` };

    // change the status of data fetching
    state.itemsStatus = "success";
    state.itemsError = null;

    // update items list ac. to action type
    switch (updateType) {
        case "create": {
            // add a new item to the end of a list
            state[itemPluralName].push(formData);
            state.justTouchedItem.actionType = "add";
            break;
        }
        case "edit": {
            // find the item with particular id and modify it, other items skip
            state[itemPluralName] = editedItemList;
            state.justTouchedItem.actionType = "edit";
            break;
        }
        case "delete": {
            // remove the item from the items list and return updated list
            state[itemPluralName] = editedItemList;
            state.justTouchedItem.actionType = "delete";
            break;
        }
        default: {
            break;
        }
    }
}

// main slice to work with itemList
export const ItemSlice = createSlice({
    name: "itemsList",
    initialState: INITIAL_STATE,
    reducers: {
        // reducer to return state to initial values after a user signed out
        initialList: (state) => {
            return (state = INITIAL_STATE);
        },
        // reducer to update the item a user has just worked with (after "newTouchedItem" action ran)
        newTouchedItem: (state, action) => {
            state.justTouchedItem = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // reducers to create items after "itemCreate" action ran
            .addCase(itemCreate.pending, (state, action) => {
                return { ...state, itemsStatus: "loading", itemsError: null };
            })
            .addCase(itemCreate.fulfilled, (state, action) =>
                updateItemsList(state, action.payload, "create")
            )
            .addCase(itemCreate.rejected, (state, action) => {
                return { ...state, itemsStatus: "rejected", itemsError: action.payload };
            })

            // reducers to update items after "itemEdit" action ran
            .addCase(itemEdit.pending, (state) => {
                return { ...state, itemsStatus: "loading", itemsError: null };
            })

            .addCase(itemEdit.fulfilled, (state, action) =>
                updateItemsList(state, action.payload, "edit")
            )
            .addCase(itemEdit.rejected, (state, action) => {
                return { ...state, itemsStatus: "rejected", itemsError: action.payload };
            })

            // reducers to delete items after "itemDelete" action ran
            .addCase(itemDelete.pending, (state) => {
                return { ...state, itemsStatus: "loading", itemsError: null };
            })
            .addCase(itemDelete.fulfilled, (state, action) =>
                updateItemsList(state, action.payload, "delete")
            )
            .addCase(itemDelete.rejected, (state, action) => {
                return { ...state, itemsStatus: "rejected", itemsError: action.payload };
            })

            // reducers to get ALL items after "itemGet" action ran
            .addCase(itemsGet.pending, (state) => {
                return { ...state, itemsStatus: "loading", itemsError: null };
            })
            .addCase(itemsGet.fulfilled, (state, action) => {
                const { wallets, cards, savings } = action.payload;
                state.wallets = wallets;
                state.cards = cards;
                state.savings = savings;
                state.itemsStatus = "success";
                state.itemsError = null;
                state.justTouchedItem = { name: "", item: "", actionType: "" };
            })
            .addCase(itemsGet.rejected, (state, action) => {
                return { ...state, itemsStatus: "rejected", itemsError: action.payload };
            });
    },
});

// action creators from ItemSlice
export const { initialList, newTouchedItem } = ItemSlice.actions;

export default ItemSlice.reducer;
