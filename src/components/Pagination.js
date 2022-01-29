import React, { useState, useEffect, useRef } from 'react';

const Pagination = ({ currPageNum, currPageNumSetState, nextFetchedData }) => {
  const [leftBtnPageNum, setLeftBtnPageNum] = useState(1);
  const [rightBtnPageNum, setRightBtnPageNum] = useState(1);
  const isInitialRender = useRef(true);

  const updateBtnPageNums = () => { 
    //checking for (pg1...pg1...pg2) and (pg1...pg2...pg3) page number combinations
    if(nextFetchedData.length > 0){
      currPageNum <= 2 ?
      setLeftBtnPageNum(1) :
      setLeftBtnPageNum(currPageNum - 1);
      
      setRightBtnPageNum(currPageNum + 1);
    } else {
      setLeftBtnPageNum(currPageNum - 1);
      setRightBtnPageNum(currPageNum);
    }
  }

  const updatePageNum = isIncrement => isIncrement ? currPageNumSetState(currPageNum => currPageNum + 1) : currPageNumSetState(currPageNum => currPageNum - 1);

  useEffect(() => isInitialRender.current ? isInitialRender.current = false : updateBtnPageNums(), [nextFetchedData])

  return <div className='row pagination w-full'>
    <button className='navLink' onClick={() => updatePageNum(false)}>{leftBtnPageNum}...</button>
    <h1>Page {currPageNum}</h1>
    <button className='navLink' onClick={() => updatePageNum(true)}>...{rightBtnPageNum}</button>
  </div>
};

export default Pagination;