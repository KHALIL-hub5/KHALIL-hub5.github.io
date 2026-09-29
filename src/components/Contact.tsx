import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import { content } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function Contact() {
  return (
    <section className="section-shell content-section contact-section" id="contact" aria-labelledby="contact-heading">
      <Reveal className="contact-panel">
        <div className="contact-copy">
          <SectionHeading
            id="contact-heading"
            eyebrow={content.contactSection.eyebrow}
            title={content.contactSection.title}
            description={content.contactSection.description}
          />
          <a className="button button-primary contact-button" href={content.contact.emailHref}>
            <Mail size={17} /> {content.contactSection.action} <ArrowUpRight size={16} />
          </a>
          <p className="contact-email">{content.contactSection.emailLabel} <a href={content.contact.emailHref}>{content.contact.email}</a></p>
        </div>
        <div className="social-links" aria-label="Social profiles">
          <a href={content.contact.github} target="_blank" rel="noreferrer">
            <Github size={19} /><span>{content.contactSection.githubLabel}</span><ArrowUpRight size={15} />
          </a>
          {content.contact.linkedin.url ? (
            <a href={content.contact.linkedin.url} target="_blank" rel="noreferrer">
              <Linkedin size={19} /><span>{content.contactSection.linkedinLabel}</span><ArrowUpRight size={15} />
            </a>
          ) : (
            <span className="social-placeholder">
              <Linkedin size={19} />
              <span>{content.contactSection.linkedinLabel} · {content.contactSection.profileComingSoon}</span>
            </span>
          )}
          {content.contact.upwork.url ? (
            <a href={content.contact.upwork.url} target="_blank" rel="noreferrer">
              <ArrowUpRight size={19} /><span>{content.contactSection.upworkLabel}</span><ArrowUpRight size={15} />
            </a>
          ) : (
            <span className="social-placeholder">
              <ArrowUpRight size={19} />
              <span>{content.contactSection.upworkLabel} · {content.contactSection.profileComingSoon}</span>
            </span>
          )}
        </div>
        <span className="contact-watermark" aria-hidden="true">KD.</span>
      </Reveal>
    </section>
  )
}
