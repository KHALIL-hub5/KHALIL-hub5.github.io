import { useEffect, useState } from 'react'
import { projects } from '../../data/projects'
import './showroom.css'
import { ProjectInfo } from './ProjectInfo'
import { ProjectTabs } from './ProjectTabs'
import { ScreenPickers } from './ScreenPickers'
import { Stage } from './Stage'
import { useInView } from './useInView'
import { useTilt } from './useTilt'

interface ShowroomProps {
  onProjectChange: (id: (typeof projects)[number]['id']) => void
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useSmallScreen() {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setIsSmallScreen(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return isSmallScreen
}

export function Showroom({ onProjectChange }: ShowroomProps) {
  const [activeId, setActiveId] = useState(projects[0].id)
  const [selectedWeb, setSelectedWeb] = useState<Record<string, number>>({})
  const [selectedMobile, setSelectedMobile] = useState<Record<string, number>>({})
  const [mobileView, setMobileView] = useState<'web' | 'mobile'>('mobile')
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)
  const [paused, setPaused] = useState(prefersReducedMotion)
  const isSmallScreen = useSmallScreen()
  const { ref: stageRef, isInView } = useInView<HTMLDivElement>()
  const tilt = useTilt(stageRef, isInView && !paused && !reducedMotion && !isSmallScreen)
  const project = projects.find((item) => item.id === activeId) ?? projects[0]
  const webIndex = selectedWeb[project.id] ?? 0
  const mobileIndex = selectedMobile[project.id] ?? 0

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches)
      if (event.matches) setPaused(true)
    }
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  function selectProject(nextProject: (typeof projects)[number]) {
    setActiveId(nextProject.id)
    onProjectChange(nextProject.id)
  }

  function selectWeb(index: number) {
    setSelectedWeb((current) => ({ ...current, [project.id]: index }))
  }

  function selectMobile(index: number) {
    setSelectedMobile((current) => ({ ...current, [project.id]: index }))
  }

  return (
    <div
      className={`showroom ${isInView && !paused && !reducedMotion ? 'is-running' : ''} ${paused || reducedMotion ? 'is-paused' : ''}`}
      data-project={project.id}
      data-mobile-view={mobileView}
    >
      <header className="showroom-heading">
        <h3>Three projects, three worlds</h3>
        <p>
          Each project keeps its own identity, colors and interface. Choose a project, browse its web and mobile
          screens, or bring a side phone forward. KHdamli&apos;s web view is a concept; the other previews use the
          original screens.
        </p>
      </header>
      <ProjectTabs activeProject={project} onSelect={selectProject} />
      <div
        className="showroom-project-panel"
        id="showroom-project-panel"
        role="tabpanel"
        aria-labelledby={`showroom-tab-${project.id}`}
        tabIndex={0}
      >
        <Stage
          project={project}
          webIndex={webIndex}
          mobileIndex={mobileIndex}
          onMobileSelect={selectMobile}
          mobileView={mobileView}
          stageRef={stageRef}
          onPointerMove={tilt.onPointerMove}
          onPointerLeave={tilt.onPointerLeave}
          animate={isInView && !paused && !reducedMotion}
        />
        <ScreenPickers
          project={project}
          webIndex={webIndex}
          mobileIndex={mobileIndex}
          mobileView={mobileView}
          onWebSelect={selectWeb}
          onMobileSelect={selectMobile}
          onMobileViewChange={setMobileView}
          paused={paused}
          reducedMotion={reducedMotion}
          onToggleMotion={() => setPaused((current) => !current)}
        />
        <ProjectInfo project={project} />
      </div>
    </div>
  )
}
