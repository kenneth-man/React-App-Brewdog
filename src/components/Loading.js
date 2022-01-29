import React from 'react';
import loadingGif from '../res/images/1493.gif';

const Loading = () => {
  return <div className='Page__div--md w-full loading row'>
    <h1>Loading...</h1>
    <img src={loadingGif} alt='loading-gif'/>
  </div>
};

export default Loading;