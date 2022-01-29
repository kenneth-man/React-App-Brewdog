import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../Context';
import { Link, NavLink } from 'react-router-dom';
import logoWhite from '../res/images/logoWhite.png'

const Navbar = () => {
  const { navbarName } = useContext(Context);
  const [greeting, setGreeting] = useState('LOADING...')

  useEffect(() => {
    const date = new Date();
    const hourOfDay = Number( date.toLocaleString('en-GB', { timeZone: 'UTC' }).slice(-8, -6).replace('0', '') );

    hourOfDay <= 12 ?
    setGreeting('Good Morning') :
    (
      hourOfDay <= 18 ?
      setGreeting('Good Afternoon') :
      setGreeting('Good Evening')
    ) 
  }, [])

  return <div className='navbar w-full row'>
    <Link to='/'>
      <img src={logoWhite} alt='logo-White'/>
    </Link>

    <h1>{greeting}, {navbarName}!</h1>

    <div className='navbar__cont row'>
      <div className='navbar__wrapper cnt h-full'>
        <NavLink to='/All' className={({ isActive }) => isActive ? 'navLink navLink--active row' : 'navLink row'}>All</NavLink>
      </div>
      <div className='navbar__wrapper cnt h-full'>
        <NavLink to='/Random' className={({ isActive }) => isActive ? 'navLink navLink--active row' : 'navLink row'}>Random</NavLink>
      </div>
      <div className='navbar__wrapper cnt h-full'>
        <NavLink to='/Search' className={({ isActive }) => isActive ? 'navLink navLink--active row' : 'navLink row'}>Search</NavLink>
      </div>
      <div className='navbar__wrapper cnt h-full'>
        <NavLink to='/ShoppingCart' className={({ isActive }) => isActive ? 'navLink navLink--active row' : 'navLink row'}>Shopping Cart</NavLink>
      </div>
    </div>
  </div>
};

export default Navbar;