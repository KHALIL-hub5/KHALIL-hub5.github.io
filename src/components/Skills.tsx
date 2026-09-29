import { content } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function Skills() {
  return (
    <section className="section-shell content-section skills-section" id="skills" aria-labelledby="skills-heading">
      <Reveal>
        <SectionHeading
          id="skills-heading"
          eyebrow={content.skillsSection.eyebrow}
          title={content.skillsSection.title}
          description={content.skillsSection.description}
        />
      </Reveal>
      <div className="skills-grid">
        {content.skills.map((group, index) => (
          <Reveal key={group.category} className="skill-card" >
            <span className="skill-index">0{index + 1}</span>
            <h3>{group.category}</h3>
            <div className="skill-tags">
              {group.items.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
          </Reveal>
        ))}
      </div>
      <div className="interest-strip">
        <span>{content.skillsSection.interestsLabel}</span>
        <div>{content.interests.map((interest) => <span key={interest}>{interest}</span>)}</div>
      </div>
    </section>
  )
}
