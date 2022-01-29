import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Loading from '../components/Loading';
import Input from '../components/Input';
import { ReactComponent as RegisterIcon } from '../res/icons/send.svg';
import background3 from '../res/images/background3.jpg';

const Register = () => {
  const { auth, clearInputs, isLoading, setIsLoading, checkValidEmail, checkValidPassword } = useContext(Context);
  const navigate = useNavigate();
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
  const [registerError, setRegisterError] = useState(undefined);

  const registerEmailOnSubmit = async event => {
    try {
      event.preventDefault();
      setIsLoading(true);

      if(checkValidEmail(registerEmail) && checkValidPassword(registerPassword, registerPasswordConfirm)){ 
        await createUserWithEmailAndPassword(auth, registerEmail, registerPassword); 
      } else {
        setRegisterError({ msg: 'Invalid Email or Password (passwords must be longer than 8 characters)', code: '403' });
      }

      setIsLoading(false);
    } catch(error){
      setRegisterError({ msg: error.message, code: error.code });
    }
  }

  useEffect(() => {
    if(registerError){
      alert(`Register Error: ${registerError.msg}, Error Code: ${registerError.code}`);
      clearInputs([setRegisterEmail, setRegisterPassword, setRegisterPasswordConfirm]);
      setRegisterError(undefined);
      setIsLoading(false);
    }
  }, [registerError])
  
  useEffect(() => onAuthStateChanged(auth, user => user && navigate('/')), [])

  return <div className='Page register cnt w-full' style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${background3})`}}>
    {
      isLoading ?
      <Loading/> :
      <div className='Page__div--lg col w-full'>
        <h1>Register with your Email and Password</h1>
        <form className='register__form col' onSubmit={e => registerEmailOnSubmit(e)}>
          <Input
            inputType='text'
            inputPlaceholder='Type in your email address...'
            inputValue={registerEmail}
            inputSetState={setRegisterEmail}
          />
          <Input
            inputType='password'
            inputPlaceholder='Type in your password...'
            inputValue={registerPassword}
            inputSetState={setRegisterPassword}
          />
          <Input
            inputType='password'
            inputPlaceholder='Re-type your password...'
            inputValue={registerPasswordConfirm}
            inputSetState={setRegisterPasswordConfirm}
          />
          <button type='submit' className='row'>
            <h2>Register</h2>
            <RegisterIcon/>
          </button>
        </form>
      </div>
    }
  </div>
};

export default Register;