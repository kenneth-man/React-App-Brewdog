import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Context.js';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Input from '../components/Input';
import axios from 'axios';
import loadingGif from '../res/images/1493.gif';

const CARD_OPTIONS = {
    hidePostalCode: true,
	iconStyle: 'solid',
	style: {
		base: {
			iconColor: '#c4f0ff',
			color: '#fff',
			fontWeight: 500,
			fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
			fontSize: '16px',
			fontSmoothing: 'antialiased',
			':-webkit-autofill': { color: '#fce883' },
			'::placeholder': { color: '#87bbfd' }
		},
		invalid: {
			iconColor: '#ffc7ee',
			color: '#ffc7ee'
		}
	}
}

const PaymentForm = () => {
    const { shoppingCartData, updateDocument, readDocumentWoId } = useContext(Context);
    const [success, setSuccess] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [location, setLocation] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        if(shoppingCartData.length === 0){
            alert('Error: Empty shopping cart');
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        })

        if(!error){
            try {
                const { id } = paymentMethod;
                const response = await axios.post('http://localhost:4000/payment', {
                    amount: 1000,
                    id
                })
    
                if(response.data.success && firstName && lastName && location && dob){
                    setSuccess(true); 

                    const userData = await readDocumentWoId('users');
                    await updateDocument('users', userData[0].id, 'shoppingCart', []);

                    // setShoppingCartData([]);
                    // setShoppingCartTotal(0);

                    setTimeout(() => navigate('/'), 5000);
                } else {
                    alert('Error: Missing input values');
                }   
            } catch (error){
                alert(`ErrorType: ${error.type},\nErrorMessage: ${error.message}`);
            }
        } else {
            alert(`ErrorType: ${error.type},\nErrorMessage: ${error.message}`);
        }
    }

    return (
        <>
            {
                !success ?
                <div className='Page__div--xl col'>
                    <div className='col'>
                        <h1>Checkout</h1>
                        <h2>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className='Page__div--lg checkout__form col w-full'>
                        <div className='checkout__grid'>
                            <div className='col'>
                                <label>&ndash; First Name &ndash;</label>
                                <Input 
                                    inputType='text'
                                    inputPlaceholder='First name...' 
                                    inputValue={firstName}
                                    inputSetState={setFirstName}
                                />
                            </div>
                            <div className='col'>
                                <label>&ndash; Surname &ndash;</label>
                                <Input 
                                    inputType='text'
                                    inputPlaceholder='Surname...' 
                                    inputValue={lastName}
                                    inputSetState={setLastName}
                                />
                            </div>
                            <div className='col'>
                                <label>&ndash; Date Of Birth &ndash;</label>
                                <Input 
                                    inputType='date'
                                    inputPlaceholder='DD/MM/YYYY...' 
                                    inputValue={dob}
                                    inputSetState={setDob}
                                />
                            </div>
                            <div className='col'>
                                <label>&ndash; Country &ndash;</label>
                                <Input 
                                    inputType='text'
                                    inputPlaceholder='Country...' 
                                    inputValue={location}
                                    inputSetState={setLocation}
                                />
                            </div>
                        </div>
                        <fieldset className='FormGroup'>
                            <div className='FormRow'>
                                <CardElement options={CARD_OPTIONS}/>
                            </div>
                        </fieldset>
                        <button type='submit'>Pay</button>
                    </form>
                </div> :
                <div className='Page__div--md col'>
                    <h1>Payment Successfully Completed! Thank you for Shopping with Brewdog!</h1>
                    <h2>You will now be automatically re-directed to the Home Page...</h2>
                    <img src={loadingGif} alt='loading-gif'/>
                </div>
            }  
        </>
    )
}

export default PaymentForm;