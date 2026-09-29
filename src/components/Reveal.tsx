import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  role?: HTMLAttributes<HTMLDivElement>['role']
}

export function Reveal({ children, className = '', role }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [animationEnabled, setAnimationEnabled] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }

    setAnimationEnabled(true)
    let fallback = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          window.clearTimeout(fallback)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px 180px 0px', threshold: 0.01 },
    )
    observer.observe(element)
    fallback = window.setTimeout(() => {
      setVisible(true)
      observer.disconnect()
    }, 2500)

    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={elementRef}
      role={role}
      className={`reveal ${animationEnabled ? 'reveal-ready' : ''} ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
