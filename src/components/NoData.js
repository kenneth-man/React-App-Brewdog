import React from 'react';
import { ReactComponent as NoDataIcon } from '../res/icons/emoji-sad.svg'

const NoData = ({ text, extraClasses }) => {
  return <div className='Page__div--md noData w-full row'>
    <h1 className={`${extraClasses}`}>{text}</h1>
    <NoDataIcon/>
  </div>
};

export default NoData;