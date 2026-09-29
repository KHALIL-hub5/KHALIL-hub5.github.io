import { ArrowUpRight, ArrowUp } from 'lucide-react'
import { content } from '../data/content'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-inner">
        <a className="brand footer-brand" href="#home">{content.monogram}<span>.</span></a>
        <p>{content.footer.attribution} {content.name}<span className="accent-dot">.</span></p>
        <div className="footer-actions">
          <a href={content.contact.github} target="_blank" rel="noreferrer">{content.footer.githubLabel} <ArrowUpRight size={14} /></a>
          <a href="#home" aria-label={content.footer.backToTop}>{content.footer.backToTop} <ArrowUp size={14} /></a>
        </div>
      </div>
    </footer>
  )
}
