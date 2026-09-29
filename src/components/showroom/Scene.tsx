import type { Project } from '../../data/projects'
import { Cap } from './emblems/Cap'
import { Crescent } from './emblems/Crescent'
import { House } from './emblems/House'
import { Labels } from './Labels'
import { PhoneCoverflow } from './PhoneCoverflow'
import { WebDeck } from './WebDeck'

interface SceneProps {
  project: Project
  webIndex: number
  mobileIndex: number
  onMobileSelect: (index: number) => void
  animate: boolean
}

export function Scene({ project, webIndex, mobileIndex, onMobileSelect, animate }: SceneProps) {
  const Emblem = project.emblem === 'house' ? House : project.emblem === 'crescent' ? Crescent : Cap

  return (
    <div className={`showroom-scene ${animate ? 'is-entering' : ''}`} key={project.id}>
      <div className="showroom-emblem-position" data-emblem={project.emblem}><Emblem /></div>
      <WebDeck project={project} selectedIndex={webIndex} />
      <PhoneCoverflow project={project} selectedIndex={mobileIndex} onSelect={onMobileSelect} />
      <Labels project={project} />
    </div>
  )
}
