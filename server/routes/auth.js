/* ----------- 
ENDPOINT FOR AUTHENTICATION AND AUTHORIZATION
----------- */

// dependencies
import { Router } from "express";
import { signIn } from "../controllers/auth.js";

const router = new Router();

// http://localhost:3001/api/auth/signin

// sign in the App via Google Auth2.0
router.post("/signin", signIn);

export default router;
