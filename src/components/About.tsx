import { ArrowUpRight, GraduationCap, Languages, MapPin } from 'lucide-react'
import { content } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function About() {
  return (
    <section className="section-shell content-section" id="about" aria-labelledby="about-heading">
      <div className="about-grid">
        <Reveal>
          <SectionHeading id="about-heading" eyebrow={content.aboutSection.eyebrow} title={content.aboutSection.title} />
        </Reveal>
        <Reveal className="about-detail">
          {content.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="about-facts">
            <div className="fact-item">
              <GraduationCap size={19} />
              <div><span>{content.aboutSection.facts[0]}</span><strong>{content.education}</strong></div>
            </div>
            <div className="fact-item">
              <MapPin size={19} />
              <div><span>{content.aboutSection.facts[1]}</span><strong>{content.location}</strong></div>
            </div>
            <div className="fact-item">
              <Languages size={19} />
              <div><span>{content.aboutSection.facts[2]}</span><strong>{content.languages.join(' · ')}</strong></div>
            </div>
          </div>
          <a className="text-link" href="#contact">{content.aboutSection.collaborationLink} <ArrowUpRight size={16} /></a>
        </Reveal>
      </div>
    </section>
  )
}
