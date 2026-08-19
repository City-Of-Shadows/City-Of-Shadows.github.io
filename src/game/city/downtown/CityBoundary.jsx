import React from "react";
import { useTexture } from "@react-three/drei";

export default function CityBoundary() {
  const texture = useTexture("/public/boundary.webp");
  const size = 500;
  const height = 100;
  const y = height / 2;
return (
    <group>
      <mesh position={[0, y, -250]}>
        <planeGeometry args={[size, height]} />
        <meshBasicMaterial map={texture} side={2} /> </mesh>
      <mesh position={[0, y, 250]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[size, height]} />
        <meshBasicMaterial map={texture} side={2} /> </mesh>
      <mesh position={[-250, y, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[size, height]} />
        <meshBasicMaterial  map={texture} side={2} /> </mesh>
      <mesh position={[250, y, 0]} rotation={[0, -Math.PI / 2, 0]} >
        <planeGeometry args={[size, height]} />
        <meshBasicMaterial map={texture} side={2} /> </mesh> 
</group>);}
