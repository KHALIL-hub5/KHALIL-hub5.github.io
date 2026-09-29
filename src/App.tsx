import { useEffect, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'

function App() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('portfolio-theme')
    const light = savedTheme === 'light'
    setIsLight(light)
    document.documentElement.classList.toggle('light', light)
  }, [])

  function toggleTheme() {
    setIsLight((current) => {
      const next = !current
      document.documentElement.classList.toggle('light', next)
      window.localStorage.setItem('portfolio-theme', next ? 'light' : 'dark')
      return next
    })
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header isLight={isLight} onThemeToggle={toggleTheme} />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
