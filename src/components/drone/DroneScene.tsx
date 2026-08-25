"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  BodyGroup,
  CameraGroup,
  FcGroup,
  PayloadGroup,
  PiGroup,
  PropulsionGroup,
  VisionGroup,
  type PartKey,
} from "./DroneParts";

function ExplodeDriver({
  targetRef,
  exploded,
}: {
  targetRef: React.MutableRefObject<number>;
  exploded: boolean;
}) {
  useFrame(() => {
    const target = exploded ? 1 : 0;
    targetRef.current += (target - targetRef.current) * 0.07;
  });
  return null;
}

function FireSim({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const flameA = useRef<THREE.Mesh>(null);
  const flameB = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.1, 1.2, 1.1)), []);

  useFrame((_, delta) => {
    const t = performance.now() / 1000;
    if (group.current) {
      const s = active ? 1 : 0.001;
      group.current.scale.lerp(new THREE.Vector3(s, s, s), 0.12);
      group.current.visible = group.current.scale.x > 0.02;
    }
    if (flameA.current) {
      flameA.current.scale.y = 1 + Math.sin(t * 11) * 0.16 + Math.sin(t * 27) * 0.07;
      flameA.current.rotation.y += delta * 1.6;
    }
    if (flameB.current) {
      flameB.current.scale.y = 1 + Math.sin(t * 9 + 1.4) * 0.14;
    }
    if (light.current) {
      light.current.intensity = active ? 2.4 + Math.sin(t * 19) * 0.8 : 0;
    }
  });

  return (
    <group ref={group} position={[0, -0.7, -2.4]} scale={0.001}>
      <mesh ref={flameA} position={[0, 0.42, 0]}>
        <coneGeometry args={[0.26, 0.85, 12]} />
        <meshStandardMaterial color="#ff7a1a" emissive="#ff5400" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      <mesh ref={flameB} position={[0, 0.22, 0]}>
        <coneGeometry args={[0.44, 0.5, 14]} />
        <meshStandardMaterial color="#ffb03a" emissive="#ff9500" emissiveIntensity={1.5} transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <pointLight ref={light} color="#ff7a1a" distance={7} decay={2} intensity={0} />
      <lineSegments>
        <primitive object={edges} attach="geometry" />
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.9} />
      </lineSegments>
    </group>
  );
}

export default function DroneScene({
  exploded,
  fire,
  activePart,
  onSelect,
}: {
  exploded: boolean;
  fire: boolean;
  activePart: PartKey | null;
  onSelect: (k: PartKey) => void;
}) {
  const explodeRef = useRef(0);
  void activePart;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [3.4, 2.3, 3.8], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={1.15} />
      <pointLight position={[-3, 2, -3]} intensity={0.5} color="#3b82f6" />

      <ExplodeDriver targetRef={explodeRef} exploded={exploded} />

      <group position={[0, 0.15, 0]}>
        <BodyGroup />
        <Suspense fallback={null}>
          <VisionGroup explodeRef={explodeRef} onSelect={onSelect} />
          <CameraGroup explodeRef={explodeRef} onSelect={onSelect} />
          <PiGroup explodeRef={explodeRef} onSelect={onSelect} />
          <FcGroup explodeRef={explodeRef} onSelect={onSelect} />
          <PayloadGroup explodeRef={explodeRef} onSelect={onSelect} />
          <PropulsionGroup onSelect={onSelect} explode={exploded} />
        </Suspense>
        <FireSim active={fire} />
      </group>

      <gridHelper args={[12, 24, "#232b36", "#12161c"]} position={[0, -1.6, 0]} />

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.7}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  );
}
