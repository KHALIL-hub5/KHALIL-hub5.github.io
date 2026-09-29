import { useEffect, useRef, type PointerEvent, type RefObject } from 'react'

export function useTilt(ref: RefObject<HTMLDivElement>, enabled: boolean) {
  const pointer = useRef({ x: 0, y: 0, movedAt: 0 })

  useEffect(() => {
    const stage = ref.current
    if (!stage) return
    let frame = 0
    let rotationX = 0
    let rotationY = 0

    if (!enabled) {
      stage.style.setProperty('--tilt-x', '0deg')
      stage.style.setProperty('--tilt-y', '0deg')
      return
    }

    const animate = (time: number) => {
      const idle = time - pointer.current.movedAt > 1800
      const targetX = idle ? Math.sin(time / 3600) * 1.2 : pointer.current.y * -7
      const targetY = idle ? Math.cos(time / 4100) * 2 : pointer.current.x * 12
      rotationX += (targetX - rotationX) * 0.075
      rotationY += (targetY - rotationY) * 0.075
      stage.style.setProperty('--tilt-x', `${rotationX.toFixed(2)}deg`)
      stage.style.setProperty('--tilt-y', `${rotationY.toFixed(2)}deg`)
      frame = window.requestAnimationFrame(animate)
    }

    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [enabled, ref])

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointer.current = {
      x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      y: ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
      movedAt: performance.now(),
    }
  }

  function onPointerLeave() {
    pointer.current.x = 0
    pointer.current.y = 0
    pointer.current.movedAt = 0
  }

  return { ref, onPointerMove, onPointerLeave }
}
