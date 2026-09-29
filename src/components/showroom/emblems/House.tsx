import { Cuboid } from './Cuboid'

export function House() {
  return (
    <div className="showroom-emblem showroom-house" aria-hidden="true">
      <div className="showroom-emblem-spin">
        <Cuboid width={150} height={100} depth={120} edge="#4d8577" fill="rgba(77,133,119,.16)" className="showroom-house-walls" />
        <span className="showroom-house-roof front" />
        <span className="showroom-house-roof back" />
        <span className="showroom-house-gable left" />
        <span className="showroom-house-gable right" />
      </div>
    </div>
  )
}
