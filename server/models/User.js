/* ----------- 
USER'S DOCUMENT STRUCTURE IN MONDO DATABASE
----------- */

// dependencies
import mongoose from "mongoose";

// user's model schema
const UserSchema = new mongoose.Schema(
    {
        // email comes from Google Auth2.0
        userEmail: {
            type: String,
            required: true,
            unique: true,
        },
        wallets: [],
        cards: [],
        savings: [],
    },
    // timestamps to understand the user creation data
    { timestamps: true }
);

// export of User model that is based on UserSchema
export default mongoose.model("User", UserSchema);
