import React from "react";

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 4, 5]} />
        <meshStandardMaterial color="#5a3825" roughness={1} />
      </mesh>

      <mesh position={[0, 4.5, 0]}>
        <sphereGeometry args={[2, 6, 5]} />
        <meshStandardMaterial color="#238044" roughness={1} />
      </mesh>

      <mesh position={[0, 6, 0]}>
        <sphereGeometry args={[1.4, 6, 5]} />
        <meshStandardMaterial color="#2f9b50" roughness={1} />
      </mesh>
    </group>
  );
}

function Bush({ position, scale = 1 }) {
  return (
    <mesh position={[position[0], 0.8 * scale, position[2]]} scale={[scale, scale, scale]}>
      <sphereGeometry args={[1.2, 6, 5]} />
      <meshStandardMaterial color="#287343" roughness={1} />
    </mesh>
  );
}

function Bench({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[3.5, 0.3, 0.9]} />
        <meshStandardMaterial color="#76543e" roughness={1} />
      </mesh>

      <mesh position={[-1.2, 0.5, 0]}>
        <boxGeometry args={[0.25, 1, 0.7]} />
        <meshStandardMaterial color="#30353b" />
      </mesh>

      <mesh position={[1.2, 0.5, 0]}>
        <boxGeometry args={[0.25, 1, 0.7]} />
        <meshStandardMaterial color="#30353b" />
      </mesh>

      <mesh position={[0, 1.8, 0.35]}>
        <boxGeometry args={[3.5, 1.2, 0.25]} />
        <meshStandardMaterial color="#76543e" roughness={1} />
      </mesh>
    </group>
  );
}

function StreetSign({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 4.4, 5]} />
        <meshStandardMaterial color="#252a32" />
      </mesh>

      <mesh position={[0, 4.1, 0]}>
        <boxGeometry args={[2.5, 0.8, 0.12]} />
        <meshBasicMaterial color="#00eaff" />
      </mesh>
    </group>
  );
}

export default function CityProps() {
  return (
    <group>
      <Tree position={[-32, 0, -32]} scale={1.1} />
      <Tree position={[32, 0, -32]} scale={1.1} />
      <Tree position={[-32, 0, 32]} scale={1.2} />
      <Tree position={[32, 0, 32]} scale={1.2} />

      <Tree position={[-45, 0, -15]} scale={0.8} />
      <Tree position={[45, 0, -15]} scale={0.9} />
      <Tree position={[-45, 0, 15]} scale={0.9} />
      <Tree position={[45, 0, 15]} scale={0.8} />

      <Bush position={[-28, 0, -27]} scale={1} />
      <Bush position={[28, 0, -27]} scale={1} />
      <Bush position={[-28, 0, 27]} scale={1} />
      <Bush position={[28, 0, 27]} scale={1} />

      <Bench position={[-12, 0, -15]} rotation={[0, Math.PI / 2, 0]} />
      <Bench position={[12, 0, 15]} rotation={[0, -Math.PI / 2, 0]} />

      <StreetSign position={[-18, 0, -18]} />
      <StreetSign position={[18, 0, 18]} />
    </group>
  );
}
