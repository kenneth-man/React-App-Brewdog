import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Result from '../components/Result';
import NoData from '../components/NoData';
import { ReactComponent as CheckoutIcon } from '../res/icons/add_shopping_cart.svg';
import { ReactComponent as LogOutIcon } from '../res/icons/send.svg';

const ShoppingCart = () => {
  const { logout, readDocumentOnSnapshot, readDocumentWoId, isLoading, 
    setIsLoading, shoppingCartData, setShoppingCartData, shoppingCartTotal, setShoppingCartTotal } = useContext(Context);
  const [userData, setUserData] = useState(undefined);
  const navigate = useNavigate(); 

  const logoutOnClick = async () => {
    await logout();
    navigate('/');
  }

  useEffect(async () => {
    try {
      setIsLoading(true);
      const userDataObj = await readDocumentWoId('users');
      await readDocumentOnSnapshot('users', userDataObj[0].id, setUserData);
      setIsLoading(false);
    } catch(error){
      alert(error.message, error.code);
      setIsLoading(false);
    }

    return () => setUserData([])
  }, [])

  useEffect(() => {
    if(userData){
      //calc total accumulated price in shopping cart; 'slice(1)' to remove '£' in string
      const totalPrice = userData.shoppingCart.reduce((acc, curr) => acc += Number(curr.price.slice(1)), 0);
      //number of each item stored as key value pairs
      let numOfItems = {};

      //update total price state to 2dp
      setShoppingCartTotal(totalPrice.toFixed(2));
      
      //'totals[curr.name] || 0' - returns the value of totals[x] if it exists, otherwise 0; then plus 1
      userData.shoppingCart.forEach(curr => numOfItems[curr.name] = (numOfItems[curr.name] || 0) + 1 );

      //return an array with duplicates removed
      const uniqueItems = userData.shoppingCart.filter((curr, index, array) => array.findIndex(currEl => currEl.name === curr.name) === index);
  
      setShoppingCartData( uniqueItems.map(curr => ({ data: curr, total: numOfItems[curr.name] })) );
    }
  }, [userData])

  return <div className='Page'>
    <div className='Page__div--lg flex-wrap-list'>
      {
        isLoading ?
        <Loading/> :
        (
          shoppingCartData.length > 0 ?
          shoppingCartData.map((curr, index) =>
            <Result
              key={index}
              data={curr.data}
              numOfResult={curr.total}
            />
          ) :
          <NoData 
            text='You shopping cart is empty...'
          />
        )
      }
    </div>
    <div className='Page__div--md col'>
      <h1>Total Price - £{shoppingCartTotal}</h1>

      <div className='Page__div--sm row shoppingCart__buttons'>
        <Link to='/Checkout' className='link row'>
          Check out
          <CheckoutIcon/>
        </Link>
        <button onClick={logoutOnClick} className='row'>
          Log out
          <LogOutIcon/>
        </button>
      </div>
    </div>
    
  </div>
};

export default ShoppingCart;