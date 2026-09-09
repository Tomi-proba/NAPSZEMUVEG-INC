import * as THREE from 'three'

const MAX_ANGLE_AT_FULL_CURVE = 0.55 // radians, how far the edge sweeps back at frontCurve = 1

function angleFor(curveAmount: number) {
  return curveAmount * MAX_ANGLE_AT_FULL_CURVE
}

/**
 * Wraps flat front geometry around a cylinder of the appropriate radius so the
 * frame front bends back around the face. halfWidth is the outer half-width of
 * the whole front (used consistently so all pieces bend onto the same cylinder).
 */
export function applyFrontCurve(
  geometry: THREE.BufferGeometry,
  halfWidth: number,
  curveAmount: number,
) {
  const maxAngle = angleFor(curveAmount)
  if (maxAngle < 1e-4) return

  const radius = halfWidth / Math.sin(maxAngle)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const angle = THREE.MathUtils.clamp(x / radius, -Math.PI / 2, Math.PI / 2)
    const newX = radius * Math.sin(angle)
    const zOffset = -radius * (1 - Math.cos(angle))
    pos.setX(i, newX)
    pos.setZ(i, z + zOffset)
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
}

/** Analytic equivalent of applyFrontCurve for a single point (e.g. a hinge anchor). */
export function bendPoint(
  x: number,
  z: number,
  halfWidth: number,
  curveAmount: number,
): { x: number; z: number } {
  const maxAngle = angleFor(curveAmount)
  if (maxAngle < 1e-4) return { x, z }

  const radius = halfWidth / Math.sin(maxAngle)
  const angle = THREE.MathUtils.clamp(x / radius, -Math.PI / 2, Math.PI / 2)
  const newX = radius * Math.sin(angle)
  const zOffset = -radius * (1 - Math.cos(angle))
  return { x: newX, z: z + zOffset }
}

/** The outward-facing normal direction (in XZ) at a given x, for orienting hinge blocks. */
export function bendNormalAngle(x: number, halfWidth: number, curveAmount: number): number {
  const maxAngle = angleFor(curveAmount)
  if (maxAngle < 1e-4) return 0
  const radius = halfWidth / Math.sin(maxAngle)
  return THREE.MathUtils.clamp(x / radius, -Math.PI / 2, Math.PI / 2)
}
