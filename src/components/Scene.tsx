import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import GlassesModel from './GlassesModel'
import StudioEnvironment from './StudioEnvironment'

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [0, 6, 190], fov: 32, near: 1, far: 1000 }} dpr={[1, 2]}>
      <color attach="background" args={['#eef0f2']} />
      <StudioEnvironment />
      <hemisphereLight args={['#ffffff', '#4d5157', 0.65]} />
      <directionalLight
        position={[120, 150, 120]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-140, 60, -80]} intensity={0.55} />
      <GlassesModel />
      <ContactShadows position={[0, -38, 0]} opacity={0.35} scale={220} blur={2.4} far={60} />
      <OrbitControls enablePan={false} minDistance={80} maxDistance={320} makeDefault />
    </Canvas>
  )
}
