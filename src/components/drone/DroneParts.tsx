"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";

export type PartKey = "vision" | "pi" | "fc" | "motors" | "cam" | "payload";

type Vec3 = [number, number, number];

const EXPLODE_OFFSETS: Record<PartKey, Vec3> = {
  vision: [0, 1.15, -0.55],
  cam: [0, 0.85, -1.35],
  pi: [0, 1.7, 0],
  fc: [0, -1.05, 0],
  motors: [0, 0.45, 0],
  payload: [0, -1.9, 0.4],
};

function useLerpGroup(
  base: Vec3,
  part: PartKey,
  explodeRef: React.MutableRefObject<number>,
) {
  const ref = useRef<THREE.Group>(null);
  const target = new THREE.Vector3(...base);
  const offset = new THREE.Vector3(...EXPLODE_OFFSETS[part]);

  useFrame(() => {
    if (!ref.current) return;
    const e = explodeRef.current;
    ref.current.position.lerp(
      target.clone().addScaledVector(offset, e),
      0.08,
    );
  });

  return ref;
}

function useHoverCursor() {
  return {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      document.body.style.cursor = "";
    },
  };
}

const BODY_COLOR = "#12283e";
const ACCENT = "#3b82f6";

export function VisionGroup({
  explodeRef,
  onSelect,
}: {
  explodeRef: React.MutableRefObject<number>;
  onSelect: (k: PartKey) => void;
}) {
  const ref = useLerpGroup([0, 0.62, -0.35], "vision", explodeRef);
  const hover = useHoverCursor();
  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("vision");
      }}
      {...hover}
    >
      <mesh>
        <boxGeometry args={[0.72, 0.1, 0.5]} />
        <meshStandardMaterial color="#0d3a52" emissive={ACCENT} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[-0.18, 0.06, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.03, 16]} />
        <meshStandardMaterial color="#04101d" />
      </mesh>
    </group>
  );
}

export function CameraGroup({
  explodeRef,
  onSelect,
}: {
  explodeRef: React.MutableRefObject<number>;
  onSelect: (k: PartKey) => void;
}) {
  const ref = useLerpGroup([0, 0.28, -0.95], "cam", explodeRef);
  const hover = useHoverCursor();
  return (
    <group
      ref={ref}
      rotation={[Math.PI / 2, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("cam");
      }}
      {...hover}
    >
      <mesh>
        <cylinderGeometry args={[0.14, 0.14, 0.22, 20]} />
        <meshStandardMaterial color="#1b2c40" />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.03, 20]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

export function PiGroup({
  explodeRef,
  onSelect,
}: {
  explodeRef: React.MutableRefObject<number>;
  onSelect: (k: PartKey) => void;
}) {
  const ref = useLerpGroup([0, 0.36, 0], "pi", explodeRef);
  const hover = useHoverCursor();
  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("pi");
      }}
      {...hover}
    >
      <mesh>
        <boxGeometry args={[1.05, 0.06, 0.68]} />
        <meshStandardMaterial color="#1d6b47" />
      </mesh>
      <mesh position={[0.12, 0.05, 0]}>
        <boxGeometry args={[0.34, 0.04, 0.34]} />
        <meshStandardMaterial color="#0a0f16" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[-0.38, 0.04, 0.18]}>
        <boxGeometry args={[0.16, 0.03, 0.12]} />
        <meshStandardMaterial color="#c9a227" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function BodyGroup() {
  return (
    <group>
      <RoundedBoxPrimitive />
    </group>
  );
}

import { RoundedBox } from "@react-three/drei";

function RoundedBoxPrimitive() {
  return (
    <RoundedBox args={[1.5, 0.34, 1.05]} radius={0.09} smoothness={4}>
      <meshStandardMaterial color={BODY_COLOR} metalness={0.35} roughness={0.35} />
    </RoundedBox>
  );
}

export function FcGroup({
  explodeRef,
  onSelect,
}: {
  explodeRef: React.MutableRefObject<number>;
  onSelect: (k: PartKey) => void;
}) {
  const ref = useLerpGroup([0, -0.26, 0], "fc", explodeRef);
  const hover = useHoverCursor();
  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("fc");
      }}
      {...hover}
    >
      <mesh>
        <boxGeometry args={[0.8, 0.07, 0.55]} />
        <meshStandardMaterial color="#41306b" />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.24, 0.04, 0.24]} />
        <meshStandardMaterial color="#0a0f16" metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  );
}

export function PayloadGroup({
  explodeRef,
  onSelect,
}: {
  explodeRef: React.MutableRefObject<number>;
  onSelect: (k: PartKey) => void;
}) {
  const ref = useLerpGroup([0, -0.55, 0], "payload", explodeRef);
  const hover = useHoverCursor();
  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("payload");
      }}
      {...hover}
    >
      <mesh>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color="#7a1f1f" roughness={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.27, 0.02, 10, 32]} />
        <meshStandardMaterial color="#e8b23a" emissive="#e8b23a" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

const ARM_ANGLES = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
const ARM_LEN = 1.35;

function Rotor({ angle }: { angle: number }) {
  const rotorRef = useRef<THREE.Group>(null);
  const x = Math.cos(angle) * ARM_LEN;
  const z = Math.sin(angle) * ARM_LEN;

  useFrame((_, delta) => {
    if (rotorRef.current) rotorRef.current.rotation.y += delta * 14;
  });

  return (
    <group position={[x, 0.12, z]}>
      <mesh>
        <cylinderGeometry args={[0.09, 0.11, 0.22, 16]} />
        <meshStandardMaterial color="#23364d" metalness={0.5} roughness={0.35} />
      </mesh>
      <group ref={rotorRef} position={[0, 0.16, 0]}>
        {[0, Math.PI].map((r) => (
          <mesh key={r} rotation={[0, r, 0]}>
            <boxGeometry args={[0.78, 0.015, 0.07]} />
            <meshStandardMaterial color="#0b1523" transparent opacity={0.85} />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 0.05, 12]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export function PropulsionGroup({
  onSelect,
  explode,
}: {
  onSelect: (k: PartKey) => void;
  explode: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetScale = explode ? 1.18 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, 1, targetScale), 0.08);
  });

  const hover = useHoverCursor();
  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("motors");
      }}
      {...hover}
    >
      {ARM_ANGLES.map((a) => (
        <group key={a}>
          <mesh position={[Math.cos(a) * (ARM_LEN / 2), 0.05, Math.sin(a) * (ARM_LEN / 2)]} rotation={[0, -a, 0]}>
            <boxGeometry args={[ARM_LEN + 0.25, 0.08, 0.12]} />
            <meshStandardMaterial color="#18293d" metalness={0.4} roughness={0.4} />
          </mesh>
          <Rotor angle={a} />
        </group>
      ))}
    </group>
  );
}
