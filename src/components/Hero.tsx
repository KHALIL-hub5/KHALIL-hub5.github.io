import { ArrowDown, ArrowUpRight, Download, Github, MapPin } from 'lucide-react'
import { content } from '../data/content'
import { Reveal } from './Reveal'

export function Hero() {
  return (
    <section className="hero section-shell" id="home" aria-labelledby="hero-title">
      <div className="hero-grid">
        <Reveal className="hero-copy">
          <div className="availability">
            <span className="availability-dot" />
            {content.availability}
          </div>
          <p className="hero-overline">{content.heroCopy.greeting}</p>
          <h1 id="hero-title">
            {content.name.split(' ')[0]}
            <span className="hero-lastname"> {content.name.split(' ').slice(1).join(' ')}<span className="accent-dot">.</span></span>
          </h1>
          <p className="hero-role">{content.title}</p>
          <p className="hero-intro">{content.tagline}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">
              {content.heroCopy.projectAction} <ArrowDown size={16} />
            </a>
            <a className="button button-secondary" href="/Khalil_CV.pdf" download>
              {content.heroCopy.cvAction} <Download size={16} />
            </a>
          </div>
          <div className="hero-location">
            <MapPin size={15} aria-hidden="true" />
            <span>{content.location}</span>
            <span className="location-divider" aria-hidden="true" />
            <span>{content.graduation}</span>
          </div>
        </Reveal>

        <Reveal className="hero-art">
          <div className="portrait-frame">
            <div className="portrait-backdrop" />
            <img
              className="hero-portrait"
              src={content.heroImage.src}
              alt={content.heroImage.alt}
              loading="eager"
              decoding="async"
            />
            <div className="portrait-caption">
              <div>
                <span>{content.heroImage.caption}</span>
                <strong>{content.location}</strong>
              </div>
              <a
                className="portrait-github"
                href={content.contact.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${content.name}'s GitHub profile`}
              >
                <Github size={18} />
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
          <div className="hero-coordinate" aria-hidden="true">36°45′N&nbsp; 3°03′E</div>
        </Reveal>
      </div>
      <div className="hero-bottomline">
        <span>{content.heroCopy.locationLabel}</span>
        <span className="bottomline-rule" />
        <span>{content.heroCopy.sectionMarker}</span>
      </div>
    </section>
  )
}
