"use client"
import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { useTheme } from "./ThemeContext"

function fbm(x: number, z: number, octaves = 4): number {
  let value = 0
  let amplitude = 1
  let frequency = 1
  let maxVal = 0
  for (let i = 0; i < octaves; i++) {
    const p = Math.sin(x * frequency * 0.02 + z * frequency * 0.015) *
              Math.cos(z * frequency * 0.02 - x * frequency * 0.012) * 0.5 + 0.5
    value += amplitude * p
    maxVal += amplitude
    amplitude *= 0.5
    frequency *= 2
  }
  return value / maxVal
}

function Terrain({ color, yOffset = -2 }: { color: string; yOffset?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const geo = useMemo(() => {
    const size = 40
    const segs = 80
    const g = new THREE.PlaneGeometry(size, size, segs, segs)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const h = fbm(x, z) * 3 + 0.5
      pos.setY(i, h)
    }
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh ref={meshRef} geometry={geo} position={[0, yOffset, -8]}>
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        metalness={0.05}
        flatShading
      />
    </mesh>
  )
}

function TempleSilhouette({
  x,
  scale = 1,
  color,
}: {
  x: number
  scale?: number
  color: string
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const tier1 = useMemo(() => {
    const g = new THREE.BoxGeometry(4 * scale, 2.5 * scale, 1.5 * scale)
    return g
  }, [scale])
  const tier2 = useMemo(() => {
    const g = new THREE.BoxGeometry(3 * scale, 2 * scale, 1.5 * scale)
    return g
  }, [scale])
  const tier3 = useMemo(() => {
    const g = new THREE.BoxGeometry(2 * scale, 1.5 * scale, 1.5 * scale)
    return g
  }, [scale])
  const shikhara = useMemo(() => {
    const g = new THREE.ConeGeometry(1.2 * scale, 2 * scale, 4)
    return g
  }, [scale])

  return (
    <group ref={groupRef} position={[x, 0, -12]}>
      <mesh geometry={tier1} position={[0, 1.25 * scale, 0]}>
        <meshStandardMaterial color={color} roughness={1} metalness={0} />
      </mesh>
      <mesh geometry={tier2} position={[0, 3.25 * scale, 0]}>
        <meshStandardMaterial color={color} roughness={1} metalness={0} />
      </mesh>
      <mesh geometry={tier3} position={[0, 5 * scale, 0]}>
        <meshStandardMaterial color={color} roughness={1} metalness={0} />
      </mesh>
      <mesh geometry={shikhara} position={[0, 6.5 * scale, 0]}>
        <meshStandardMaterial color={color} roughness={1} metalness={0} />
      </mesh>
    </group>
  )
}

function Clouds({ color }: { color: string }) {
  const count = 12
  const clouds = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const r = 12 + Math.random() * 8
      return {
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r - 8,
        y: 5 + Math.random() * 4,
        s: 0.8 + Math.random() * 1.2,
        speed: 0.02 + Math.random() * 0.03,
      }
    })
  }, [])

  return (
    <group>
      {clouds.map((c, i) => (
        <CloudPatch key={i} {...c} color={color} />
      ))}
    </group>
  )
}

function CloudPatch({
  x,
  y,
  z,
  s,
  speed,
  color,
}: {
  x: number
  y: number
  z: number
  s: number
  speed: number
  color: string
}) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x += 0.002
    }
  })
  const geo = useMemo(() => new THREE.SphereGeometry(1, 6, 6), [])
  const opacities = useMemo(() => [0.4, 0.5, 0.6, 0.35, 0.55], [])

  return (
    <group ref={ref} position={[x, y, z]} scale={s}>
      {[0, 1, -1, 0.5, -0.5].map((off, j) => (
        <mesh
          key={j}
          geometry={geo}
          position={[off * 1.2, 0, (j % 3 - 1) * 0.8]}
          scale={[2, 0.6, 1.2 + Math.abs(off) * 0.3]}
        >
          <meshStandardMaterial
            color={color}
            transparent
            opacity={opacities[j]}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function Mist({ color }: { color: string }) {
  const count = 30
  const ref = useRef<THREE.Points>(null!)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = 1 + Math.random() * 3
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 5
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    return g
  }, [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.005
    }
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color={color}
        size={1.5}
        transparent
        opacity={0.15}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Stars() {
  const count = 200
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 80
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = Math.abs(r * Math.cos(phi))
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 10
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    return g
  }, [])

  return (
    <points geometry={geo}>
      <pointsMaterial color="#ffffff" size={0.15} transparent opacity={0.6} />
    </points>
  )
}

function SkyDome({
  topColor,
  bottomColor,
}: {
  topColor: string
  bottomColor: string
}) {
  const geo = useMemo(() => {
    const g = new THREE.SphereGeometry(50, 32, 32)
    return g
  }, [])
  const mat = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 2
    canvas.height = 64
    const ctx = canvas.getContext("2d")!
    const grad = ctx.createLinearGradient(0, 0, 0, 64)
    grad.addColorStop(0, topColor)
    grad.addColorStop(1, bottomColor)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 2, 64)
    const tex = new THREE.CanvasTexture(canvas)
    return new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide })
  }, [topColor, bottomColor])

  return <mesh geometry={geo} material={mat} />
}

export function Scene3D() {
  const { colors } = useTheme()

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 4, 12]} fov={55} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={0.6} />
        <SkyDome
          topColor={colors.sceneSkyTop}
          bottomColor={colors.sceneSkyBottom}
        />
        <Stars />
        <Terrain color={colors.terrainColor} yOffset={-2} />
        <TempleSilhouette x={-6} scale={1} color={colors.stoneDark} />
        <TempleSilhouette x={-3.5} scale={0.7} color={colors.stoneMid} />
        <TempleSilhouette x={5} scale={0.85} color={colors.stoneDark} />
        <TempleSilhouette x={7.5} scale={0.6} color={colors.stoneMid} />
        <Clouds color={colors.sceneCloud} />
        <Mist color={colors.sceneMist} />
      </Canvas>
    </div>
  )
}
