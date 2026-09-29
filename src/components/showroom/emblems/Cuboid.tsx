import type { CSSProperties } from 'react'

interface CuboidProps {
  width: number
  height: number
  depth: number
  edge: string
  fill: string
  className?: string
}

export function Cuboid({ width, height, depth, edge, fill, className = '' }: CuboidProps) {
  const faces = [
    { width, height, left: 0, top: 0, transform: `translateZ(${depth / 2}px)` },
    { width, height, left: 0, top: 0, transform: `rotateY(180deg) translateZ(${depth / 2}px)` },
    { width: depth, height, left: (width - depth) / 2, top: 0, transform: `rotateY(90deg) translateZ(${width / 2}px)` },
    { width: depth, height, left: (width - depth) / 2, top: 0, transform: `rotateY(-90deg) translateZ(${width / 2}px)` },
    { width, height: depth, left: 0, top: (height - depth) / 2, transform: `rotateX(90deg) translateZ(${height / 2}px)` },
    { width, height: depth, left: 0, top: (height - depth) / 2, transform: `rotateX(-90deg) translateZ(${height / 2}px)` },
  ]

  return (
    <span
      className={`showroom-cuboid ${className}`}
      style={{ width, height, '--cuboid-edge': edge, '--cuboid-fill': fill } as CSSProperties}
      aria-hidden="true"
    >
      {faces.map((face, index) => (
        <i
          key={index}
          style={{
            width: face.width,
            height: face.height,
            left: face.left,
            top: face.top,
            transform: face.transform,
          }}
        />
      ))}
    </span>
  )
}
