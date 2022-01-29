import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Loading from '../components/Loading';
import brewdogLogo from '../res/images/logo.png';
import { ReactComponent as GoogleIcon } from '../res/icons/google3.svg'; 
import { ReactComponent as LoginIcon } from '../res/icons/send.svg'; 
import { signInWithEmailAndPassword } from "firebase/auth";
import background1 from '../res/images/background1.jpg';
import background2 from '../res/images/background2.jpg';
import background3 from '../res/images/background3.jpg';

const Login = () => {
  const { auth, loginWithGoogle, clearInputs, isLoading, setIsLoading } = useContext(Context);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(undefined);

  const logInEmailOnSubmit = async event => {
    try {
      event.preventDefault();
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setIsLoading(false);
    } catch(error){
      setLoginError({ msg: error.message, code: error.code });
    }
  }

  useEffect(() => {
    if(loginError){
      alert(`Login Error: ${loginError.msg}, Error Code: ${loginError.code}`);
      clearInputs([setLoginEmail, setLoginPassword]);
      setLoginError(undefined);
    }
  }, [loginError])

  return <div className='Page login col w-full'>
    {
      isLoading ? 
      <Loading/> :
      <>
        <div className='Page__div--xl col' style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${background2})`}}>
          <div className='brewdog-logo'>
            <img src={brewdogLogo} alt='brewdog-logo'/>
          </div>
          <h1>Brewdog API</h1>
          <h2>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          </h2>
        </div>

        <div className='Page__div--2xl col w-full' style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${background1})`}}>
          <div className='Page__div--md col w-full'>
            <h1>Log In with your Google Account</h1>
            <h2>Or register a new account via Google!</h2>
            <button onClick={loginWithGoogle} className='row'>
              <h3>Log In</h3>
              <GoogleIcon/>
            </button>
          </div>

          <div className='Page__div--md col w-full'>
            <h1>Log In with your Email and Password</h1>
            <form className='col' onSubmit={e => logInEmailOnSubmit(e)} style={{height: '200px'}}>
              <Input
                inputType='text'
                inputPlaceholder='Type in your email address...'
                inputValue={loginEmail}
                inputSetState={setLoginEmail}
              />
              <Input
                inputType='password'
                inputPlaceholder='Type in your password...'
                inputValue={loginPassword}
                inputSetState={setLoginPassword}
              />
              <button type='submit' className='row'>
                <h3>Log In</h3>
                <LoginIcon/>
              </button>
            </form>
          </div>
        </div>

        <div className='Page__div--lg w-full cnt' style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${background3})`}}>
          <div className='Page__div--md col'>
            <h1>Register with Email and Password</h1>
            <h2>Create a new account with us using email and password logins!</h2>
            <Link to='/Register' className='link'>Register here</Link>
          </div>
        </div>
      </>
    }
  </div>
};

export default Login;