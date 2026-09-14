import hpDevText from './assets/hpDevTextNew.png'
import himmatPhoto from './assets/myBannerPhoto.png'
import myPhotoMobile from './assets/myPhotoMobileNewUpdated.png'
import seedBanner from './data/banner.json'
import { useContent } from './useContent'

function Banner() {
  const { profileText } = useContent('banner', seedBanner);
  return (
    <>
    <div className='mobileBanner'>
        <div className='hpGridHrCenter'>
            <img className='myPhoto' src={myPhotoMobile} title='My Photo' alt="My Photo" />
        </div>
        <div className='profileText'>
            {profileText.map((text, index) => (
                <p key={index}>
                    {text}
                </p>
            ))}
        </div>
    </div>
    <div className='desktopBanner hpgrid'>
        <div className='bannerLeftText'>
            <img className='hpDevText' src={hpDevText} title='My Text'  alt="My Text" />
            <div className='profileText'>
                {profileText.map((text, index) => (
                    <p key={index}>
                        {text}
                    </p>
                ))}
            </div>
        </div>
        <div className='bannerRightImage'>
            <img className='himmatPhoto' src={himmatPhoto} title='My Photo' alt="My Photo" />
        </div>
    </div>        
    </>
  )
}

export default Banner