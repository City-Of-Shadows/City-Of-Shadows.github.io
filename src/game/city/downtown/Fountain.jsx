import React from "react";

export default function Fountain({ position = [0, 0, 0], width = 1.5, height = 1.5 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[5 * width, 5.3 * width, 0.3 * height, 32]} />
        <meshStandardMaterial color="#252936" roughness={0.6} metalness={0.3} />
      </mesh>

      <mesh position={[0, 0.35 * height, 0]}>
        <cylinderGeometry args={[4.6 * width, 4.6 * width, 0.12 * height, 32]} />
        <meshStandardMaterial color="#285d91" transparent opacity={0.8} roughness={0.15} metalness={0.25} emissive="#123b68" emissiveIntensity={0.5} />
      </mesh>

      <mesh position={[0, 0.7 * height, 0]}>
        <cylinderGeometry args={[1.5 * width, 1.8 * width, 0.7 * height, 24]} />
        <meshStandardMaterial color="#303442" roughness={0.45} metalness={0.4} />
      </mesh>

      <mesh position={[0, 2.2 * height, 0]}>
        <cylinderGeometry args={[0.45 * width, 0.65 * width, 3 * height, 16]} />
        <meshStandardMaterial color="#414654" roughness={0.4} metalness={0.5} />
      </mesh>

      <mesh position={[0, 3.7 * height, 0]}>
        <cylinderGeometry args={[1.25 * width, 0.8 * width, 0.3 * height, 24]} />
        <meshStandardMaterial color="#383d4c" roughness={0.4} metalness={0.45} />
      </mesh>

      <mesh position={[0, 4.35 * height, 0]}>
        <cylinderGeometry args={[0.08 * width, 0.16 * width, 1.4 * height, 8]} />
        <meshStandardMaterial color="#6edcff" transparent opacity={0.8} emissive="#35cfff" emissiveIntensity={2} />
      </mesh>

      {[0, 90, 180, 270].map((rotation, index) => (
        <mesh
          key={index}
          position={[
            Math.sin((rotation * Math.PI) / 180) * 2.5 * width,
            1.2 * height,
            Math.cos((rotation * Math.PI) / 180) * 2.5 * width,
          ]}
          rotation={[-0.35, (rotation * Math.PI) / 180, 0]}
        >
          <cylinderGeometry args={[0.06 * width, 0.12 * width, 2.2 * height, 8]} />
          <meshStandardMaterial color="#65d9ff" transparent opacity={0.75} emissive="#28c8ff" emissiveIntensity={2} />
        </mesh>
      ))}

      <pointLight position={[0, 2 * height, 0]} color="#36cfff" intensity={3} distance={12 * width} />
    </group>
  );
}
