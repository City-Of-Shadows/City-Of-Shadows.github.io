import React, { useCallback } from "react";
import Joystick from "./JoyStick";

export default function MobileControls({
  onMove,
  onJump,
  onSprint,
  onHelicopter,
}) {
  const buttonBase = {
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    fontWeight: 800,
    color: "#fff",
    zIndex: 999999,

    userSelect: "none",
    WebkitUserSelect: "none",
    WebkitTapHighlightColor: "transparent",
    touchAction: "none",
    cursor: "pointer",
    WebkitTouchCallout: "none",

    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  };

  const heliButton = {
    ...buttonBase,
    top: "max(18px, env(safe-area-inset-top))",
    right: "max(18px, env(safe-area-inset-right))",
    width: "clamp(58px, 16vw, 76px)",
    height: "clamp(58px, 16vw, 76px)",
    border: "2px solid #19e6ff",
    background: "rgba(10,20,30,0.82)",
    color: "#19e6ff",
    fontSize: "clamp(10px, 3vw, 13px)",
    boxShadow: "0 0 18px rgba(25,230,255,0.25)",
  };

  const jumpButton = {
    ...buttonBase,
    right: "max(18px, env(safe-area-inset-right))",
    bottom:
      "calc(max(100px, 18vh) + env(safe-area-inset-bottom))",
    width: "clamp(62px, 18vw, 82px)",
    height: "clamp(62px, 18vw, 82px)",
    border: "2px solid rgba(255,255,255,0.35)",
    background: "rgba(20,25,35,0.72)",
    fontSize: "clamp(10px, 3vw, 13px)",
    boxShadow: "0 5px 20px rgba(0,0,0,0.35)",
  };

  const sprintButton = {
    ...buttonBase,
    right:
      "calc(max(18px, env(safe-area-inset-right)) + clamp(72px, 21vw, 96px))",
    bottom: "max(18px, env(safe-area-inset-bottom))",
    width: "clamp(58px, 16vw, 72px)",
    height: "clamp(58px, 16vw, 72px)",
    border: "2px solid rgba(255,255,255,0.3)",
    background: "rgba(20,25,35,0.72)",
    fontSize: "clamp(9px, 2.8vw, 12px)",
    boxShadow: "0 5px 20px rgba(0,0,0,0.35)",
  };

  const handleHoldStart = useCallback((event, callback) => {
    event.stopPropagation();

    // Capture the pointer so releasing outside the button
    // still triggers pointerup.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ignore if pointer capture isn't available.
    }

    callback(true);
  }, []);

  const handleHoldEnd = useCallback((event, callback) => {
    event.stopPropagation();

    callback(false);

    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore pointer-capture errors.
    }
  }, []);

  const handleHoldCancel = useCallback((event, callback) => {
    event.stopPropagation();

    callback(false);

    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore pointer-capture errors.
    }
  }, []);

  const handleHelicopter = useCallback(
    (event) => {
      event.stopPropagation();
      onHelicopter();
    },
    [onHelicopter]
  );

  return (
    <>
      <Joystick onMove={onMove} />
      <button
        type="button"
        onPointerDown={handleHelicopter}
        style={heliButton}
        aria-label="Helicopter"
      >
        🚁

        <span
          style={{
            position: "absolute",
            bottom: "10%",
            fontSize: "clamp(8px, 2.2vw, 11px)",
          }}
        >
          HELI
        </span>
      </button>
      <button
        type="button"
        onPointerDown={(event) =>
          handleHoldStart(event, onJump)
        }
        onPointerUp={(event) =>
          handleHoldEnd(event, onJump)
        }
        onPointerCancel={(event) =>
          handleHoldCancel(event, onJump)
        }
        onPointerLeave={(event) => {
          // Only release if the pointer isn't captured.
          if (
            !event.currentTarget.hasPointerCapture?.(
              event.pointerId
            )
          ) {
            onJump(false);
          }
        }}
        style={jumpButton}
        aria-label="Jump"
      >
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: "clamp(20px, 6vw, 30px)",
              lineHeight: 1,
            }}
          >
            ⬆
          </span>

          <span>JUMP</span>
        </span>
      </button>
      <button
        type="button"
        onPointerDown={(event) =>
          handleHoldStart(event, onSprint)
        }
        onPointerUp={(event) =>
          handleHoldEnd(event, onSprint)
        }
        onPointerCancel={(event) =>
          handleHoldCancel(event, onSprint)
        }
        onPointerLeave={(event) => {
          if (
            !event.currentTarget.hasPointerCapture?.(
              event.pointerId
            )
          ) {
            onSprint(false);
          }
        }}
        style={sprintButton}
        aria-label="Sprint"
      >
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: "clamp(17px, 5vw, 25px)",
              lineHeight: 1,
            }}
          >
            🏃
          </span>

          <span>RUN</span>
        </span>
      </button>
    </>
  );
}
