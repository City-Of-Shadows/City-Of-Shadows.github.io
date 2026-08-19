import React from "react";
function Tree({ position, scale = 1 }) { return (
<group position={position} scale={scale}>
<mesh position={[0, 1.2, 0]}>
<cylinderGeometry args={[0.3, 0.4, 2.4, 6]} />
<meshStandardMaterial color="#654126" roughness={1} /> </mesh>
<mesh position={[0, 3, 0]}>
<sphereGeometry args={[1.5, 10, 8]} />
        <meshStandardMaterial color="#26733b" roughness={1} /> </mesh>
      <mesh position={[0.7, 3.4, 0]}>
        <sphereGeometry args={[0.9, 8, 6]} />
        <meshStandardMaterial color="#318b45" roughness={1} /> </mesh>
      <mesh position={[-0.7, 3.3, 0]}>
        <sphereGeometry args={[0.9, 8, 6]} />
        <meshStandardMaterial color="#1f6633" roughness={1} /> </mesh> </group>);}
function Bench({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[3.2, 0.25, 0.7]} />
        <meshStandardMaterial color="#70452a" roughness={1} />
      </mesh>
      <mesh position={[0, 1.7, 0.3]}>
        <boxGeometry args={[3.2, 1.2, 0.2]} />
        <meshStandardMaterial color="#70452a" roughness={1} />
      </mesh>
      <mesh position={[-1.1, 0.45, 0]}>
        <boxGeometry args={[0.18, 0.9, 0.18]} />
        <meshStandardMaterial color="#292d32" roughness={1} />
      </mesh>
      <mesh position={[1.1, 0.45, 0]}>
        <boxGeometry args={[0.18, 0.9, 0.18]} />
        <meshStandardMaterial color="#292d32" roughness={1} />
      </mesh>
    </group>
  );
}

function PlazaLight({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 5, 6]} />
        <meshStandardMaterial
          color="#22262d"
          metalness={0.4}
          roughness={0.8}
        />
      </mesh>

      <mesh position={[0, 5.1, 0]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial
          color="#fff0a0"
          emissive="#fff0a0"
          emissiveIntensity={3}
        />
      </mesh>
    </group>
  );
}

export default function Plaza() {
  return (
    <group position={[0, 0.05, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[30, 32]} />
        <meshStandardMaterial color="#697278" roughness={1} />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
      >
        <ringGeometry args={[20, 20.4, 32]} />
        <meshStandardMaterial color="#c0c4c5" roughness={1} />
      </mesh>

      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[6, 6.8, 2, 24]} />
        <meshStandardMaterial color="#555e65" roughness={1} />
      </mesh>

      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[5.4, 5.4, 0.2, 24]} />
        <meshStandardMaterial
          color="#4fc8e8"
          emissive="#164d62"
          emissiveIntensity={0.4}
          metalness={0.15}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.5, 0.75, 5, 10]} />
        <meshStandardMaterial color="#8b949b" roughness={0.8} />
      </mesh>

      <mesh position={[0, 7, 0]}>
        <sphereGeometry args={[0.8, 10, 8]} />
        <meshStandardMaterial color="#8f9ba2" roughness={0.8} />
      </mesh>

      <mesh position={[0, 4, 0]}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial
          color="#55dfff"
          emissive="#55dfff"
          emissiveIntensity={2}
        />
      </mesh>

      <Tree position={[-22, 0, -10]} scale={1.2} />
      <Tree position={[22, 0, -10]} scale={1.1} />
      <Tree position={[-22, 0, 10]} scale={1} />
      <Tree position={[22, 0, 10]} scale={1.2} />

      <Bench position={[-11, 0, 0]} rotation={Math.PI / 2} />
      <Bench position={[11, 0, 0]} rotation={-Math.PI / 2} />
      <Bench position={[0, 0, -12]} />
      <Bench position={[0, 0, 12]} rotation={Math.PI} />

      <PlazaLight position={[-18, 0, -18]} />
      <PlazaLight position={[18, 0, -18]} />
      <PlazaLight position={[-18, 0, 18]} />
      <PlazaLight position={[18, 0, 18]} /> </group>);}
