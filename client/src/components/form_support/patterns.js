/* ----------- 
VALIDATION PATTERNS
----------- */

export const pattern = {
    /* ----- GENERAL ------ */

    // item amount value
    onlyDigits: /^\d*$/,
    onlyDigitsAndDot: /^[\d.]*(\d*)?$/,
    onlyDigitsError: "Use only digits",

    // general - requiered
    required: "The field is required",

    // saving current amount can't be more than targer amount
    overflowAmountError: "Current amount should be less than target",

    // unique name of each item
    notUniqueCard: "This card already exists",
    notUniqueName: "This name already exists",

    // each word should have more than 3 chars
    smallWords: function (setOfLetters) {
        const words = setOfLetters.replace(/[^a-zA-Z ]/g, "").split(" ");
        const array = words.filter((word) => word.length !== 0 && word.length < 3);
        return array.length === 0 ? true : false;
    },
    smallWordsError: "Enter at least 3 characters for each word",

    // name should have more than 3 chars
    smallFirstWord: function (setOfLetters) {
        const words = setOfLetters.replace(/[^a-zA-Z ]/g, "").split(" ");
        const array = words.filter((word) => word.length !== 0);
        return !array[0] || array[0].length >= 3;
    },
    // for card holder's name
    smallNameError: "Enter at least 3 characters",
    // for wallet and saving names
    smallFirstWordError: "Enter at least 3 characters for the first word",

    // when a user enter one word and enter whitespace, show the warning to enter the next word
    nextWord: function (setOfLetters) {
        return setOfLetters === "" || setOfLetters.length <= 3
            ? true
            : /([a-zA-Z]+\s$)+/.test(setOfLetters)
            ? false
            : true;
    },
    nextWordError: "Enter the next word",

    // when user enter more than one whitespace
    extraSpaces: function (setOfLetters) {
        return setOfLetters === "" || setOfLetters.length <= 3
            ? true
            : /([a-zA-Z]+[ ]{2,})+/.test(setOfLetters)
            ? false
            : true;
    },
    extraSpacesError: "Delete extra whitespaces",

    // when a user start entering name from whitespace
    symbolStart: function (name) {
        return pattern.latinChars.test(name[0]);
    },

    /* ----- CREDIT CARD ------ */

    // card holder names
    latinChars: /^[A-Za-z]+$/,
    latinCharsAndSpace: /^[A-Za-z ]+$/,
    latinCharsError: "Only Latin chars are valid",

    // card number
    sixteenDigits: /\d{4}[ ]?\d{4}[ ]?\d{4}[ ]?\d{4}/,
    sixteenDigitsError: "Enter a 16-digit number",

    // card cvv-code
    cvvNumber: /^\d{3}$/,
    cvvNumberError: "Enter a 3-digit number",

    // when a user start entering credit card money value from dot (ex: .085)
    nonFirstDigit: function (cardMoneyValue) {
        // unary plus converts a string to a number
        return !isNaN(+cardMoneyValue[0]);
    },
    nonFirstDigitError: "Enter a first digit",

    // allow a user to enter only two digits after dot for credit card money value
    moneyDecimal: function (cardMoneyValue) {
        return /^\d*([.][0-9]{1,2})?$/.test(cardMoneyValue);
    },
    moneyDecimalError: "Enter not more than 2 digits after the dot",

    // allow a user to enter only mastercard or visa numbers
    isValidNumber: function (numberAndSpaces) {
        const cardNumber = numberAndSpaces.split(" ").join("");
        const paymentSystem = ["visa", "mastercard"];
        const validNumber = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            // amex: /^3[47][0-9]{13}$/,
            // diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            // discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
            // jcb: /^(?:2131|1800|35\d{3})\d{11}$/
        };
        let matchResults = [];
        paymentSystem.map((type) => {
            let isMatched = validNumber[type].test(cardNumber);
            return matchResults.push(isMatched);
        });
        return matchResults.includes(true);
    },
    isValidNumberError: "This number is invalid (only Visa or Mastercard)",

    // check exiration date
    notExpiredCardError: "This credit card is expired. The date has already passed",

    /* ----- SAVING ------ */

    // saving target amount can't be zero
    nonZeroAmount: /^[1-9]{1}$/,
    nonZeroAmountError: "Enter non-zero number",
    // forbid any digits, if the first digit is zero
    nonZeroError: "Amount can't start from zero",
};
