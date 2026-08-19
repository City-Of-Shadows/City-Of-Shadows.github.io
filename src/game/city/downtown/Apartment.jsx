import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export default function Apartment({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  height = 36,
  width = 18,
  color = "#35465a",
  neon = "#5ee7ff",
}) {
  const totalFloors = Math.max(1, Math.floor((height - 4) / 4));
  const totalColumns = Math.max(2, Math.floor(width / 3));
  const windowFloorStep = 2;
  const windowColumnStep = 2;
  const windowFloors = Math.ceil(totalFloors / windowFloorStep);
  const windowColumns = Math.ceil(totalColumns / windowColumnStep);
  const windowCount = windowFloors * windowColumns * 4;
  const windowGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(1.45, 2.1);
  }, []);
  const windowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: neon,
      emissive: neon,
      emissiveIntensity: 0.5,
      roughness: 0.4,
      metalness: 0,
    });
  }, [neon]);
  const windowsRef = useRef();

  useEffect(() => {
    const mesh = windowsRef.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    let index = 0;

    for (let floor = 0; floor < totalFloors; floor += windowFloorStep) {
      for (let column = 0; column < totalColumns; column += windowColumnStep) {
        const x = -width / 2 + 2 + column * ((width - 4) / Math.max(1, totalColumns - 1));
        const y = 3 + floor * 4;

        matrix.compose(
          new THREE.Vector3(x, y, width * 0.43 + 0.06),
          new THREE.Quaternion(),
          new THREE.Vector3(1, 1, 1)
        );

        mesh.setMatrixAt(index++, matrix);
      }
    }

    const backRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));

    for (let floor = 0; floor < totalFloors; floor += windowFloorStep) {
      for (let column = 0; column < totalColumns; column += windowColumnStep) {
        const x = -width / 2 + 2 + column * ((width - 4) / Math.max(1, totalColumns - 1));
        const y = 3 + floor * 4;

        matrix.compose(
          new THREE.Vector3(x, y, -width * 0.43 - 0.06),
          backRotation,
          new THREE.Vector3(1, 1, 1)
        );

        mesh.setMatrixAt(index++, matrix);
      }
    }

    const rightRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));

    for (let floor = 0; floor < totalFloors; floor += windowFloorStep) {
      for (let column = 0; column < totalColumns; column += windowColumnStep) {
        const z = -width * 0.42 + 2 + column * ((width * 0.84 - 4) / Math.max(1, totalColumns - 1));
        const y = 3 + floor * 4;

        matrix.compose(
          new THREE.Vector3(width / 2 + 0.06, y, z),
          rightRotation,
          new THREE.Vector3(1, 1, 1)
        );

        mesh.setMatrixAt(index++, matrix);
      }
    }

    const leftRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));

    for (let floor = 0; floor < totalFloors; floor += windowFloorStep) {
      for (let column = 0; column < totalColumns; column += windowColumnStep) {
        const z = -width * 0.42 + 2 + column * ((width * 0.84 - 4) / Math.max(1, totalColumns - 1));
        const y = 3 + floor * 4;

        matrix.compose(
          new THREE.Vector3(-width / 2 - 0.06, y, z),
          leftRotation,
          new THREE.Vector3(1, 1, 1)
        );

        mesh.setMatrixAt(index++, matrix);
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
  }, [height, width, totalFloors, totalColumns, windowFloorStep, windowColumnStep]);

  const floorLines = [];

  for (let floor = 1; floor < totalFloors; floor++) {
    floorLines.push(
      <mesh key={`line-${floor}`} position={[0, 2 + floor * 4, width * 0.43 + 0.08]}>
        <boxGeometry args={[width, 0.1, 0.12]} />
        <meshStandardMaterial color="#111923" roughness={1} />
      </mesh>
    );
  }

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, height / 2, 0]} receiveShadow>
        <boxGeometry args={[width, height, width * 0.86]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>

      <instancedMesh ref={windowsRef} args={[windowGeometry, windowMaterial, windowCount]} frustumCulled />

      {floorLines}

      <mesh position={[0, height / 2, width * 0.43 + 0.1]}>
        <boxGeometry args={[0.35, height, 0.16]} />
        <meshStandardMaterial color="#121a24" roughness={0.7} />
      </mesh>

      <mesh position={[0, 2.2, width * 0.43 + 0.14]}>
        <boxGeometry args={[3.2, 4.4, 0.15]} />
        <meshStandardMaterial color="#101720" metalness={0.4} roughness={0.4} />
      </mesh>

      <mesh position={[0, 2.3, width * 0.43 + 0.23]}>
        <planeGeometry args={[2.4, 3.5]} />
        <meshStandardMaterial color={neon} emissive={neon} emissiveIntensity={0.6} roughness={0.5} />
      </mesh>

      <mesh position={[0, height + 0.5, 0]}>
        <boxGeometry args={[width + 1, 1, width * 0.86 + 1]} />
        <meshStandardMaterial color="#111720" roughness={0.8} metalness={0.2} />
      </mesh>

      <mesh position={[0, height + 2.5, 0]}>
        <boxGeometry args={[width * 0.35, 4, width * 0.35]} />
        <meshStandardMaterial color="#202936" roughness={0.8} />
      </mesh>

      <mesh position={[0, height + 4.6, width * 0.43]}>
        <boxGeometry args={[width * 0.7, 0.12, 0.12]} />
        <meshStandardMaterial color={neon} emissive={neon} emissiveIntensity={1} roughness={0.5} />
      </mesh>
    </group>
  );
}
