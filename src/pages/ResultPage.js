import React, { useContext, useEffect } from 'react';
import NoData from '../components/NoData';
import { Context } from '../Context';
import tempBackgroundImage from '../res/images/background1.jpg';

const ResultPage = () => {
  const { resultPageData, setResultPageData, updateDocument, readDocumentWoId, generateRandomPrice } = useContext(Context);

  const formatIngredients = (element, idx, arr) => 
    idx === arr.length - 1 ?
    <h3 key={idx}>{element.name} - {element.amount.value}{element.amount.unit}</h3> :
    <h3 key={idx}>{element.name} - {element.amount.value}{element.amount.unit}, &nbsp;</h3>

  const addToShoppingCartOnClick = async () => {
    const userDataObj = await readDocumentWoId('users');
    await updateDocument('users', userDataObj[0].id, 'shoppingCart', resultPageData, false);
    alert(`Added 1x '${resultPageData.name}' to Shopping Cart`);
  }

  useEffect(() => {
    if(resultPageData){
      const randomPrice = generateRandomPrice();
      setResultPageData({...resultPageData, price: randomPrice})
    }
  }, [])

  return <div 
    className='Page resultPage' 
    style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(${resultPageData && (resultPageData.image_url ? resultPageData.image_url : tempBackgroundImage)})`}}
    >
      {
        resultPageData ?
        <>
          <div className='Page__div--md resultPage__titles col w-full'>
            <h1>{resultPageData.name}</h1>
            <h2>{resultPageData.price ? resultPageData.price : '£0.00'}</h2>
            <h2 className='italic'>"{resultPageData.tagline}"</h2>
            <h2>First brewed in {resultPageData.first_brewed}</h2>
          </div>
          <div className='Page__div--lg resultPage__cont col w-full'>
            <div className='Page__div--md col'>
              <h1>Information</h1>
              <h2>{resultPageData.description}</h2>
              <h2>{resultPageData.brewers_tips}</h2>
            </div>

            <div className='Page__div--lg resultPage__cont col'>
              <h1>Ingredients</h1>
              <div className='resultPage__wrapper col'>
                <h2 className='bold italic'>HOPS</h2>
                <div className='col'>
                  {
                    resultPageData.ingredients.hops.map((curr, index, array) =>
                      formatIngredients(curr, index, array)
                    )
                  }
                </div>
              </div>
              <div className='resultPage__wrapper col'>
                <h2 className='bold italic'>MALT</h2>
                <div className='col'>
                  {
                    resultPageData.ingredients.malt.map((curr, index, array) =>
                      formatIngredients(curr, index, array)
                    )
                  }
                </div>
              </div>
              <div className='col'>
                <h2 className='bold italic'>YEAST</h2>
                <h3>{resultPageData.ingredients.yeast}</h3>
              </div>
            </div>
        
            <div className='Page__div--md col'>
              <h1>Goes well with ...</h1>
              <div className='row'>
                {
                  resultPageData.food_pairing.map((curr, index, array) =>
                    index === array.length - 1 ?
                    <h2 key={index}>{curr}</h2> :
                    <h2 key={index}>{curr}, &nbsp;</h2>
                  )
                }
              </div>
            </div>
          </div>
          <button onClick={addToShoppingCartOnClick} style={{marginBottom: '100px'}}>Add to Shopping Cart</button>
        </> :
        <NoData text='No result data found. Please choose another item' extraClasses='no-underline'/>
      }
    </div>
};

export default ResultPage;