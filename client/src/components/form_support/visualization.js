/* ----------- 
FORM HELPER COMPONENTS (visual elements)
----------- */

// Dependencies
import getSymbolFromCurrency from "currency-symbol-map";
// Other components and files
import { formatMoneyAmount_integer } from "../support_func/convertMoneyFunc";
import { pattern } from "./patterns";

// reusable Paragraph that allows transforming text from full-size (before typing something inside
// input) to Label above input value (after typing)
export const MovingLabel = ({ inputName, watch, text }) => {
    if (watch) {
        return <p className={`${inputName}-above-view`}>{text}</p>;
    } else {
        return <p className={`${inputName}-full-view`}>{text}</p>;
    }
};

// reusable Paragraph that shows 0 UAH if there is a non-digit input value of money amount
// and integer (ac. to accounting format) without decimal
export const MoneyParagraphView = ({ watchValue, watchSymbol, id }) => {
    // check if value's a number and the first character isn't 0
    if (watchValue.match(pattern.onlyDigits) && watchValue[0] !== "0") {
        return (
            <p id={id}>
                {/* convert number to accounting fotmat without decimal  */}
                {formatMoneyAmount_integer(watchValue, watchSymbol)}
            </p>
        );
    } else {
        // otherwise, return 0
        return <p id={id}>0&nbsp;{getSymbolFromCurrency(watchSymbol)}</p>;
    }
};
