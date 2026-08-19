import React from "react";

import Apartment from "./Apartment";
import Plaza from "./Plaza";
import CityBoundary from "./CityBoundary";
import Fountain from "./Fountain";
import Hut from "./Hut";
import Tree from "./Tree";

export default function Downtown() {
  return (
    <group>
      <Tree />
      <Hut />
      <Plaza position={[0, 0, 0]} />
      <CityBoundary />

      <Fountain position={[-100, 0, -100]} width={5} height={2} />
      <Fountain position={[100, 0, -100]} width={5} height={2} />
      <Fountain position={[-100, 0, 100]} width={5} height={2} />
      <Fountain position={[100, 0, 100]} width={5} height={2} />

      <Apartment position={[-35, 0, -185]} rotation={[0, Math.PI / 2, 0]} height={50} width={18} color="#35465a" neon="#5ee7ff" />
      <Apartment position={[-35, 0, -135]} rotation={[0, Math.PI / 2, 0]} height={50} width={18} color="#465365" neon="#9d7cff" />
      <Apartment position={[-35, 0, -85]} rotation={[0, Math.PI / 2, 0]} height={50} width={18} color="#3d5262" neon="#55ffd0" />
      <Apartment position={[-35, 0, 35]} rotation={[0, Math.PI / 2, 0]} height={50} width={18} color="#443d59" neon="#ff5fc8" />
      <Apartment position={[-35, 0, 85]} rotation={[0, Math.PI / 2, 0]} height={50} width={18} color="#40576c" neon="#62dfff" />
      <Apartment position={[-35, 0, 135]} rotation={[0, Math.PI / 2, 0]} height={50} width={18} color="#514b60" neon="#ff75ae" />
      <Apartment position={[-35, 0, 185]} rotation={[0, Math.PI / 2, 0]} height={50} width={18} color="#3e5264" neon="#55ffd0" />

      <Apartment position={[35, 0, -185]} rotation={[0, -Math.PI / 2, 0]} height={50} width={18} color="#46596b" neon="#62dfff" />
      <Apartment position={[35, 0, -135]} rotation={[0, -Math.PI / 2, 0]} height={50} width={18} color="#51495f" neon="#c18aff" />
      <Apartment position={[35, 0, -85]} rotation={[0, -Math.PI / 2, 0]} height={50} width={18} color="#40576c" neon="#5ee7ff" />
      <Apartment position={[36, 0, -35]} height={50} width={18} color="#4c5368" neon="#ff75ae" />
      <Apartment position={[35, 0, 85]} rotation={[0, -Math.PI / 2, 0]} height={50} width={18} color="#3f5363" neon="#55ffd0" />
      <Apartment position={[35, 0, 135]} rotation={[0, -Math.PI / 2, 0]} height={50} width={18} color="#574b62" neon="#9d7cff" />
      <Apartment position={[35, 0, 185]} rotation={[0, -Math.PI / 2, 0]} height={50} width={18} color="#35465a" neon="#5ee7ff" />

      <Apartment position={[-185, 0, -35]} height={50} width={18} color="#465365" neon="#62dfff" />
      <Apartment position={[-135, 0, -35]} height={50} width={18} color="#3d5262" neon="#55ffd0" />
      <Apartment position={[-85, 0, -35]} height={50} width={18} color="#514b60" neon="#ff75ae" />
      <Apartment position={[-35, 0, -35]} height={50} width={18} color="#40576c" neon="#5ee7ff" />
      <Apartment position={[85, 0, -35]} height={50} width={18} color="#443d59" neon="#c18aff" />
      <Apartment position={[135, 0, -35]} height={50} width={18} color="#3f5363" neon="#55ffd0" />

      <Apartment position={[-185, 0, 36]} rotation={[0, -Math.PI, 0]} height={50} width={18} color="#46596b" neon="#62dfff" />
      <Apartment position={[-135, 0, 36]} rotation={[0, -Math.PI, 0]} height={50} width={18} color="#51495f" neon="#ff5fc8" />
      <Apartment position={[-85, 0, 36]} rotation={[0, -Math.PI, 0]} height={50} width={18} color="#40576c" neon="#5ee7ff" />
      <Apartment position={[35, 0, 36]} rotation={[0, -Math.PI / 2, 0]} height={50} width={18} color="#3e5264" neon="#55ffd0" />
      <Apartment position={[85, 0, 36]} rotation={[0, -Math.PI, 0]} height={50} width={18} color="#574b62" neon="#9d7cff" />
      <Apartment position={[135, 0, 36]} rotation={[0, -Math.PI, 0]} height={50} width={18} color="#35465a" neon="#62dfff" />
    </group>
  );
}
