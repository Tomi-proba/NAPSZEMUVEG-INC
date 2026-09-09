import { useMemo } from 'react'
import * as THREE from 'three'
import { useConfiguratorStore } from '../store'
import { getMaterial } from '../config/materials'
import { getTempleStyle } from '../config/templeStyles'
import { buildFrameLayout, buildLensGeometry } from '../geometry/frame'
import TempleMesh from './TempleMesh'

export default function GlassesModel() {
  const materialId = useConfiguratorStore((s) => s.materialId)
  const templeStyleId = useConfiguratorStore((s) => s.templeStyleId)
  const lens = useConfiguratorStore((s) => s.lens)

  const material = getMaterial(materialId)
  const templeStyle = getTempleStyle(templeStyleId)

  const layout = useMemo(() => buildFrameLayout(lens), [lens])
  const rightLensGeometry = useMemo(
    () => buildLensGeometry(lens, 'right', layout.outerHalfWidth),
    [lens, layout.outerHalfWidth],
  )
  const leftLensGeometry = useMemo(
    () => buildLensGeometry(lens, 'left', layout.outerHalfWidth),
    [lens, layout.outerHalfWidth],
  )

  const frameMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: material.colorHex,
        metalness: material.metalness,
        roughness: material.roughness,
        clearcoat: material.clearcoat ?? 0,
        clearcoatRoughness: 0.25,
      }),
    [material],
  )

  const lensMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#dce8ea',
        metalness: 0,
        roughness: 0.05,
        transmission: 0.92,
        thickness: 1.4,
        ior: 1.5,
        transparent: true,
        opacity: 0.4,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
      }),
    [],
  )

  return (
    <group>
      <mesh geometry={layout.geometry} material={frameMaterial} castShadow receiveShadow />
      <mesh geometry={rightLensGeometry} material={lensMaterial} />
      <mesh geometry={leftLensGeometry} material={lensMaterial} />
      <TempleMesh style={templeStyle} material={frameMaterial} anchor={layout.rightHinge} side="right" />
      <TempleMesh style={templeStyle} material={frameMaterial} anchor={layout.leftHinge} side="left" />
    </group>
  )
}
