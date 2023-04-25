/* ----------- 
START PAGE BEFORE USER SING IN
----------- */

// Dependencies
import React from "react";
// Styles
import "../../styles/SignIn.css";
// Other components and files
import cardImage from "../../images/credit-card-home.png";
import walletImage from "../../images/wallet.png";
import savingsImage from "../../images/saving_bag.png";

const SignIn = () => {
    return (
        <main className="start-page-wrapper">
            <section className="start-page">
                <div className="main-circle">
                    {/* infinite animation based on 3 rounded pictures in the center of the screen */}
                    <figure className="circle-card">
                        <img className="start-page-img" src={cardImage} alt="credit card" />
                    </figure>
                    <figure className="circle-wallet">
                        <img className="start-page-img" src={walletImage} alt="wallet" />
                    </figure>
                    <figure className="circle-saving">
                        <img className="start-page-img" src={savingsImage} alt="saving" />
                    </figure>
                </div>
            </section>
        </main>
    );
};

export default SignIn;
