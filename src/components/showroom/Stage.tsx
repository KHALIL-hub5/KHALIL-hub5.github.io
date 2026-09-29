import { useEffect, useState, type CSSProperties, type PointerEventHandler, type RefObject } from 'react'
import type { Project } from '../../data/projects'
import { Scene } from './Scene'

interface StageProps {
  project: Project
  webIndex: number
  mobileIndex: number
  onMobileSelect: (index: number) => void
  mobileView: 'web' | 'mobile'
  stageRef: RefObject<HTMLDivElement>
  onPointerMove: PointerEventHandler<HTMLDivElement>
  onPointerLeave: PointerEventHandler<HTMLDivElement>
  animate: boolean
}

export function Stage({
  project,
  webIndex,
  mobileIndex,
  onMobileSelect,
  mobileView,
  stageRef,
  onPointerMove,
  onPointerLeave,
  animate,
}: StageProps) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const element = stageRef.current
    if (!element) return

    const updateScale = () => {
      const { width, height } = element.getBoundingClientRect()
      setScale(Math.min(1, Math.max(0.1, (width - 24) / 1080), Math.max(0.1, (height - 24) / 590)))
    }
    updateScale()

    const observer = new ResizeObserver(updateScale)
    observer.observe(element)
    return () => observer.disconnect()
  }, [stageRef])

  return (
    <div
      id="showroom-stage"
      className="showroom-stage"
      data-project={project.id}
      data-mobile-view={mobileView}
      style={{ '--project-edge': project.edge } as CSSProperties}
      ref={stageRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-hidden="true"
    >
      <div className="showroom-stage-grid" />
      <div className="showroom-desktop-composition">
        <div
          className="showroom-fit"
          style={{ '--stage-scale': scale } as CSSProperties}
        >
          <div className="showroom-world">
            <Scene
              project={project}
              webIndex={webIndex}
              mobileIndex={mobileIndex}
              onMobileSelect={onMobileSelect}
              animate={animate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
