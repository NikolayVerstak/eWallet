/* ----------- 
MIDDLEWARES FOR CREATE, READ, UPDATE AND DELETE USER'S ITEMS
----------- */

// dependencies
import User from "../models/User.js";

// add a new item
export const addNewItem = async (req, res) => {
    try {
        // get data that were sent with the request and get user's document from checkAuth middleware
        const { itemSingleName, formData, user } = req.body;
        // get item name from path name
        const itemPluralName = `${req.params.items}`;
        // add a new item with data from req.body to a particular list
        user[itemPluralName].push(formData);
        // save changes
        await user.save();
        res.json({
            createdItem: formData,
            message: `Your ${itemSingleName} ${formData.id} has been successfully added to the database`,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error: " + error.message);
    }
};

// edit the item
export const editItem = async (req, res) => {
    try {
        // get item name and item id from path name
        const { items, id } = req.params;
        const itemPluralName = `${items}`;
        // get data that were sent with the request and get user's document from checkAuth middleware
        const { formData, user } = req.body;

        // create a new list where change the item with id from the request and leave all other items unchanged
        const newItemList = user[itemPluralName].map((item) => {
            return item.id === id ? (item = formData) : item;
        });

        // settings to update the particular item type
        const query = user._id;
        const updates = { [itemPluralName]: newItemList };
        const options = { new: true };
        // save changes in the database
        User.findOneAndUpdate(query, { $set: updates }, options, (err, updatedUser) => {
            if (err) return console.log(err);
            res.json({
                editedItemList: updatedUser[itemPluralName],
                message: `Your ${itemPluralName.slice(0, -1)} ${id} has been successfully edited`,
            });
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error: " + error.message);
    }
};

// delete the item
export const deleteItem = async (req, res) => {
    try {
        // get item name and item id from path name
        const { items, id } = req.params;
        const itemPluralName = `${items}`;
        // get user's document from checkAuth middleware
        const { user } = req.body;

        // create a new list where delete the item with id from the request and leave all other items unchanged
        const newItemList = user[itemPluralName].filter((item) => item.id !== id);

        // settings to update the particular item type
        const query = user._id;
        const updates = { [itemPluralName]: newItemList };
        const options = { new: true };
        // save changes in the database
        User.findOneAndUpdate(query, { $set: updates }, options, (err, updatedUser) => {
            if (err) return console.log(err);
            res.json({
                editedItemList: updatedUser[itemPluralName],
                message: `Your ${itemPluralName.slice(0, -1)} ${id} has been successfully deleted`,
            });
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error: " + error.message);
    }
};

// get all items
export const getItems = async (req, res) => {
    try {
        // get user's document from checkAuth middleware
        const { user } = req.body;

        res.json({
            wallets: user.wallets,
            savings: user.savings,
            cards: user.cards,
            message: `All your money holders has been successfully fetched`,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error: " + error.message);
    }
};
