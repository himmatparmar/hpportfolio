import gettouchData from './data/gettouch.json'

const { profileText, email } = gettouchData;

function Gettouch() {

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