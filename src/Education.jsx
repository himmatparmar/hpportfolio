import seedEducation from './data/education.json'
import { useContent } from './useContent'

function Education() {
  const cardData = useContent('education', seedEducation);
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

export default Education
