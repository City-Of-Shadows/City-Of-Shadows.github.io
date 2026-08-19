import React from "react";

function House({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  height = 15,
  width = 20,
  color = "#a9bfd4",
  neon = "#5ee7ff",
}) {
  const depth = width * 0.72;

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.75} metalness={0.05} />
      </mesh>

      <mesh position={[0, 2, depth / 2 + 0.14]}>
        <boxGeometry args={[2.8, 4, 0.16]} />
        <meshStandardMaterial color="#263442" metalness={0.3} roughness={0.45} />
      </mesh>

      <mesh position={[0, 2.1, depth / 2 + 0.23]}>
        <boxGeometry args={[2, 3, 0.05]} />
        <meshStandardMaterial color={neon} emissive={neon} emissiveIntensity={0.5} />
      </mesh>

      <mesh position={[0, height + 0.5, 0]}>
        <boxGeometry args={[width + 0.8, 1, depth + 0.8]} />
        <meshStandardMaterial color="#718293" roughness={0.75} metalness={0.15} />
      </mesh>
    </group>
  );
}

export default function BoundaryHouses() {
  return (
    <group>
      <House position={[-210, 0, -235]} color="#a9bfd4" neon="#5ee7ff" />
      <House position={[-160, 0, -235]} color="#c5aec8" neon="#ff66cc" />
      <House position={[-110, 0, -235]} color="#a9c4ad" neon="#66ffcc" />
      <House position={[-60, 0, -235]} color="#c8b79f" neon="#ffb45c" />
      <House position={[60, 0, -235]} color="#b3c7da" neon="#5ee7ff" />
      <House position={[110, 0, -235]} color="#c5aec8" neon="#ff66cc" />
      <House position={[160, 0, -235]} color="#a9c4ad" neon="#66ffcc" />
      <House position={[210, 0, -235]} color="#c8b79f" neon="#ffb45c" />

      <House position={[-210, 0, 235]} rotation={[0, Math.PI, 0]} color="#b3c7da" neon="#5ee7ff" />
      <House position={[-160, 0, 235]} rotation={[0, Math.PI, 0]} color="#a9c4ad" neon="#66ffcc" />
      <House position={[-110, 0, 235]} rotation={[0, Math.PI, 0]} color="#c8b79f" neon="#ffb45c" />
      <House position={[-60, 0, 235]} rotation={[0, Math.PI, 0]} color="#c5aec8" neon="#ff66cc" />
      <House position={[60, 0, 235]} rotation={[0, Math.PI, 0]} color="#a9bfd4" neon="#5ee7ff" />
      <House position={[110, 0, 235]} rotation={[0, Math.PI, 0]} color="#c8b79f" neon="#ffb45c" />
      <House position={[160, 0, 235]} rotation={[0, Math.PI, 0]} color="#a9c4ad" neon="#66ffcc" />
      <House position={[210, 0, 235]} rotation={[0, Math.PI, 0]} color="#c5aec8" neon="#ff66cc" />

      <House position={[-235, 0, -210]} rotation={[0, Math.PI / 2, 0]} color="#a9bfd4" neon="#5ee7ff" />
      <House position={[-235, 0, -160]} rotation={[0, Math.PI / 2, 0]} color="#c5aec8" neon="#ff66cc" />
      <House position={[-235, 0, -110]} rotation={[0, Math.PI / 2, 0]} color="#a9c4ad" neon="#66ffcc" />
      <House position={[-235, 0, -60]} rotation={[0, Math.PI / 2, 0]} color="#c8b79f" neon="#ffb45c" />
      <House position={[-235, 0, 60]} rotation={[0, Math.PI / 2, 0]} color="#b3c7da" neon="#5ee7ff" />
      <House position={[-235, 0, 110]} rotation={[0, Math.PI / 2, 0]} color="#c5aec8" neon="#ff66cc" />
      <House position={[-235, 0, 160]} rotation={[0, Math.PI / 2, 0]} color="#a9c4ad" neon="#66ffcc" />
      <House position={[-235, 0, 210]} rotation={[0, Math.PI / 2, 0]} color="#c8b79f" neon="#ffb45c" />

      <House position={[235, 0, -210]} rotation={[0, -Math.PI / 2, 0]} color="#a9bfd4" neon="#5ee7ff" />
      <House position={[235, 0, -160]} rotation={[0, -Math.PI / 2, 0]} color="#c5aec8" neon="#ff66cc" />
      <House position={[235, 0, -110]} rotation={[0, -Math.PI / 2, 0]} color="#a9c4ad" neon="#66ffcc" />
      <House position={[235, 0, -60]} rotation={[0, -Math.PI / 2, 0]} color="#c8b79f" neon="#ffb45c" />
      <House position={[235, 0, 60]} rotation={[0, -Math.PI / 2, 0]} color="#b3c7da" neon="#5ee7ff" />
      <House position={[235, 0, 110]} rotation={[0, -Math.PI / 2, 0]} color="#c5aec8" neon="#ff66cc" />
      <House position={[235, 0, 160]} rotation={[0, -Math.PI / 2, 0]} color="#a9c4ad" neon="#66ffcc" />
      <House position={[235, 0, 210]} rotation={[0, -Math.PI / 2, 0]} color="#c8b79f" neon="#ffb45c" />
    </group>
  );
}
