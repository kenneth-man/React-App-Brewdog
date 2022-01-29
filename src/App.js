import React, { useState } from 'react';
import ContextProvider from './Context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import All from './pages/All';
import Checkout from './pages/Checkout';
import Random from './pages/Random';
import Search from './pages/Search';
import ResultPage from './pages/ResultPage';
import ShoppingCart from './pages/ShoppingCart';
import NavBar from './components/NavBar';
import './App.css';
//firebase sdk; 
//1) create project on firebase.com, add the sign in methods you require
//2) enable firestore api and create firstore database on google cloud platform
//3) update database rules (permissions) https://stackoverflow.com/questions/46590155/firestore-permission-denied-missing-or-insufficient-permissions
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyB9aNVuHYHZ1_riRA-VlcE93HhoTVrLzD4",
  authDomain: "brewdog-54d17.firebaseapp.com",
  projectId: "brewdog-54d17",
  storageBucket: "brewdog-54d17.appspot.com",
  messagingSenderId: "709688381018",
  appId: "1:709688381018:web:9df49abf3384f771235263"
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

function App() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  //onAuthStateChanged parses a 'user' object in the callback function if signed in, otherwise 'user' is null; 'auth.currentUser' is same as 'user'
  onAuthStateChanged(auth, user => user ? setIsUserSignedIn(true) : setIsUserSignedIn(false));

  return (
    <div className="App">
      <ContextProvider auth={auth} db={db}>
        <BrowserRouter>
          {isUserSignedIn ? <NavBar/> : null}

          <Routes>
            <Route path='/' exact element={isUserSignedIn ? <Home/> : <Login/>}/>
            <Route path='/Register' exact element={<Register/>}/>
            <Route path='/All' exact element={<All/>}/>
            <Route path='/Checkout' exact element={<Checkout/>}/>
            <Route path='/Random' exact element={<Random/>}/>
            <Route path='/Search' exact element={<Search/>}/>
            <Route path='/ShoppingCart' exact element={<ShoppingCart/>}/>
            <Route path='/ResultPage/:item' exact element={<ResultPage/>}/>
          </Routes>
        </BrowserRouter>
      </ContextProvider>
    </div>
  );
}

export default App;