import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm.js';

const PUBLIC_KEY = "pk_test_51JsQiiCo6B9E9k9LfkMgFobWyAv8p9dAEQl50wKuwNqKH1t4agzU0rru7R17Jf8DPn4tQt2XdGND9XXEfmgyluDb003Adv0ZLn";
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = () => {
    return (
        <Elements stripe={stripeTestPromise}>
            <PaymentForm/>
        </Elements>
    )
}

export default StripeContainer;