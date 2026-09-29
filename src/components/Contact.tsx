import { ArrowUpRight, Github, Linkedin, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { content } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const inquiryTypes = ['Project inquiry', 'Internship opportunity', 'Collaboration', 'Other']

export function Contact() {
  const [status, setStatus] = useState('')
  const [draftHref, setDraftHref] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const inquiry = String(formData.get('inquiry') ?? inquiryTypes[0])
    const message = String(formData.get('message') ?? '').trim()
    const subject = `${inquiry} — ${name}`
    const body = `Name: ${name}\nEmail: ${email}\nInquiry: ${inquiry}\n\n${message}`
    const mailto = `${content.contact.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    setDraftHref(mailto)
    setStatus(`Opening an email draft to ${content.contact.email}. Your message has not been sent yet.`)
    window.location.assign(mailto)
  }

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
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="form-field">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" name="name" autoComplete="name" maxLength={100} required />
              </div>
              <div className="form-field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="contact-inquiry">I’m reaching out about</label>
              <select id="contact-inquiry" name="inquiry" defaultValue={inquiryTypes[0]}>
                {inquiryTypes.map((inquiry) => <option key={inquiry}>{inquiry}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows={5} maxLength={5000} required />
            </div>
            <button className="button button-primary contact-submit" type="submit">
              <Send size={16} /> {content.contactSection.action} <ArrowUpRight size={16} />
            </button>
            <p className="form-status" role="status" aria-live="polite">
              {status}
              {draftHref && <> <a href={draftHref}>Open the email draft</a></>}
            </p>
          </form>
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
