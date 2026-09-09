import { useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * Generates a neutral studio-style environment map locally (no network / HDRI
 * download) so metallic materials pick up soft reflections instead of
 * rendering flat black under direct lights alone.
 */
function applyStudioEnvironment(gl: THREE.WebGLRenderer, scene: THREE.Scene) {
  const pmrem = new THREE.PMREMGenerator(gl)
  const renderTarget = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = renderTarget.texture
  pmrem.dispose()
  return () => {
    renderTarget.dispose()
    scene.environment = null
  }
}

export default function StudioEnvironment() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)

  useEffect(() => applyStudioEnvironment(gl, scene), [gl, scene])

  return null
}
