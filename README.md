# Overview

eWallet is a web application that enables a user to keep track of their finances through a convenient interface. It features three primary functions: wallet creation, credit card addition, and savings goal planning. Furthermore, the app lets a user know about their overall balance and monitor the amount of money for each account type. To ensure secure access to the app's features and financial data, a user has to authenticate using Google Auth.

The app is deployed at the following link: **https://your-e-wallet.onrender.com**.

## Technologies

This app was built using the **MERN** stack (MongoDB, Express.js, React, Node.js).

In addition to the core technologies, the following libraries and tools were used to enhance the functionality and user experience of the app:

-   Client-side libraries: react-hook-form, react-redux, reduxjs/toolkit, react-router, axios, uuid, dotenv, inputmask, currency-symbol-map, lodash;
-   User interface technologies: CSS and react-bootstrap;

-   Server-side libraries: mongoose, cors, nodemon, jwt-decode, concurrently, dotenv.

## Appearance

###### Sing In Page:

<img src="/appearance/sing-in-page.jpeg" alt="sign in"  width="665px">

###### Home Page (for laptops):

<img src="/appearance/home-page_laptop.jpeg" alt="home page for laptops" width="800px">

###### Home Page (for tablets):

<img src="/appearance/home-page_tablet.jpeg" alt="home page for tablets" width="700px">

###### Home Page (for mobile devices):

![home page for mobiles](/appearance/home-page_mobile.jpeg)

###### "Add a New Item" Page:

<img src="/appearance/add-a-new-card.jpeg" alt="add a new item" width="750px">

###### "Edit the Item" Page:

<img src="/appearance/edit-page.jpeg" alt="edit the item" width="750px">

###### "Items List" Page:

<img src="/appearance/show-all.jpeg" alt="show all items" width="750px">

## How to launch locally

Before the main settings, you should:

1. Create a new web project in Google Cloud Platform [https://console.cloud.google.com/](https://console.cloud.google.com/).
2. Create a new project with a free cluster in MongoDB Cloud Services [https://www.mongodb.com/cloud](https://www.mongodb.com/cloud).
3. Get a free API key from Ninjas API [https://api-ninjas.com/](https://api-ninjas.com/).

In the "client" directory, you should:

-   In the file "axios.js" (the path is /client/src/utils/axios.js) change the baseURL
    from `https://your-e-wallet-api.onrender.com/api` to `http://localhost:3001/api`

-   Create an .env file and define the environmental variables
    `REACT_APP_CLIENT_ID` (which equals your Client ID of the created Google project)
    `REACT_APP_CURRENCY_CONVERTER_API` (which equals your API key from Currency Converter API)

-   Install the dependencies

    `npm install`

-   Start the client-side

    `npm start`

In the "server" directory, you should:

-   Create an .env file and define the environmental variables
    `PORT=3001`
    `DB_STRING=mongodb+srv://test-user:<password>@ewallet.3vceijf.mongodb.net/`
    (which equals your connection string for the MongoDB project)

-   Install the dependencies

    `npm install`

-   Start the server-side

    `npm start`

If all the dependencies were installed, then you can launch the app from the root directory by starting both the client-side and the server-side:

-   Start the app
    `npm start`

Open [http://localhost:3000](http://localhost:3000) in your browser to view it.

The page will reload when you make changes.\
You may also see any lint errors in the console and all server changes in the terminal.
