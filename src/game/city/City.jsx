import React from "react";
import CityGround from "./CityGround.jsx";
import Roads from "./Roads.jsx";
import Cars from "./Cars.jsx";
import CityProps from "./CityProps.jsx";
import Downtown from "./downtown/Downtown.jsx";

export default function City({
  onTalk,
}) {
  return (
    <group>

      <CityGround />

      <Roads />

      <Downtown />

      <CityProps />

      <Cars />
      
    </group>
  );
}