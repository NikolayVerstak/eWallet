/* ----------- 
FUNCTION THAT CHECK IF THE ADDING ITEM HAS A UNIQUE NAME
----------- */

export const isUnique = (items, ItemSignleName, type, newName) => {
    // for creation of a new Item, compare that item name with all existed names for that item type
    if (type === "Add") {
        let isUnique = [];
        ItemSignleName === "card"
            ? // for credit cards compare card numbers as name
              (isUnique = items.find((item) => item.cardNumber === newName))
            : // for others compare names
              (isUnique = items.find((item) => item.name === newName));
        // if there is match, return false (name isn't unique)
        return isUnique ? false : true;
    } else {
        // for editing or deleting the Item, skip this validation rule
        return true;
    }
};
