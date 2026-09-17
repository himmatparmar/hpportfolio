import { useState } from 'react'
import seedGettouch from './data/gettouch.json'
import { useContent } from './useContent'
import ContactModal from './ContactModal'

function Gettouch() {
  const { profileText, email } = useContent('gettouch', seedGettouch);
  const [modalOpen, setModalOpen] = useState(false);

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
              <button type='button' className='sayHello' onClick={() => setModalOpen(true)}>Say Hello</button>
          </div>
        </div>
        <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

export default Gettouch