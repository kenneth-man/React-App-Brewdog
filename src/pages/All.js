import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import NoData from '../components/NoData';
import Loading from '../components/Loading';
import Result from '../components/Result';
import Pagination from '../components/Pagination';

const All = () => {
  const { fetchAllData, allPageNum, setAllPageNum, isLoading, setIsLoading } = useContext(Context);
  const [allPageData, setallPageData] = useState([]);
  const [allPageNextData, setAllPageNextDataData] = useState([]);

  useEffect(async () => {
    setIsLoading(true);
    await fetchAllData(allPageNum, setallPageData);
    await fetchAllData(allPageNum + 1, setAllPageNextDataData);
    setIsLoading(false);
  }, [allPageNum])

  return <>
    <div className='Page flex-wrap-list'>
      {
        isLoading ?
        <Loading/> :
        (
          allPageData.length > 0 ?
          allPageData.map((curr, index) => 
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

    <Pagination 
      currPageNum={allPageNum} 
      currPageNumSetState={setAllPageNum} 
      nextFetchedData={allPageNextData}
    />
  </>
};

export default All;