/* ----------- 
ENDPOINTS CREATE, READ, UPDATE AND DELETE USER'S ITEMS
----------- */

// dependencies
import { Router } from "express";
import { addNewItem, deleteItem, editItem, getItems } from "../controllers/items.js";

const router = new Router();

// http://localhost:3001/api/money/...

router
    .route("/:items")
    // add a new item
    .post(addNewItem)
    // fetch all items
    .get(getItems);

router
    .route("/:items/:id")
    // edit the item
    .put(editItem)
    // delete the item
    .delete(deleteItem);

export default router;
