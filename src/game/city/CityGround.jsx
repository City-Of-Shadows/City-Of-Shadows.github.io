import React from "react";

export default function CityGround() {
return ( <group>
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshBasicMaterial color="#3d4542" /> </mesh>
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[-100, 0, -100]}>
        <planeGeometry args={[160, 160]} />
        <meshBasicMaterial color="#4f654b" /></mesh>
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[100, 0, -100]}>
        <planeGeometry args={[160, 160]} />
        <meshBasicMaterial color="#4f654b" /> </mesh>
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[-100, 0, 100]}>
        <planeGeometry args={[160, 160]} />
        <meshBasicMaterial color="#4f654b" /> </mesh>
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[100, 0, 100]}>
        <planeGeometry args={[160, 160]} />
        <meshBasicMaterial color="#4f654b" /> </mesh> </group>);}