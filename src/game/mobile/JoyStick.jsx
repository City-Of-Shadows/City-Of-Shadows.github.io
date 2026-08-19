import React, { useRef } from "react";

export default function Joystick({ onMove }) {
  const joystickRef = useRef(null);
  const knobRef = useRef(null);
  const active = useRef(false);
  const center = useRef({ x: 0, y: 0 });
  const frame = useRef(null);
  const pending = useRef({ x: 0, y: 0 });
  const MAX_DISTANCE = 40;

  const sendMove = (x, y) => {
    pending.current.x = x;
    pending.current.y = y;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      onMove(pending.current.x, pending.current.y);
    });
  };

  const moveJoystick = (clientX, clientY) => {
    let x = clientX - center.current.x;
    let y = clientY - center.current.y;
    const distance = Math.hypot(x, y);

    // Limit joystick
    if (distance > MAX_DISTANCE) {
      const scale = MAX_DISTANCE / distance;
      x *= scale;
      y *= scale;
    }

    const normalizedX = x / MAX_DISTANCE;
    const normalizedY = y / MAX_DISTANCE;

    // Smooth GPU transform
    if (knobRef.current) {
      knobRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    sendMove(normalizedX, normalizedY);
  };

  const start = (event) => {
    event.preventDefault();
    const joystick = joystickRef.current;
    if (!joystick) return;

    active.current = true;
    const rect = joystick.getBoundingClientRect();
    center.current.x = rect.left + rect.width / 2;
    center.current.y = rect.top + rect.height / 2;
    joystick.setPointerCapture?.(event.pointerId);
    moveJoystick(event.clientX, event.clientY);
  };

  const move = (event) => {
    if (!active.current) return;
    event.preventDefault();
    moveJoystick(event.clientX, event.clientY);
  };

  const end = (event) => {
    if (event) event.preventDefault();

    active.current = false;

    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }

    // Reset knob
    if (knobRef.current) {
      knobRef.current.style.transform = "translate3d(0, 0, 0)";
    }

    // Stop player
    onMove(0, 0);
  };

  return (
    <div
      ref={joystickRef}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      onPointerLeave={(event) => {
        if (active.current) move(event);
      }}
      style={{
        position: "fixed",
        left: "30px",
        bottom: "30px",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "rgba(20,25,35,0.75)",
        border: "3px solid rgba(255,255,255,0.3)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        // Helps mobile rendering
        willChange: "transform",
        // Prevent browser gesture handling
        WebkitTouchCallout: "none",
      }}
    >
      <div
        ref={knobRef}
        style={{
          width: "55px",
          height: "55px",
          borderRadius: "50%",
          background: "rgba(100,110,125,0.9)",
          border: "2px solid rgba(255,255,255,0.4)",
          pointerEvents: "none",
          position: "absolute",
          transform: "translate3d(0,0,0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      />
    </div>
  );
}
