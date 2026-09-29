import type { CSSProperties } from 'react'

const layers = Array.from({ length: 19 }, (_, index) => index - 9)

export function Crescent() {
  return (
    <div className="showroom-emblem showroom-crescent" aria-hidden="true">
      <div className="showroom-emblem-spin">
        <div className="showroom-crescent-layers">
          {layers.map((layer) => {
            const edge = Math.abs(layer) === 9
            const color = edge ? '#ff3b2f' : Math.abs(layer) > 6 ? '#d9261c' : '#a81a13'
            return (
              <span
                key={layer}
                style={{ '--crescent-color': color, transform: `translateZ(${layer * 3}px)` } as CSSProperties}
              />
            )
          })}
        </div>
      </div>
      <svg className="showroom-heartbeat" width="420" height="100" viewBox="0 0 420 100">
        <path d="M0 50 L70 50 L92 50 L108 16 L126 84 L144 30 L160 50 L250 50 L272 50 L288 12 L308 88 L326 34 L342 50 L420 50" />
      </svg>
    </div>
  )
}
