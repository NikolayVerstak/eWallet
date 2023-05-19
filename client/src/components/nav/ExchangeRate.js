/* ----------- 
COMPONENT TO GET REAL TIME EXCHANGE RATE
----------- */

// Dependencies
import React, { useEffect, useState } from "react";
import axios from "axios";

const ExchangeRate = ({ currency }) => {
    // current rate state
    const [rate, setRate] = useState(0);
    // api key from web sevice https://api-ninjas.com/
    const convertKey = process.env.REACT_APP_CURRENCY_CONVERTER_API;

    useEffect(() => {
        axios({
            method: "GET",
            url: `https://api.api-ninjas.com/v1/convertcurrency?have=${currency}&want=UAH&amount=1`,
            headers: { "X-Api-Key": convertKey },
            contentType: "application/json",
        })
            .then((response) => {
                // value from API
                const apiValue = response.data.new_amount.toFixed(2);
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
