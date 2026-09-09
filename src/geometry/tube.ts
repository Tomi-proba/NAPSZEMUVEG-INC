import * as THREE from 'three'

interface TaperedTubeOptions {
  curve: THREE.Curve<THREE.Vector3>
  segments: number
  radialSegments: number
  radiusAt: (t: number) => number
}

/**
 * Builds a tube along a curve whose radius can vary per-segment (for tapering),
 * with flat caps at both ends so the mesh is always watertight.
 */
export function buildTaperedTubeGeometry({
  curve,
  segments,
  radialSegments,
  radiusAt,
}: TaperedTubeOptions): THREE.BufferGeometry {
  const frames = curve.computeFrenetFrames(segments, false)
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  const vertex = new THREE.Vector3()
  const normal = new THREE.Vector3()
  const ringPoints: THREE.Vector3[] = []

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const point = curve.getPointAt(t)
    ringPoints.push(point)
    const normalVec = frames.normals[i]
    const binormalVec = frames.binormals[i]
    const radius = radiusAt(t)

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2
      const sin = Math.sin(v)
      const cos = -Math.cos(v)

      normal.x = cos * normalVec.x + sin * binormalVec.x
      normal.y = cos * normalVec.y + sin * binormalVec.y
      normal.z = cos * normalVec.z + sin * binormalVec.z
      normal.normalize()

      normals.push(normal.x, normal.y, normal.z)

      vertex.x = point.x + radius * normal.x
      vertex.y = point.y + radius * normal.y
      vertex.z = point.z + radius * normal.z
      positions.push(vertex.x, vertex.y, vertex.z)

      uvs.push(i / segments, j / radialSegments)
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = (radialSegments + 1) * i + j
      const b = (radialSegments + 1) * (i + 1) + j
      const c = (radialSegments + 1) * (i + 1) + j + 1
      const d = (radialSegments + 1) * i + j + 1
      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  // Flat end caps so the tube is always a closed, watertight solid.
  const addCap = (ringIndex: number, t: number, flip: boolean) => {
    const centerVertexIndex = positions.length / 3
    const center = ringPoints[ringIndex]
    positions.push(center.x, center.y, center.z)
    const tangent = curve.getTangentAt(t).normalize()
    const capNormal = flip ? tangent : tangent.clone().negate()
    normals.push(capNormal.x, capNormal.y, capNormal.z)
    uvs.push(0.5, 0.5)

    const ringStart = ringIndex * (radialSegments + 1)
    for (let j = 0; j < radialSegments; j++) {
      const a = ringStart + j
      const b = ringStart + j + 1
      if (flip) {
        indices.push(centerVertexIndex, a, b)
      } else {
        indices.push(centerVertexIndex, b, a)
      }
    }
  }

  addCap(0, 0, false)
  addCap(segments, 1, true)

  const geometry = new THREE.BufferGeometry()
  geometry.setIndex(indices)
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  return geometry
}
