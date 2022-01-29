import React, { useContext, useState } from 'react';
import { Context } from '../Context';
import { Link } from 'react-router-dom';
import backupImage from '../res/images/background1.jpg'
import { ReactComponent as RemoveIcon } from '../res/icons/remove_shopping_cart.svg';

const Result = ({ data, numOfResult }) => {
  const { setResultPageData, updateDocument, readDocumentWoId } = useContext(Context);
  const [isRemoveTextShown, setIsRemoveTextShown] = useState(false);

  const removeItemOnClick = async () => {
    const userData = await readDocumentWoId('users');
    const shoppingCartData = userData[0].shoppingCart;
    //since 'ShoppingCart' page handles counting duplicates of items, here i can just remove the first occurance by splicing based on index
    const indexToRemove = shoppingCartData.findIndex(curr => curr.name === data.name);
    const removedItemArray = shoppingCartData.filter((curr, index) => index !== indexToRemove)
    
    await updateDocument('users', userData[0].id, 'shoppingCart', removedItemArray);
  }

  return <Link 
      to={!numOfResult && `/ResultPage/${data.name}`} 
      className='result col' 
      style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),url(${data.image_url ? data.image_url : backupImage})`}}
      onClick={() => numOfResult ? removeItemOnClick() : setResultPageData(data)}
      onMouseOver={() => numOfResult && setIsRemoveTextShown(true)}
      onMouseOut={() => numOfResult && setIsRemoveTextShown(false)}
    >
    {
      isRemoveTextShown ?
      <>
        <RemoveIcon/>
        <h2 className='italic bold'>Click to remove 1 of this Item</h2>
      </> :
      <>
        <h1>{data.name}</h1>
        <h2>"{data.tagline}"</h2>
        <h2>{data.price} each</h2>
      </>
    }
    {
      numOfResult ?
      <h2>{numOfResult}x in Shopping Cart</h2> : 
      <h2>est. {data.first_brewed}</h2>
    }
  </Link>
};

export default Result;