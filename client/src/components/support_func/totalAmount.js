/* ----------- 
FUNCTION TO CALCULATE OVERALL SUM, SUM AND QUANTITY FOR EACH ITEM
----------- */

// Dependencies
import accounting from "accounting-js";

/* -----
function to calculate the sum when a user submits the form or deletes some item
(it gets info about a particular item and the previous overall sum)
----- */
const totalAmount = function (formData, moneySum, itemPluralName, action, prevMoneyValue) {
    // totalAmount is overall sum, totalAmount is sum for each item from Redux Store
    const { amountOfItem, totalAmount } = moneySum;
    // destructure formData
    const { money, currency } = formData;
    // convert amount of money to integer
    const moneyValue = Math.floor(Number(money));

    // previous values of TOTAL AMOUNT and QTY for a particular item type
    let prevItemAmount = amountOfItem[itemPluralName][currency].amount;
    let prevItemQty = amountOfItem[itemPluralName][currency].qty;
    let newAmountOfItem = 0;

    if (action === "add") {
        // if the item has been added
        // add amount of money and quantity to previous state values
        newAmountOfItem = {
            ...amountOfItem,
            [itemPluralName]: {
                ...amountOfItem[itemPluralName],
                [currency]: {
                    amount: prevItemAmount + moneyValue,
                    qty: ++prevItemQty,
                },
            },
        };
    } else if (action === "edit") {
        // if the item has been edited
        // compare amount of money with the previous amount of that item, leave quantity the same
        newAmountOfItem = {
            ...amountOfItem,
            [itemPluralName]: {
                ...amountOfItem[itemPluralName],
                [currency]: {
                    amount: prevItemAmount + moneyValue - prevMoneyValue,
                    qty: prevItemQty,
                },
            },
        };
    } else if (action === "delete") {
        // if the item has been deleted
        // minus amount of money for the item and (quantity value - 1)
        newAmountOfItem = {
            ...amountOfItem,
            [itemPluralName]: {
                ...amountOfItem[itemPluralName],
                [currency]: {
                    amount: prevItemAmount - moneyValue,
                    qty: --prevItemQty,
                },
            },
        };
    }

    // update object for OVERALL SUM by adding money amount to a particular currency
    let newTotalAmount = 0;
    let prevTotalAmount = totalAmount[currency];
    if (action === "add") {
        newTotalAmount = { ...totalAmount, [currency]: prevTotalAmount + moneyValue };
    } else if (action === "edit") {
        newTotalAmount = {
            ...totalAmount,
            [currency]: prevTotalAmount + moneyValue - prevMoneyValue,
        };
    } else if (action === "delete") {
        newTotalAmount = { ...totalAmount, [currency]: prevTotalAmount - moneyValue };
    }

    return { newAmountOfItem, newTotalAmount };
};
export default totalAmount;

/* -----
function to calculate the sum 
when a user has just got data from the server (functions gets all items list)
----- */
export const firstTotalAmount = function (itemsList) {
    // iterate through a particular item and get all money values (ex. ['300 $', '2,000 €', ...])
    function getMoneyArray(itemPluralName) {
        return itemsList[itemPluralName].map((item) => item.money);
    }
    const walletsAmountArray = getMoneyArray("wallets");
    const cardsAmountArray = getMoneyArray("cards");
    const savingsAmountArray = getMoneyArray("savings");

    // filter money values by currency and sum them
    // (ex. UAH: { amount: 3000; qty: 4 }, USD: {amount: 2000; qty: 1 }, EUR: {amount: 0; qty: 0})
    function qtyAndSeparateAmounts(moneyArray) {
        const currencySymbols = ["₴", "$", "€"];

        // sort initial money array by currency ['300 $', '1,000 $'], ['100 €', '2,000 €', '500 €']
        function filterByCurrencySymbol(symbol) {
            return moneyArray.filter((amount) => amount.slice(-1) === symbol);
        }
        const amountsInUAH = filterByCurrencySymbol(currencySymbols[0]);
        const amountsInUSD = filterByCurrencySymbol(currencySymbols[1]);
        const amountsInEUR = filterByCurrencySymbol(currencySymbols[2]);

        // calculate sum of all money values for a particular currency
        function sumInEachCurrency(filteredMoneyArray) {
            const amountNumbers = filteredMoneyArray.map((item) =>
                Math.floor(accounting.unformat(item))
            );
            return amountNumbers.reduce((prevAmount, nextAmount) => {
                return prevAmount + nextAmount;
            }, 0);
        }
        const sumInUAH = sumInEachCurrency(amountsInUAH); // ex. "3000"
        const sumInUSD = sumInEachCurrency(amountsInUSD); // ex. "4500"
        const sumInEUR = sumInEachCurrency(amountsInEUR);

        // make an object with sum and quantity UAH: { amount: ; qty:  }, USD: {amount: ... }, ... }
        const itemsQtyAndAmount = {
            UAH: { amount: sumInUAH, qty: amountsInUAH.length },
            USD: { amount: sumInUSD, qty: amountsInUSD.length },
            EUR: { amount: sumInEUR, qty: amountsInEUR.length },
        };
        return itemsQtyAndAmount;
    }

    // final object with sum and quantity for each item type
    const serverAmountOfItem = {
        wallets: qtyAndSeparateAmounts(walletsAmountArray),
        cards: qtyAndSeparateAmounts(cardsAmountArray),
        savings: qtyAndSeparateAmounts(savingsAmountArray),
    };

    // overall sum calculation for a particular currency
    function overallSum(currencyType) {
        const { wallets, cards, savings } = serverAmountOfItem;
        return (
            wallets[currencyType].amount + cards[currencyType].amount + savings[currencyType].amount
        );
    }

    // final object with overall sum
    const serverTotalAmount = {
        UAH: overallSum("UAH"),
        USD: overallSum("USD"),
        EUR: overallSum("EUR"),
    };

    return { serverAmountOfItem, serverTotalAmount };
};
