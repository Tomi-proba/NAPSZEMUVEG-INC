import { useMemo } from 'react'
import * as THREE from 'three'
import type { TempleStyle } from '../types'
import { buildTempleGeometry, getTempleTipTransform, templeRadiusAt } from '../geometry/temple'

interface HingeAnchor {
  position: THREE.Vector3
  angle: number
}

interface TempleMeshProps {
  style: TempleStyle
  material: THREE.Material
  anchor: HingeAnchor
  side: 'left' | 'right'
}

export default function TempleMesh({ style, material, anchor, side }: TempleMeshProps) {
  const geometry = useMemo(() => buildTempleGeometry(style), [style])
  const tip = useMemo(() => getTempleTipTransform(style), [style])
  const tipRadius = templeRadiusAt(style, 1)

  const mirror = side === 'left' ? -1 : 1

  return (
    <group position={anchor.position} rotation={[0, anchor.angle, 0]} scale={[mirror, 1, 1]}>
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
      {style.endType === 'ball' && (
        <mesh position={tip.point} material={material} castShadow>
          <sphereGeometry args={[tipRadius * 1.7, 16, 16]} />
        </mesh>
      )}
      {style.endType === 'looped' && (
        <mesh position={tip.point} rotation={[Math.PI / 2, 0, 0]} material={material} castShadow>
          <torusGeometry args={[tipRadius * 1.8, tipRadius * 0.55, 8, 20]} />
        </mesh>
      )}
    </group>
  )
}
