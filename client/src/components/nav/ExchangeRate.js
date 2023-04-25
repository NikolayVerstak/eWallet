/* ----------- 
COMPONENT TO GET REAL TIME EXCHANGE RATE
----------- */

// Dependencies
import React, { useEffect, useState } from "react";
import axios from "axios";

const ExchangeRate = ({ currency }) => {
    // current rate state
    const [rate, setRate] = useState(0);
    // api key from web sevice https://free.currencyconverterapi.com/
    const convertKey = process.env.REACT_APP_CURRENCY_CONVERTER_API;
    useEffect(() => {
        axios({
            method: "GET",
            url: `https://free.currconv.com/api/v7/convert?q=${currency}_UAH&compact=ultra&apiKey=${convertKey}`,
        })
            .then((response) => {
                // value from API
                const fromTo = `${currency}_UAH`;
                const apiValue = response.data[fromTo].toFixed(2);
                setRate(apiValue);
            })
            .catch((error) => {
                console.log(error);
            }, []);
        // eslint-disable-next-line
    }, []);
    return (
        // string that is shown inside NavBar dropdown
        <p>
            {currency} / UAH &nbsp; {rate}
        </p>
    );
};

export default ExchangeRate;
