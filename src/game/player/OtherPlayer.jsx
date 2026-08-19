import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function OtherPlayer({ player }) {
  const groupRef = useRef(null);

  const targetPosition = useRef(new THREE.Vector3());
  const targetRotation = useRef(0);

  useEffect(() => {
    if (!player) return;

    if (player.position) {
      targetPosition.current.set(
        Number(player.position.x) || 0,
        Number(player.position.y) || 0,
        Number(player.position.z) || 0
      );
    }

    if (player.rotation) {
      targetRotation.current = Number(player.rotation.y) || 0;
    }
  }, [player]);

  useFrame(() => {
    const group = groupRef.current;

    if (!group) return;

    group.position.lerp(targetPosition.current, 0.2);

    let difference = targetRotation.current - group.rotation.y;

    difference = Math.atan2(
      Math.sin(difference),
      Math.cos(difference)
    );

    group.rotation.y += difference * 0.2;
  });

  return (
    <group
      ref={groupRef}
      position={[
        targetPosition.current.x,
        targetPosition.current.y,
        targetPosition.current.z,
      ]}
    >
      <mesh position={[0, 1.7, 0]} castShadow>
        <capsuleGeometry args={[0.55, 1.2, 8, 10]} />
        <meshStandardMaterial color="#2367d1" roughness={0.7} />
      </mesh>

      <mesh position={[0, 3.0, 0]} castShadow>
        <sphereGeometry args={[0.45, 16, 12]} />
        <meshStandardMaterial color="#b85f4a" roughness={0.8} />
      </mesh>

      <mesh position={[0, 3.05, -0.42]}>
        <boxGeometry args={[0.35, 0.08, 0.04]} />
        <meshBasicMaterial color="#31d9ff" />
      </mesh>

      <mesh position={[-0.23, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.8, 8, 8]} />
        <meshStandardMaterial color="#151923" />
      </mesh>

      <mesh position={[0.23, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.8, 8, 8]} />
        <meshStandardMaterial color="#151923" />
      </mesh>

      <mesh
        position={[-0.72, 1.75, 0]}
        rotation={[0, 0, -0.15]}
        castShadow
      >
        <capsuleGeometry args={[0.18, 0.75, 8, 8]} />
        <meshStandardMaterial color="#2367d1" />
      </mesh>

      <mesh
        position={[0.72, 1.75, 0]}
        rotation={[0, 0, 0.15]}
        castShadow
      >
        <capsuleGeometry args={[0.18, 0.75, 8, 8]} />
        <meshStandardMaterial color="#2367d1" />
      </mesh>

      <pointLight
        position={[0, 2.5, 0]}
        intensity={0.6}
        distance={4}
        color="#238cff"
      />

      <group position={[0, 3.7, 0]}>
        <mesh>
          <planeGeometry args={[1.8, 0.3]} />
          <meshBasicMaterial
            color="#08111f"
            transparent
            opacity={0.8}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}
