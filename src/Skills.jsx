import seedSkills from './data/skills.json'
import { useContent } from './useContent'

function Skills() {
  const { skills, softwares, certificates, events } = useContent('skills', seedSkills);
  return (
    <>
      <div className="hpMainWrapper skillMainWrapper">
        <div className="hpGridHrCenter" id="skills">
          <h2 className="title">Skill Sets</h2>
        </div>

        <div className="hpGridCompCenter skillsWrapper">
            {skills.map(item => (
            <div key={item.id}>
                <img className="skillImage" title={item.name} src={item.image} alt={item.name} />
            </div>
            ))}
        </div>

        <div className="hpGridHrCenter" id="softwares">
          <h2 className="title">Softwares</h2>
        </div>
        <div className="hpGridCompCenter skillsWrapper">
            {softwares.map(item => (
                <div key={item.id}>
                    <img className="skillImage" title={item.name} src={item.image} alt={item.name} />
                </div>
            ))}
        </div>

        <div>
          <div className="hpGridHrCenter" id="certificates">
            <h2 className="title">Certificates</h2>
          </div>
          {Array.from({ length: Math.ceil(certificates.length / 2) }).map((_, rowIndex) => (
            <div className="hpGridHrCenter hpGridMobileHrCenter" key={rowIndex}>
              {certificates.slice(rowIndex * 2, rowIndex * 2 + 2).map(item => (
                <img className="certificate" key={item.id} src={item.image} alt={item.name} title={item.name} />
              ))}
            </div>
          ))}
        </div>

        <div>
          <div className="hpGridHrCenter" id="events">
            <h2 className="title">Events</h2>
          </div>
          {events.map(item => (
            <img className="events" key={item.id} src={item.image} alt={item.name} title={item.name} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Skills;
