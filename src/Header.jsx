import hpLogo from './assets/hpLogo.png'

function Header() {
  return (
    <>
        <div className="hpGridSpread headerWrapper" id='home'>
          <div>
            <img className='myPhoto myLogo' title='My Logo' src={hpLogo} alt="My Logo" />
          </div>
          <div className='hpGrid socialIcons'>
            <a href="https://www.instagram.com/hpphotography_785/" target="_blank"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://in.linkedin.com/in/himmatlal-parmar-84647764" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
          </div>
        </div>
    </>
  )
}

export default Header