import React, { useContext, useEffect } from 'react';
import { Context } from '../Context';
import backgroundImage1 from '../res/images/background1.jpg';
import backgroundImage3 from '../res/images/background3.jpg';
import flashImage from '../res/images/brewdogGif.gif';
import { homeShowcase, homeBrewing } from '../data/homeData';
 
const Home = () => {
  const { scrollToTop } = useContext(Context);

  useEffect(() => scrollToTop(), [])
  
  return <div className='Page home col w-full'>
    <div className='Page__div--2xl row' style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),url(${backgroundImage1})`}}>
      <div className='home__img'>
        <img src={flashImage} alt='flash-img'/>
      </div>

      <div className='home__wrapper col'>
        <h1>MAKE EARTH GREAT AGAIN</h1>
        <h2>In 2020, BrewDog became the world’s first carbon negative brewery. It’s all part of our mission to become the most sustainable drinks brand on the planet. Now is the time to be radical in everything we do.</h2>
        <h2>We’re on a mission to brew, discover and shout about great craft beer. But it's not just about making amazing tasting liquid, we're also here to show that business can be a force for good, with BrewDog committed to being the best employer we possibly can.</h2>
        <a className='link' href='www.google.com'>Learn more</a>
      </div>
    </div>
    <div className='Page__div--2xl home__showcase col w-full'>
      <div className='home__showcase--headings col'>
        <h1>Explore more of what Brewdog provides...</h1>
        <h2>Raise a glass to the end of January with up to 25% off our greatest hits!</h2>
      </div>
      <div className='home__showcase--items row w-full'>
        {
          homeShowcase.map((curr, index) => 
            <div key={index} className='home__col col h-full'>
              <img src={curr.img} alt={`home-img-${index}`} className='w-full'/>
              <h1>{curr.title}</h1>
              <button>{curr.buttonText}</button>
            </div>
          )
        }
      </div>
    </div>
    <div className='Page__div--4xl w-full col' style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.9)),url(${backgroundImage3})`}}>
      <div className='col'>
        <h1>How we brew</h1>
        <h2>Just Barley, Hops, Yeast, Water and Mind-blowing flavour.</h2>
      </div>
      <div className='home__grid w-full'>
        {
          homeBrewing.map((curr, index) =>
            <div key={index} className='col'>
              <img src={curr.img} alt={`home-grid-img-${index}`}/>
              <h1>{curr.title}</h1>
              <h3>{curr.text}</h3>
            </div>
          )
        }
      </div>
    </div>
  </div>
};

export default Home;