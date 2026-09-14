import React, { useEffect, useState } from 'react';
import './App.css'
import Header from './Header'
import Banner from './Banner'
import Work from './Work'
import Education from './Education'
import Skills from './Skills'
import Gettouch from './Gettouch'
import Insta from './Insta';
import Footer from './Footer';
import logo from './assets/loaderImage.png';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';

function App() {
  const [loading, setLoading] = useState(true);
  const [tvClose, setTvClose] = useState(false);
  const [progress, setProgress] = useState(1);
  
  

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 1;
        clearInterval(progressInterval);
        setTvClose(true); // trigger TV animation
        setTimeout(() => setLoading(false), 1000); // wait for animation
        return 100;
      });
    }, 30); // 30ms per percent = ~3s total

    return () => clearInterval(progressInterval);
    
  }, []);

  useEffect(() => {
        const handleContextmenu = e => {
            e.preventDefault()
        }
        document.addEventListener('contextmenu', handleContextmenu)
        return function cleanup() {
            document.removeEventListener('contextmenu', handleContextmenu)
        }
  }, [ ]);



  return (
    <>
      {loading ? (
        <div className={`loader-screen ${tvClose ? 'tv-close' : ''}`}>
        <img src={logo} alt="Loader" className='loaderImg'/>
          <div className="moving-line-container">
            <div className="moving-line"></div>
          </div>
          <div className="loader-timer">{progress}%</div>
        </div>
      ) : (
        <div className="main-content"></div>
      )}
      <MobileMenu/>
      <Navbar/>
      <Header/>
      <Banner/>
      <Work/>
      <Education/>
      <Skills/>
      <Insta />
      <Gettouch/>
      <Footer/>
    </>
  )
}

export default App
