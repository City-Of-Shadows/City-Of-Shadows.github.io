import React from "react";
import Joystick from "./JoyStick";
export default function MobileControls({
  onMove,
  onJump,
  onSprint,
  onHelicopter,
}) {
  return (
    <>
      <Joystick onMove={onMove} />
<button
  onTouchStart={(e) => {
    e.preventDefault();
    onHelicopter();
  }}
  onClick={() => {
    onHelicopter();
  }}
  style={{
    position: "fixed",
    right: "25px",
    top: "25px",
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    border: "2px solid #19e6ff",
    background: "rgba(10,20,30,0.8)",
    color: "#19e6ff",
    fontWeight: "bold",
    zIndex: 999999,
    touchAction: "none",
    userSelect: "none",
  }}
>
  🚁 HELI
</button>
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          onJump(true);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onJump(false);
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          onJump(false);
        }}
        style={{
          position: "fixed",
          right: "25px",
          bottom: "120px",

          width: "75px",
          height: "75px",

          borderRadius: "50%",

          border:
            "2px solid rgba(255,255,255,0.3)",

          background:
            "rgba(20,25,35,0.65)",

          color: "white",

          fontWeight: "bold",

          zIndex: 999999,

          touchAction: "none",
          userSelect: "none",

          backdropFilter: "blur(6px)",
        }}
      >
        JUMP
      </button>
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          onSprint(true);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onSprint(false);
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          onSprint(false);
        }}
        style={{
          position: "fixed",
          right: "125px",
          bottom: "25px",

          width: "65px",
          height: "65px",

          borderRadius: "50%",

          border:
            "2px solid rgba(255,255,255,0.3)",

          background:
            "rgba(20,25,35,0.65)",

          color: "white",

          fontWeight: "bold",

          zIndex: 999999,

          touchAction: "none",
          userSelect: "none",

          backdropFilter: "blur(6px)",
        }}
      >
        RUN
      </button>
    </>
  );
}