import { Cuboid } from './Cuboid'

export function Cap() {
  return (
    <div className="showroom-emblem showroom-cap" aria-hidden="true">
      <div className="showroom-cap-tilt">
        <div className="showroom-emblem-spin">
          <span className="showroom-cap-board-shape" />
          <Cuboid width={170} height={10} depth={170} edge="#27ae72" fill="rgba(39,174,114,.22)" className="showroom-cap-board" />
          <Cuboid width={84} height={46} depth={84} edge="#1f9a62" fill="rgba(31,154,98,.18)" className="showroom-cap-base" />
          <Cuboid width={3} height={64} depth={3} edge="#e8a33a" fill="rgba(232,163,58,.9)" className="showroom-cap-cord" />
          <Cuboid width={11} height={20} depth={11} edge="#e8a33a" fill="rgba(232,163,58,.55)" className="showroom-cap-tassel" />
        </div>
      </div>
    </div>
  )
}
