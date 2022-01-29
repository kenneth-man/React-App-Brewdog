import React, { useContext, useEffect, useState } from 'react';
import Result from '../components/Result';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import { Context } from '../Context';

const Random = () => {
  const { fetchRandomData, isLoading, setIsLoading } = useContext(Context);
  const [randomState, setRandomState] = useState([]);

  useEffect(() => {
    if(randomState.length < 5){
      setIsLoading(true);
      fetchRandomData(randomState, setRandomState);
    } else {
      setIsLoading(false);
    }
  }, [randomState])

  return <div className='Page flex-wrap-list'>
    {
      isLoading ?
      <Loading/> :
      (
        randomState.length > 0 ?
        randomState.map((curr, index) => 
          <Result
            key={index}
            data={curr}
          />
        ) :
        <NoData
          text='No data found...'
        />
      )
    }
  </div>
};

export default Random;