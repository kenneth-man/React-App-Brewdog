import React, { useContext, useEffect } from 'react';
import Input from '../components/Input';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import Result from '../components/Result';
import { Context } from '../Context';

const Search = () => {
  const { fetchSearchData, searchPageData, searchPageResults, setSearchPageResults, searchPageQuery, setSearchPageQuery, isLoading, setIsLoading } = useContext(Context);

  const filterSearchPageResults = () => setSearchPageResults( searchPageData.filter(curr => curr.name.toLowerCase().includes(searchPageQuery.toLowerCase())) );

  useEffect(async () => {
    try {
      if(searchPageData.length === 0){
        setIsLoading(true);
        await fetchSearchData();
        setIsLoading(false);
      }
    } catch(error){
      alert(error.message, error.code);
      setIsLoading(false);
    }
  }, [])

  useEffect(() => searchPageQuery && !isLoading ? filterSearchPageResults() : setSearchPageResults([]), [searchPageQuery])

  return <div className='Page'>
    <div className='Page__div--md col search'>
      <h1>Search for beers in out database!</h1>

      <Input
        inputType='text'
        inputPlaceholder='Type the name of the beer here...'
        inputValue={searchPageQuery}
        inputSetState={setSearchPageQuery}
      />
    </div>

    <div className='flex-wrap-list'>
      {
        isLoading ?
        <Loading/> :
        (
          searchPageResults.length > 0 ?
          searchPageResults.map((curr, index) => 
            <Result
              key={index}
              data={curr}
            />
          ) :
          <NoData
            text='No results found...'
          />
        )
      }
    </div>
  </div>
};

export default Search;