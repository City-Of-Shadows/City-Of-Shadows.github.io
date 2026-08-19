import React from "react";

function Road({ position, size, rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial color="#20242a" />
    </mesh>
  );
}

function Sidewalk({ position, size, rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial color="#666b70" />
    </mesh>
  );
}

function RoadLine({ position, size, rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial color="#f5d85c" />
    </mesh>
  );
}

export default function Roads() {
  return (
    <group>
      <Road position={[0, 0, 0]} size={[500, 34]} rotation={[-Math.PI / 2, 0, 0]} />

      <Road position={[0, 0.01, 0]} size={[500, 34]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} />

      {Array.from({ length: 25 }).map((_, i) => (
        <RoadLine
          key={`horizontal-line-${i}`}
          position={[-240 + i * 20, 0.07, 0]}
          size={[9, 0.18]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      ))}

      {Array.from({ length: 25 }).map((_, i) => (
        <RoadLine
          key={`vertical-line-${i}`}
          position={[0, 0.07, -240 + i * 20]}
          size={[9, 0.18]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        />
      ))}

      <Sidewalk
        position={[0, 0.03, -22]}
        size={[500, 10]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      <Sidewalk
        position={[0, 0.03, 22]}
        size={[500, 10]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      <Sidewalk
        position={[-22, 0.03, 0]}
        size={[500, 10]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />

      <Sidewalk
        position={[22, 0.03, 0]}
        size={[500, 10]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
    </group>
  );
}
