import { Cuboid } from './Cuboid'

export function Cap() {
  return (
    <div className="showroom-emblem showroom-cap" aria-hidden="true">
      <div className="showroom-building">
        <div className="showroom-emblem-spin">
          <Cuboid width={150} height={100} depth={120} edge="#27ae72" fill="rgba(39,174,114,.10)" className="showroom-building-walls" />
          <Cuboid width={162} height={8} depth={132} edge="#5bd69a" fill="rgba(91,214,154,.24)" className="showroom-building-roof" />
          <span className="showroom-building-sign"><span>SHOP</span><small>UNIVERSITAIRE</small></span>
          <Cuboid width={3} height={95} depth={3} edge="#e8a33a" fill="rgba(232,163,58,.92)" className="showroom-building-pole" />
        </div>
      </div>
    </div>
  )
}
