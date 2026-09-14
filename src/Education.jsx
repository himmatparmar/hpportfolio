import cardData from './data/education.json'

function education() {
  return (
    <>
        <div className="hpMainWrapper" id="education">
            <div className="hpGridHrCenter">
                <h2 className="title">Education & Specialization</h2>
            </div>
            <div className="hpGrid experienceWrapper educationWrapper">
                {cardData.map((item) => (
                    <div className="expBoxes" key={item.id}>
                        <p className="expinnerTitle">{item.expinnerTitle}</p>
                        <p className="expPostion">{item.expPostion}</p>
                    </div>
                ))}
            </div>
        </div>
    </>
  )
}

export default education
