/* ----------- 
MIDDLEWARE TO DETERMINE USERS' ACCESS RIGHTS FOR THE NEXT ITEMS PROCESSING 
(called from enpoint http://localhost:3001/auth/me )
----------- */

// dependencies
import jwt_decode from "jwt-decode";
import User from "../models/User.js";

// middleware that gives access to user's data
export const checkAuth = async (req, res, next) => {
    // get user id from request Headers
    const userId = req.headers.authentication;
    // if user id exists in request Headers then find user's document in the database
    const user = userId && (await User.findById(userId));
    if (!user) {
        // error if user id in request Headers or user in the database doesn't exist
        return res.status(401).send({
            message: "This user doesn't exist",
        });
    }
    /* get token from request Headers
        it will have the next view "Bearer efwefsdfsf34141dsaffsa ...",
        so remove that "Bearer" and take the next string */
    const idToken = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    if (idToken) {
        try {
            // Google App's client_Id
            const CLIENT_ID = process.env.CLIENT_ID;
            // decode user's id token from request
            const decodedToken = jwt_decode(idToken);
            // check :
            // 1) Google App's client_Id equals audience in id token payload ?
            // 2) user's email in the database equals email in id token payload ?
            if (decodedToken.aud === CLIENT_ID && decodedToken.email === user.userEmail) {
                // pass user's document to the next step of processing
                req.body.user = user;
                // next() allow to move to the next middleware in router
                // for example router.post("/:items", checkAuth, addNewItem) function addNewItem
                // start working when checkAuth is successefully complited
                next();
            } else {
                // error if user id or id token is wrong
                return res.status(401).send({
                    message: "You don't have permission to access",
                });
            }
        } catch {
            // error if id token has the wrong structure
            return res.status(401).send({
                message: "Invalid id token",
            });
        }
    } else {
        // error if id token doesn't exist
        return res.status(401).send({
            message: "The id token is required",
        });
    }
};
