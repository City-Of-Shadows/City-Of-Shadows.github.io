import React from "react";

function Tree({ position = [0, 0, 0], scale = 1, }) {
return ( <group position={position} scale={[scale, scale, scale]}>
<mesh position={[0, 5, 0]}> <cylinderGeometry args={[0.8, 1.1, 10, 8]} />
<meshStandardMaterial color="#5b3925" roughness={1} /> </mesh>
<mesh position={[0, 10, 0]}> <coneGeometry args={[5, 8, 8]} />
<meshStandardMaterial color="#285c32" roughness={1} /> </mesh>
<mesh position={[0, 14, 0]}> <coneGeometry args={[4.2, 7, 8]} />
<meshStandardMaterial color="#34753d" roughness={1} /> </mesh>
<mesh position={[0, 18, 0]}> <coneGeometry args={[3.2, 6, 8]} />
<meshStandardMaterial color="#438c48" roughness={1} /> </mesh> </group>);}

export default function CityTrees() { return ( <group>
      <Tree position={[210, 0, 180]} scale={1.5} />
      <Tree position={[-180, 0, -210]} scale={1.3} />
      <Tree position={[-130, 0, -210]} scale={1.5} />
      <Tree position={[-80, 0, -210]} scale={1.2} />
      <Tree position={[80, 0, -210]} scale={1.5} />
      <Tree position={[130, 0, -210]} scale={1.3} />
      <Tree position={[180, 0, -210]} scale={1.5} />
      <Tree position={[-210, 0, 180]} scale={1.4} />
      <Tree position={[-180, 0, 210]} scale={1.5} />
      <Tree position={[-130, 0, 210]} scale={1.3} />
      <Tree position={[-80, 0, 210]} scale={1.5} />
      <Tree position={[80, 0, 210]} scale={1.3} />
      <Tree position={[130, 0, 210]} scale={1.5} />
      <Tree position={[180, 0, 210]} scale={1.4} />
      <Tree position={[-210, 0, -180]} scale={1.5} />
      <Tree position={[-210, 0, -130]} scale={1.3} />
      <Tree position={[-210, 0, -80]} scale={1.6} />
      <Tree position={[-210, 0, 80]} scale={1.4} />
      <Tree position={[-210, 0, 130]} scale={1.5} />
      <Tree position={[210, 0, -180]} scale={1.4} />
      <Tree position={[210, 0, -130]} scale={1.6} />
      <Tree position={[210, 0, -80]} scale={1.3} />
      <Tree position={[210, 0, 80]} scale={1.5} />
      <Tree position={[210, 0, 130]} scale={1.4} />
      <Tree position={[-150, 0, -150]} scale={1.3} />
      <Tree position={[-120, 0, -80]} scale={1.5} />
      <Tree position={[-150, 0, 70]} scale={1.4} />
      <Tree position={[-120, 0, 140]} scale={1.3} />
      <Tree position={[150, 0, -150]} scale={1.4} />
      <Tree position={[120, 0, -80]} scale={1.3} />
      <Tree position={[150, 0, 70]} scale={1.5} />
      <Tree position={[120, 0, 140]} scale={1.4} />
      <Tree position={[-60, 0, -150]} scale={1.3} />
      <Tree position={[80, 0, -130]} scale={1.3} />
      <Tree position={[-70, 0, 150]} scale={1.4} />
      <Tree position={[80, 0, 140]} scale={1.5} /> </group>);}
