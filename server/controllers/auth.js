/* ----------- 
MIDDLEWARE FOR AUTHENTICATION AND AUTHORIZATION
----------- */

// dependencies
import User from "../models/User.js";
import jwt_decode from "jwt-decode";

// authentication and authorization of a user
export const signIn = async (req, res) => {
    try {
        // get client email and id token from the request
        const { userEmail, idToken } = req.body;

        if (!idToken || Boolean(jwt_decode(idToken)) == false) {
            // error if id token has the wrong structure
            return res.status(401).send({
                message: "Invalid id token",
            });
        }

        // check if this user email exists in the database
        let user = await User.findOne({ userEmail });
        // if that email doesn't exist, create a new user in the database and send a response
        if (!user) {
            const newUser = new User({
                userEmail,
            });
            user = newUser;
            await user.save();
            return res.json({
                user,
                message: "You are singed up successfully",
            });
        }

        // if the user exists, then decrypt id token from request and make auth check
        const decodedToken = jwt_decode(idToken);
        // if:
        // 1) Google App's client_Id equals audience in id token payload ?
        // 2) user's email in the database equals email in id token payload ?
        if (decodedToken.aud === process.env.CLIENT_ID && decodedToken.email === user.userEmail) {
            // return user's document
            return res.json({
                user,
                message: "Welcome back",
            });
        } else {
            // if email or id token are wrong, then return the error message
            return res.status(401).send({
                message: "You don't have permission to access",
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: "An Error occurred during authorization, please try again.",
        });
    }
};
