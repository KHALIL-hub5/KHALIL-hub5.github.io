import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { content } from '../data/content'

interface HeaderProps {
  isLight: boolean
  onThemeToggle: () => void
}

export function Header({ isLight, onThemeToggle }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const updateActiveSection = () => {
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      const marker = window.scrollY + headerHeight + 96
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        setActiveSection(content.navigation[content.navigation.length - 1]?.href ?? '')
        return
      }
      const activeItems = content.navigation
        .map((item) => ({
          item,
          section: document.getElementById(item.href.slice(1)),
        }))
        .filter(({ section }) =>
          section && section.getBoundingClientRect().top + window.scrollY <= marker,
        )

      setActiveSection(activeItems[activeItems.length - 1]?.item.href ?? '')
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#home" aria-label={`${content.name} home`}>
          {content.monogram}<span>.</span>
        </a>
        <nav className={`primary-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          {content.navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeSection === item.href ? 'active' : undefined}
              aria-current={activeSection === item.href ? 'location' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button
            className="theme-toggle mobile-theme-toggle"
            type="button"
            onClick={onThemeToggle}
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
          >
            {isLight ? <Moon size={17} /> : <Sun size={17} />}
            <span>{isLight ? 'Dark mode' : 'Light mode'}</span>
          </button>
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle desktop-theme-toggle"
            type="button"
            onClick={onThemeToggle}
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <a className="header-cta" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  )
}
