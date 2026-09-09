import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { LensParams } from '../types'
import { roundedRectShape } from './roundedRect'
import { applyFrontCurve, bendNormalAngle, bendPoint } from './bend'

export const RIM = 4 // mm, width of the frame material around each lens
export const FRAME_DEPTH = 4.5 // mm, front-to-back thickness of the frame

export interface HingeAnchor {
  position: THREE.Vector3
  angle: number
}

export interface FrameLayout {
  geometry: THREE.BufferGeometry
  eyeCenterX: number
  outerHalfWidth: number
  leftHinge: HingeAnchor
  rightHinge: HingeAnchor
}

function ringGeometry(width: number, height: number, radius: number, rim: number, depth: number) {
  const outer = roundedRectShape(width + rim * 2, height + rim * 2, radius + rim)
  const hole = roundedRectShape(width, height, radius)
  outer.holes.push(new THREE.Path(hole.getPoints(32).reverse()))
  const geometry = new THREE.ExtrudeGeometry(outer, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.4,
    bevelSegments: 2,
    curveSegments: 24,
  })
  geometry.translate(0, 0, -depth / 2)
  return geometry
}

function barGeometry(width: number, height: number, radius: number, depth: number) {
  const shape = roundedRectShape(width, height, radius)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.4,
    bevelSize: 0.3,
    bevelSegments: 2,
    curveSegments: 16,
  })
  geometry.translate(0, 0, -depth / 2)
  return geometry
}

function eyeCenterXFor(lens: LensParams) {
  return lens.bridge / 2 + lens.width / 2
}

function cornerRadiusFor(lens: LensParams) {
  return 1.5 + lens.roundness * (Math.min(lens.width, lens.height) / 2 - 1.5)
}

export function buildFrameLayout(lens: LensParams): FrameLayout {
  const { width: W, height: H, bridge: B } = lens
  const cornerRadius = cornerRadiusFor(lens)
  const eyeCenterX = eyeCenterXFor(lens)

  const rightRing = ringGeometry(W, H, cornerRadius, RIM, FRAME_DEPTH)
  rightRing.translate(eyeCenterX, 0, 0)

  const leftRing = ringGeometry(W, H, cornerRadius, RIM, FRAME_DEPTH)
  leftRing.translate(-eyeCenterX, 0, 0)

  const barWidth = Math.max(B - RIM * 0.2, RIM * 0.6)
  const barHeight = H * 0.34
  const bar = barGeometry(barWidth, barHeight, barHeight * 0.3, FRAME_DEPTH)
  bar.translate(0, H * 0.12, 0)

  const hingeBlockW = 3.2
  const hingeBlockH = 6
  const hingeY = H * 0.05
  const hingeOuterX = eyeCenterX + W / 2 + RIM - hingeBlockW * 0.4

  const rightHingeBlock = barGeometry(hingeBlockW, hingeBlockH, 1, FRAME_DEPTH * 0.9)
  rightHingeBlock.translate(hingeOuterX, hingeY, 0)

  const leftHingeBlock = barGeometry(hingeBlockW, hingeBlockH, 1, FRAME_DEPTH * 0.9)
  leftHingeBlock.translate(-hingeOuterX, hingeY, 0)

  const merged = mergeGeometries(
    [rightRing, leftRing, bar, rightHingeBlock, leftHingeBlock],
    false,
  )!

  const outerHalfWidth = eyeCenterX + W / 2 + RIM
  applyFrontCurve(merged, outerHalfWidth, lens.frontCurve)

  const hingeAnchorX = eyeCenterX + W / 2 + RIM
  const rightBent = bendPoint(hingeAnchorX, 0, outerHalfWidth, lens.frontCurve)
  const leftBent = bendPoint(-hingeAnchorX, 0, outerHalfWidth, lens.frontCurve)
  const rightAngle = bendNormalAngle(hingeAnchorX, outerHalfWidth, lens.frontCurve)
  const leftAngle = bendNormalAngle(-hingeAnchorX, outerHalfWidth, lens.frontCurve)

  return {
    geometry: merged,
    eyeCenterX,
    outerHalfWidth,
    rightHinge: {
      position: new THREE.Vector3(rightBent.x, hingeY, rightBent.z),
      angle: rightAngle,
    },
    leftHinge: {
      position: new THREE.Vector3(leftBent.x, hingeY, leftBent.z),
      angle: leftAngle,
    },
  }
}

export function buildLensGeometry(
  lens: LensParams,
  side: 'left' | 'right',
  outerHalfWidth: number,
): THREE.BufferGeometry {
  const { width: W, height: H } = lens
  const cornerRadius = cornerRadiusFor(lens)
  const eyeCenterX = eyeCenterXFor(lens)
  const x0 = side === 'right' ? eyeCenterX : -eyeCenterX

  const shape = roundedRectShape(W - 1.2, H - 1.2, Math.max(cornerRadius - 0.6, 0.5))
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1.6,
    bevelEnabled: false,
    curveSegments: 24,
  })
  geometry.translate(x0, 0, -0.8)
  applyFrontCurve(geometry, outerHalfWidth, lens.frontCurve)
  return geometry
}
