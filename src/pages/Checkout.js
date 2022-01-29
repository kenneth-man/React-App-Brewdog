import React from 'react';
import StripeContainer from '../components/StripeContainer';
import backgroundImage from '../res/images/background2.jpg'

const Checkout = () => {
  return <div className='Page checkout cnt' style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage})`}}>
    <StripeContainer/>  
  </div>
};

export default Checkout;