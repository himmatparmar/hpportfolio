import React, { useState } from 'react';
import plus from './assets/plus.svg'
import cardData from './data/work.json'

function Work() {
    const [selectedCard, setSelectedCard] = useState(null);

    const handleCardClick = (item) => {
        setSelectedCard(item);
    };

    const closePopup = () => {
        setSelectedCard(null);
    };

  return (
    <>
        <div className="hpMainWrapper" id='workexp'>
            <div className="hpGridHrCenter">
                <h2 className="title">Work Experience</h2>
            </div>
            <div className="hpGridHrCenter experienceWrapper">
                {cardData.map((item) => (
                    <div className="expBoxes" key={item.id} onClick={() => handleCardClick(item)}>
                        <p className="expinnerTitle">{item.expCompany}</p>
                        <p className="expCompany">{item.expinnerTitle}</p>
                        <p className="expPostion">{item.expPostion}</p>
                        <img src={plus} alt="" className='plus'/>
                    </div>
                ))}

                {/* Popup */}
                {selectedCard && (
                    <div className="popup-overlay" onClick={closePopup}>
                        <div className="popup tv-on" onClick={(e) => e.stopPropagation()}>
                            <div className='popUpHeader'>
                                <button onClick={closePopup}>X</button>
                            </div>
                            <div className='popUpBodayContent'>
                                <h2>{selectedCard.expCompany}</h2>
                                <div className='popupSubtitle'>Projects: </div>
                                <p className='popupTextDetails'>
                                    <div dangerouslySetInnerHTML={{ __html: selectedCard.exProjects }} />
                                </p>
                                <div className='popupSubtitle'>Development: </div>
                                <p className='popupTextDetails'>
                                    <div dangerouslySetInnerHTML={{ __html: selectedCard.exDev }} />
                                </p>
                                <div className='popupSubtitle'>Responsibilities: </div>
                                <div dangerouslySetInnerHTML={{ __html: selectedCard.exRespo }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </>
  )
}

export default Work