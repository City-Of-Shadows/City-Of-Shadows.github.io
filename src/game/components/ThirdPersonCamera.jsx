import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function ThirdPersonCamera({ mobileHelicopter = false }) {
  const { camera, scene } = useThree();
  const angle = useRef(0);
  const vertical = useRef(0.45);
  const distance = useRef(18);
  const targetPosition = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const helicopter = useRef(false);
  const touching = useRef(false);
  const lastTouch = useRef({ x: 0, y: 0 });
  const pinchDistance = useRef(null);
  const mouseDown = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    helicopter.current = mobileHelicopter;
  }, [mobileHelicopter]);

  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (event.button !== 0) return;
      mouseDown.current = true;
      lastMouse.current.x = event.clientX;
      lastMouse.current.y = event.clientY;
    };

    const handleMouseUp = () => {
      mouseDown.current = false;
    };

    const handleMouseMove = (event) => {
      if (!mouseDown.current) return;
      const dx = event.clientX - lastMouse.current.x;
      const dy = event.clientY - lastMouse.current.y;
      angle.current -= dx * 0.005;
      vertical.current += dy * 0.005;
      vertical.current = THREE.MathUtils.clamp(vertical.current, -0.7, 1.3);
      lastMouse.current.x = event.clientX;
      lastMouse.current.y = event.clientY;
    };

    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === "v") {
        helicopter.current = !helicopter.current;
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    const handleTouchStart = (event) => {
      if (event.touches.length === 2) {
        pinchDistance.current = getTouchDistance(event.touches);
        return;
      }

      if (event.touches.length !== 1) return;

      const touch = event.touches[0];
      touching.current = true;
      lastTouch.current.x = touch.clientX;
      lastTouch.current.y = touch.clientY;
    };

    const handleTouchMove = (event) => {
      if (event.touches.length === 2) {
        const currentDistance = getTouchDistance(event.touches);

        if (pinchDistance.current !== null) {
          const difference = currentDistance - pinchDistance.current;
          distance.current -= difference * 0.025;
          distance.current = THREE.MathUtils.clamp(distance.current, 7, 35);
        }

        pinchDistance.current = currentDistance;
        return;
      }

      if (event.touches.length !== 1 || !touching.current) return;

      const touch = event.touches[0];
      const dx = touch.clientX - lastTouch.current.x;
      const dy = touch.clientY - lastTouch.current.y;

      angle.current -= dx * 0.008;
      vertical.current += dy * 0.008;
      vertical.current = THREE.MathUtils.clamp(vertical.current, -0.7, 1.3);

      lastTouch.current.x = touch.clientX;
      lastTouch.current.y = touch.clientY;
    };

    const handleTouchEnd = () => {
      touching.current = false;
      pinchDistance.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  useFrame(() => {
    const player = scene.getObjectByName("PLAYER");
    if (!player) return;

    if (helicopter.current) {
      targetPosition.current.set(player.position.x, player.position.y + 100, player.position.z + 100);
      camera.position.lerp(targetPosition.current, 0.06);
      lookTarget.current.set(player.position.x, player.position.y, player.position.z);
      camera.lookAt(lookTarget.current);
      return;
    }

    const horizontalDistance = Math.cos(vertical.current) * distance.current;
    const verticalDistance = Math.sin(vertical.current) * distance.current;
    const x = player.position.x + Math.sin(angle.current) * horizontalDistance;
    const z = player.position.z + Math.cos(angle.current) * horizontalDistance;
    const y = player.position.y + 2 + verticalDistance;

    targetPosition.current.set(x, y, z);
    camera.position.lerp(targetPosition.current, 0.08);

    lookTarget.current.set(player.position.x, player.position.y + 1.2, player.position.z);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
