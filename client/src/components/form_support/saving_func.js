/* ----------- 
SAVING FORM HELPER FUNCTIONS 
----------- */

// Other components and files
import { pattern } from "../form_support/patterns";

// function to calculate percentage of collected money for particular saving and show on the screen
export function calculatePercentage(watchMoneyValue, watchTargetValue) {
    // calculate percentage
    let value = (Number(watchMoneyValue) / Number(watchTargetValue)) * 100;
    // if current amount of money less that target amount
    if (value >= 0 && value <= 100) {
        // show percentage integer
        return Math.floor(value);
    } else if (value > 100) {
        // otherwise, show 0
        return 0;
    }
}

// function to check if current amount of money less that target amount
export function compareValues(watchMoneyValue, watchTargetValue, setError, clearErrors) {
    // check first if money values are numbers
    if (isNumber(watchMoneyValue, watchTargetValue)) {
        // if current amount of money less than target amount
        if (Number(watchMoneyValue) <= Number(watchTargetValue)) {
            // remove the error for money input from screen
            clearErrors("money");
            // and return true to pass validation
            return true;
            // if current amount of money mpre than target amount
        } else if (Number(watchMoneyValue) > Number(watchTargetValue)) {
            // add an error for money input
            setError("money", { type: "lessThanTarget", message: pattern.overflowAmountError });
            // and return false for validation conditions
            return false;
        }
    }
    // if money values aren't numbers, return true to pass validation
    return true;
}

// function to check money values
// (if they are digits, if target is greater than 0 and if number doesn't start from 0)
export function isNumber(watchMoneyValue, watchTargetValue) {
    // convert initial strings to true if (money values) contain only digits
    const moneyNumber = !!watchMoneyValue && pattern.onlyDigits.test(watchMoneyValue);
    const targetNumber = !!watchTargetValue && pattern.onlyDigits.test(watchTargetValue);
    // if the first digit is 0, and there are other digits after that 0, return false (ex. 03112 $)
    if (watchMoneyValue[0] === "0" && watchMoneyValue.length > 1) return false;
    if (watchTargetValue[0] === "0" && watchTargetValue.length > 1) return false;
    // if strings contain only numbers and target value is more than 0, return true
    return moneyNumber && targetNumber && +watchTargetValue > 0;
}
