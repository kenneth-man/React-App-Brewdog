import React from 'react';

const Input = ({ inputType, inputPlaceholder, inputValue, inputSetState }) => {
  return <input type={inputType} placeholder={inputPlaceholder} value={inputValue} onChange={e => inputSetState(e.target.value)}></input>
};

export default Input;