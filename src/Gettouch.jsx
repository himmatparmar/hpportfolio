import seedGettouch from './data/gettouch.json'
import { useContent } from './useContent'

function Gettouch() {
  const { profileText, email } = useContent('gettouch', seedGettouch);

  return (
    <>
        <div className="hpMainWrapper" id="contact">
            <div className="hpGridHrCenter">
                <h2 className="title getTouchtitle">Get In Touch</h2>
            </div>
            <div className='profileText'>
              {profileText.map((text, index) => (
                <p key={index}>
                    {text}
                </p>
              ))}
              <p>
                <a className='email' href={`mailto:${email}`}>{email}</a>
              </p>
          </div>
          <div className='hpGridCompCenter sayHelloWrapper'>
              <a className='sayHello' href={`mailto:${email}`}>Say Hello</a>
          </div>
        </div>
    </>
  )
}

export default Gettouch