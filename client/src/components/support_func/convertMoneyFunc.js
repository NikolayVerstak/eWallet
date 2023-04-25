/* ----------- 
HELPER FUNCTIONS
----------- */

// Dependencies
import accounting from "accounting-js";
import getSymbolFromCurrency from "currency-symbol-map";

/* ---- 
convert SEVERAL numbers to accounting format of money with currencies symbol
example  {USD: 125, UAH: 100, EUR: 30} ->{ 125 $, 100 ₴, 30 €}
---- */
export function formatMoneyAmounts_integer(value, i, currencies) {
    return accounting.formatNumber(value).slice(0, -3) + " " + getSymbolFromCurrency(currencies[i]);
}

/* ---- 
convert just ONE numbers to accounting format WITHOUT decimal
example 123, USD -> 123 $
---- */
export function formatMoneyAmount_integer(value, currencies) {
    return accounting.formatNumber(value).slice(0, -3) + " " + getSymbolFromCurrency(currencies);
}

/* ---- 
convert just ONE numbers to accounting format WITH decimal
example 123 USD -> 123.00 $
---- */
export function formatMoneyAmount_decimal(value, currencies) {
    return accounting.formatNumber(value) + " " + getSymbolFromCurrency(currencies);
}
