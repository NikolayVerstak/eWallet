// dependencies
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
// other files
import authRoute from "./routes/auth.js";
import itemsRoute from "./routes/items.js";
import { checkAuth } from "./utils/checkAuth.js";

// create an application in Express framework
const app = express();
// allow to use environment variables from .env-file
dotenv.config();
const PORT = process.env.PORT || 3001;
const DB_STRING = process.env.DB_STRING;

mongoose.set("strictQuery", true);

// middleware to be able to make requests from different APIs to this Express server
app.use(cors());
// middleware to explain Express that it will get JSON-data from client-side
app.use(express.json());
// middleware to handle requests routes
app.use("/api/auth", authRoute); // to allow a user to sign in
// checkAuth middleware define user's permissions
app.use("/api/money", checkAuth, itemsRoute); // to allow a user works with his data

// test route
// app.get("/", (req, res) => {
//     res.json({ message: "Welcome to the eWallet app..." });
// });

// connect to MongoDB
async function start() {
    try {
        // define string of MongoDB
        await mongoose.connect(`${DB_STRING}`);
        // running the app
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
}
start();
