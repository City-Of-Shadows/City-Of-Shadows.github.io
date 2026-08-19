import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function Car({
  position = [0, 0, 0],
  direction = 1,
  axis = "z",
  color = "#e85b5b",
  speed = 7,
}) {
  const car = useRef();

  useFrame((_, delta) => {
    if (!car.current) return;

    const movement = direction * speed * Math.min(delta, 0.05);

    if (axis === "z") {
      car.current.position.z += movement;

      if (car.current.position.z > 230) {
        car.current.position.z = -230;
      }

      if (car.current.position.z < -230) {
        car.current.position.z = 230;
      }
    } else {
      car.current.position.x += movement;

      if (car.current.position.x > 230) {
        car.current.position.x = -230;
      }

      if (car.current.position.x < -230) {
        car.current.position.x = 230;
      }
    }
  });

  return (
    <group ref={car} position={position} rotation={[0, axis === "x" ? Math.PI / 2 : 0, 0]}>
      <mesh>
        <boxGeometry args={[2.2, 0.65, 4]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>

      <mesh position={[0, 0.55, -0.15]}>
        <boxGeometry args={[1.7, 0.65, 1.8]} />
        <meshStandardMaterial color="#263647" roughness={0.35} metalness={0.15} />
      </mesh>

      <mesh position={[0, 0.25, -2.02]}>
        <boxGeometry args={[1.4, 0.18, 0.08]} />
        <meshStandardMaterial color="#fff4c4" emissive="#fff4c4" emissiveIntensity={1} />
      </mesh>

      <mesh position={[0, 0.25, 2.02]}>
        <boxGeometry args={[1.4, 0.18, 0.08]} />
        <meshStandardMaterial color="#ff3030" emissive="#ff3030" emissiveIntensity={0.8} />
      </mesh>

      {[-1, 1].map((x) => (
        <React.Fragment key={x}>
          <mesh position={[x * 1.05, -0.35, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.25, 8]} />
            <meshStandardMaterial color="#15171a" roughness={0.9} />
          </mesh>

          <mesh position={[x * 1.05, -0.35, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.25, 8]} />
            <meshStandardMaterial color="#15171a" roughness={0.9} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

export default function Cars() {
  return (
    <group>
      <Car position={[-8, 0.65, -160]} direction={1} axis="z" color="#e85b5b" speed={7} />
      <Car position={[8, 0.65, 80]} direction={-1} axis="z" color="#4c83df" speed={8} />
      <Car position={[-8, 0.65, 20]} direction={1} axis="z" color="#f0b84c" speed={6} />
      <Car position={[8, 0.65, -90]} direction={-1} axis="z" color="#6bc28c" speed={9} />
      <Car position={[-180, 0.65, -8]} direction={1} axis="x" color="#d86de8" speed={8} />
      <Car position={[120, 0.65, 8]} direction={-1} axis="x" color="#58c7d9" speed={7} />
      <Car position={[-50, 0.65, -70]} direction={1} axis="x" color="#e6a04b" speed={6} />
      <Car position={[180, 0.65, 70]} direction={-1} axis="x" color="#8d9ae8" speed={8} />
    </group>
  );
}
