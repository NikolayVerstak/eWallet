/* ----------- 
ACTION CREATORS AND REDUCERS TO WORK WITH AUTHENTICATION STATUS
----------- */

// Dependencies
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Other components
import { baseAxios } from "../../utils/axios";

// action creator that makes request to the server and get user's data ac. to user email and id token
export const signIn = createAsyncThunk(
    "auth/signIn",
    async ({ userEmail, idToken }, { rejectWithValue }) => {
        try {
            const response = await baseAxios.post(`/auth/signin`, { userEmail, idToken });
            // console.log(response.data);
            return response.data.user;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

// authentication slice
export const AuthSlice = createSlice({
    name: "auth",
    // define the initial values of state when the app is rendering for the first time
    initialState: {
        isSignedIn: null,
        userEmail: null,
        // user id comes from MongoDB unique document property {_id: ObjectId("6331ae8bdf73fd9a5a57488k")}
        userId: null,
        // error if Google doesn't response
        authError: null,
    },
    reducers: {
        // reducer to change authentication status after "signOut" action ran
        signOut: (state) => {
            state.isSignedIn = false;
            state.userEmail = null;
            state.userId = null;
            state.authError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // reducer for successful authentication after "signIn" action ran
            .addCase(signIn.fulfilled, (state, action) => {
                state.isSignedIn = true;
                state.userEmail = action.payload.userEmail;
                state.userId = action.payload._id;
                state.authError = null;
            })
            // reducer if authentication was rejected
            .addCase(signIn.rejected, (state, action) => {
                state.isSignedIn = null;
                state.userEmail = null;
                state.userId = null;
                state.authError = action.payload;
            });
    },
});

// action creators from AuthSlice
export const { signOut } = AuthSlice.actions;

export default AuthSlice.reducer;
