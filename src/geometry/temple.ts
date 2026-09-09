import * as THREE from 'three'
import type { TempleStyle } from '../types'
import { buildTaperedTubeGeometry } from './tube'

export const TEMPLE_LENGTH = 118 // mm, arc length from hinge to tip

function smoothstep(t: number) {
  const c = THREE.MathUtils.clamp(t, 0, 1)
  return c * c * (3 - 2 * c)
}

export interface TempleSample {
  x: number // lateral bend toward the head, >=0
  y: number // vertical drop, >=0 (down, toward the ear)
}

/** Shared shape function used by both the 3D geometry and the 2D SVG preview icon. */
export function sampleTemple(style: TempleStyle, u: number): TempleSample {
  const lateralMax = 7
  const dropMax = 13
  const x = lateralMax * smoothstep(u) * (0.3 + 0.7 * style.curvature)
  const easeCubic = u * u * u
  const y = dropMax * easeCubic * (0.25 + 0.75 * style.curvature)
  return { x, y }
}

export function templeRadiusAt(style: TempleStyle, u: number): number {
  const base = style.thickness
  if (!style.taper) return base
  const tipFactor = 0.55
  return base * (1 - (1 - tipFactor) * smoothstep(u))
}

/**
 * Curve for one temple arm in local hinge space: hinge at the origin, the arm
 * runs toward -z (backward) while bending toward -x (inward, toward the head)
 * and -y (down, toward the ear) near the tip.
 */
export function buildTempleCurve(style: TempleStyle): THREE.CatmullRomCurve3 {
  const samples = 24
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= samples; i++) {
    const u = i / samples
    const { x, y } = sampleTemple(style, u)
    points.push(new THREE.Vector3(-x, -y, -u * TEMPLE_LENGTH))
  }
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.2)
}

export function buildTempleGeometry(style: TempleStyle): THREE.BufferGeometry {
  const curve = buildTempleCurve(style)
  return buildTaperedTubeGeometry({
    curve,
    segments: 32,
    radialSegments: 10,
    radiusAt: (t) => templeRadiusAt(style, t),
  })
}

/** World-space transform info for attaching a decorative tip ornament. */
export function getTempleTipTransform(style: TempleStyle) {
  const curve = buildTempleCurve(style)
  const point = curve.getPointAt(1)
  const tangent = curve.getTangentAt(1)
  return { point, tangent }
}
