import axios from "axios";
import { store } from "../redux/reducers";

// define API where a user will make a request to get his data
export const baseAxios = axios.create({
    // local link
    baseURL: "http://localhost:3001/api",
    // deployed link
    // baseURL: "https://your-e-wallet-api.onrender.com/api",
});

// every request will be checked for existing of token
baseAxios.interceptors.request.use(
    (config) => {
        // user's id is the same as MongoD document property {_id: ObjectId("6331ae8bdf73fd9a5a57488k")}
        const { userId } = store.getState().auth;
        // user's id token comes from Google Auth2.0
        const idToken = localStorage.getItem("idToken");
        // those user's id and token will be stored inside header after user's authentication
        if (idToken) config.headers.Authorization = `Bearer ${idToken}`;
        if (userId) config.headers.Authentication = `${userId}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
