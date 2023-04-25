/* ----------- 
CARD FORM HELPER FUNCTIONS 
----------- */

/* ----- SWITCHING FRONT/BACK CARD VIEWS FOR SMALL DEVICES ----- */

// show back side of the card (and hide front side) if a user enters CVV input div
export const showCardBackSide = () => {
    if (window.innerWidth < 992) {
        document.querySelector(".card-front-view").style.transform = "rotateY(180deg)";
        document.querySelector(".card-back-view").style.transform = "rotateY(360deg)";
    }
};
// hide back side of the card (and show front side) if a user leaves CVV input div
export const hideCardBackSide = (e) => {
    if (window.innerWidth < 992) {
        // if user moves mouse from CVV number to eye-icon, don't apply onBlur event
        if (e.relatedTarget && e.relatedTarget.className === "cvv-icons") {
        } else {
            document.querySelector(".card-front-view").style.transform = "rotateY(0deg)";
            document.querySelector(".card-back-view").style.transform = "rotateY(180deg)";
        }
    }
};

/* ----------- HIDE-SHOW CVV ----------- */

// fuction to show-hide CVV-code
export const showHideCVV = (e) => {
    // all DOM elements used for showing-hidding CVV-code
    const eyeShowCVV = document.querySelector("img.show-cvv-icon");
    const eyeHideCVV = document.querySelector("img.hide-cvv-icon");
    const cvvNumberMasked = document.querySelector("span.cvv-masked");
    const cvvNumberVisible = document.querySelector("span.cvv-visible");
    const cvvInput = document.getElementById("CVV");
    // switch visibility between icons
    eyeShowCVV.classList.toggle("visible");
    eyeHideCVV.classList.toggle("visible");
    // if the code is masked and a user clicks on eye icon - show the code
    if (e.target.classList.value === "show-cvv-icon") {
        // show CVV number on Card View
        cvvNumberMasked.style.display = "none";
        cvvNumberVisible.style.display = "block";
        // show CVV number inside Card Input
        cvvInput.type = "text";
        // hide Front View and show Back View of the Card
    }
    if (e.target.classList.value === "hide-cvv-icon") {
        // otherwise hide the code on Card View with * symbols
        cvvNumberMasked.style.display = "block";
        cvvNumberVisible.style.display = "none";
        // hide the code inside Card Input with * symbols
        cvvInput.type = "password";
    }
};

// fuction to mask CVV-code with * symbols
export const maskCVV = (number, mask) => {
    // all DOM elements used for masking of CVV-code
    const eyeShowCVV = document.querySelector("img.show-cvv-icon");
    const eyeHideCVV = document.querySelector("img.hide-cvv-icon");
    const cvvNumberMasked = document.querySelector("span.cvv-masked");
    const cvvNumberVisible = document.querySelector("span.cvv-visible");
    const cvvInput = document.getElementById("CVV");
    // if the code isn't full, show last number and mask previous one with *
    if (number.length < 3) {
        // if the code was full and a user deleted one digit
        if (eyeShowCVV.classList.value === "show-cvv-icon visible") {
            // hide "opened eye" icon if it exists
            eyeShowCVV.classList.remove("visible");
        }
        if (eyeHideCVV.classList.value === "hide-cvv-icon visible") {
            //hide "closed eye" icon if it exists
            eyeHideCVV.classList.remove("visible");
        }
        // mask the code if it was shown
        cvvNumberVisible.style.display = "none";
        cvvNumberMasked.style.display = "block";
        // if a user delete 3rd digit, hide number - replace them with * inside the input
        cvvInput.type = "password";
        return ("" + number).slice(0, -1).replace(/./g, mask) + ("" + number).slice(-1);
        // if the code is full - mask all digits
    } else if (number.length === 3) {
        // check what eye icon existed last time, if component was rerendered
        if (eyeHideCVV && eyeShowCVV && eyeHideCVV.classList.value !== "hide-cvv-icon visible") {
            // if a "closed eye" icon existed, do nothing
            // if a user has just entered 3rd digit, show an "opened eye" icon
            eyeShowCVV.classList.add("visible");
        }
        return number.replace(/./g, mask);
    }
};

// function to compare the expiration date with current date
export const notExpiredCard = (watchMonthValue, watchYearValue, clearErrors, setError) => {
    // get today's month and year
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    // show or hide error message if a user chose the expiration month and year
    if (watchMonthValue && watchYearValue) {
        // convert expiration month and year to number
        let monthValue = parseInt(watchMonthValue);
        let yearValue = parseInt(watchYearValue);
        // create value that will be returned
        let isNotExpired = undefined;

        switch (yearValue > currentYear) {
            // if the expiration year is greater than the current year
            case true: {
                // remove error message
                clearErrors("month");
                return (isNotExpired = true);
            }
            // if the expiration year is equal or less than the current year
            case false: {
                yearValue !== currentYear
                    ? (isNotExpired = false)
                    : // if the expiration year is equal the current year, check months
                    monthValue >= currentMonth
                    ? (isNotExpired = true)
                    : (isNotExpired = false);
                // if returned value is false (and a user has just chosen the expiration year),
                // show the next error under month input
                isNotExpired
                    ? // otherwise, remove that error
                      clearErrors("month")
                    : setError("month", {
                          type: "isValidDate",
                          message: "This credit card is expired. The date has already passed",
                      });
                return isNotExpired;
            }
            default: {
                return isNotExpired;
            }
        }
    } else {
        return true;
    }
};

// function to divide card number by 4 and return each part inside span
export function divideByFour(watchCardNumber, divider) {
    const arrOfSlices = Array.from([0, 1, 2, 3], (point) => point * divider);
    return arrOfSlices.map((number, i) => {
        return <span key={i}>{watchCardNumber.slice(number, number + 4) || "----"}</span>;
    });
}
