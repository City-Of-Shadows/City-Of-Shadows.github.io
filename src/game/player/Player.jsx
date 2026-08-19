import React, {
  useEffect,
  useRef,
} from "react";
import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import * as THREE from "three";

export default function Player({
  externalPlayerRef = null,
  mobileMove = {
    x: 0,
    y: 0,
  },
  mobileSprint = false,
  mobileJump = false,
  onShoot = null,
}) {
  const internalPlayerRef = useRef(null);
  const playerRef =
    externalPlayerRef || internalPlayerRef;

  const characterRef = useRef(null);
  const gunRef = useRef(null);
  const muzzleFlashRef = useRef(null);
  const muzzleLightRef = useRef(null);

  const velocityY = useRef(0);
  const grounded = useRef(true);
  const shootCooldown = useRef(0);
  const recoilTimer = useRef(0);
  const muzzleTimer = useRef(0);
  const walkTime = useRef(0);
  const mouseDown = useRef(false);

  const mousePosition = useRef(
    new THREE.Vector2(0, 0)
  );

  const {
    camera,
    scene,
    gl,
  } = useThree();

  const WALK_SPEED = 8;
  const SPRINT_SPEED = 14;
  const GRAVITY = 25;
  const JUMP_FORCE = 9;
  const SHOOT_RANGE = 1000;
  const SHOOT_DELAY = 0.13;
  const PLAYER_ROTATION_SPEED = 10;
  const GROUND_Y = 0;

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    jump: false,
  });

  const skinMaterial =
    new THREE.MeshStandardMaterial({
      color: "#c8755e",
      roughness: 0.8,
    });

  const skinDarkMaterial =
    new THREE.MeshStandardMaterial({
      color: "#704036",
      roughness: 0.85,
    });

  const suitMaterial =
    new THREE.MeshStandardMaterial({
      color: "#1c2430",
      roughness: 0.7,
    });

  const armorMaterial =
    new THREE.MeshStandardMaterial({
      color: "#293341",
      metalness: 0.65,
      roughness: 0.3,
    });

  const bootMaterial =
    new THREE.MeshStandardMaterial({
      color: "#050609",
      metalness: 0.5,
      roughness: 0.3,
    });

  const gloveMaterial =
    new THREE.MeshStandardMaterial({
      color: "#171c24",
      metalness: 0.25,
      roughness: 0.65,
    });

  const hairMaterial =
    new THREE.MeshStandardMaterial({
      color: "#090909",
      roughness: 0.75,
    });

  const beltMaterial =
    new THREE.MeshStandardMaterial({
      color: "#171b21",
      metalness: 0.7,
      roughness: 0.3,
    });

  const neonMaterial =
    new THREE.MeshStandardMaterial({
      color: "#2c9dff",
      emissive: "#087cff",
      emissiveIntensity: 2.5,
      roughness: 0.25,
    });

  const gunMetal =
    new THREE.MeshStandardMaterial({
      color: "#242a33",
      metalness: 0.85,
      roughness: 0.25,
    });

  const gunDark =
    new THREE.MeshStandardMaterial({
      color: "#080a0d",
      metalness: 0.55,
      roughness: 0.3,
    });

  const gunGrip =
    new THREE.MeshStandardMaterial({
      color: "#11151b",
      roughness: 0.7,
    });

  const gunNeon =
    new THREE.MeshStandardMaterial({
      color: "#42aaff",
      emissive: "#087cff",
      emissiveIntensity: 3,
      roughness: 0.2,
    });

  useEffect(() => {
    const down = (event) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = true;
          break;

        case "KeyS":
        case "ArrowDown":
          keys.current.backward = true;
          break;

        case "KeyA":
        case "ArrowLeft":
          keys.current.left = true;
          break;

        case "KeyD":
        case "ArrowRight":
          keys.current.right = true;
          break;

        case "ShiftLeft":
        case "ShiftRight":
          keys.current.sprint = true;
          break;

        case "Space":
          keys.current.jump = true;
          event.preventDefault();
          break;

        default:
          break;
      }
    };

    const up = (event) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = false;
          break;

        case "KeyS":
        case "ArrowDown":
          keys.current.backward = false;
          break;

        case "KeyA":
        case "ArrowLeft":
          keys.current.left = false;
          break;

        case "KeyD":
        case "ArrowRight":
          keys.current.right = false;
          break;

        case "ShiftLeft":
        case "ShiftRight":
          keys.current.sprint = false;
          break;

        case "Space":
          keys.current.jump = false;
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;

    const move = (event) => {
      const rect =
        canvas.getBoundingClientRect();

      if (
        rect.width <= 0 ||
        rect.height <= 0
      ) {
        return;
      }

      mousePosition.current.x =
        ((event.clientX - rect.left) /
          rect.width) *
          2 -
        1;

      mousePosition.current.y =
        -(
          ((event.clientY - rect.top) /
            rect.height) *
            2 -
          1
        );
    };

    const down = (event) => {
      if (event.button !== 0) return;

      mouseDown.current = true;
      shoot();
    };

    const up = (event) => {
      if (event.button === 0) {
        mouseDown.current = false;
      }
    };

    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      canvas.removeEventListener("mousemove", move);
      canvas.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [gl]);

  useEffect(() => {
    const shootEvent = () => {
      shoot();
    };

    window.addEventListener(
      "game-shoot",
      shootEvent
    );

    return () => {
      window.removeEventListener(
        "game-shoot",
        shootEvent
      );
    };
  }, []);

  useEffect(() => {
    if (!playerRef.current) return;

    playerRef.current.userData.isPlayer = true;
    playerRef.current.userData.player = true;

    return () => {
      if (playerRef.current) {
        delete playerRef.current.userData.isPlayer;
        delete playerRef.current.userData.player;
      }
    };
  }, [playerRef]);

  const shoot = () => {
    const player = playerRef.current;

    if (!player) return;

    if (shootCooldown.current > 0) {
      return;
    }

    shootCooldown.current = SHOOT_DELAY;
    recoilTimer.current = 0.08;
    muzzleTimer.current = 0.06;

    if (muzzleFlashRef.current) {
      muzzleFlashRef.current.visible = true;
    }

    if (muzzleLightRef.current) {
      muzzleLightRef.current.intensity = 5;
    }

    const raycaster = new THREE.Raycaster();

    raycaster.setFromCamera(
      mousePosition.current,
      camera
    );

    raycaster.far = SHOOT_RANGE;

    const origin = new THREE.Vector3();

    if (gunRef.current) {
      gunRef.current.getWorldPosition(origin);
    } else {
      origin.copy(player.position);
      origin.y += 2;
    }

    const direction =
      raycaster.ray.direction
        .clone()
        .normalize();

    const enemyObjects = [];

    scene.traverse((object) => {
      if (!object) return;

      if (
        object.userData?.isEnemy ||
        object.userData?.enemy
      ) {
        enemyObjects.push(object);
      }
    });

    const hits =
      raycaster.intersectObjects(
        enemyObjects,
        true
      );

    let enemyHit = false;
    let hitPoint = null;

    if (hits.length > 0) {
      enemyHit = true;
      hitPoint = hits[0].point.clone();

      let target = hits[0].object;

      while (
        target &&
        target !== scene
      ) {
        if (
          typeof target.userData?.takeDamage ===
          "function"
        ) {
          target.userData.takeDamage(25);
          break;
        }

        target = target.parent;
      }
    }

    if (typeof onShoot === "function") {
      onShoot({
        origin: origin.clone(),
        direction: direction.clone(),
        range: SHOOT_RANGE,
        hit: enemyHit,
        hitPoint,
      });
    }
  };

  useFrame((_, delta) => {
    const player = playerRef.current;

    if (!player) return;

    const dt = Math.min(delta, 0.05);

    if (shootCooldown.current > 0) {
      shootCooldown.current -= dt;

      if (shootCooldown.current < 0) {
        shootCooldown.current = 0;
      }
    }

    if (mouseDown.current) {
      shoot();
    }

    if (muzzleTimer.current > 0) {
      muzzleTimer.current -= dt;

      if (muzzleFlashRef.current) {
        muzzleFlashRef.current.visible = true;
      }
    } else if (muzzleFlashRef.current) {
      muzzleFlashRef.current.visible = false;
    }

    if (muzzleLightRef.current) {
      muzzleLightRef.current.intensity =
        THREE.MathUtils.lerp(
          muzzleLightRef.current.intensity,
          0,
          dt * 30
        );
    }

    const movement = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(forward);

    forward.y = 0;

    if (forward.lengthSq() > 0.0001) {
      forward.normalize();
    }

    right.crossVectors(
      forward,
      new THREE.Vector3(0, 1, 0)
    );

    if (right.lengthSq() > 0.0001) {
      right.normalize();
    }

    if (keys.current.forward) {
      movement.add(forward);
    }

    if (keys.current.backward) {
      movement.sub(forward);
    }

    if (keys.current.right) {
      movement.add(right);
    }

    if (keys.current.left) {
      movement.sub(right);
    }

    const mobileX = mobileMove?.x || 0;
    const mobileY = mobileMove?.y || 0;

    if (Math.abs(mobileY) > 0.1) {
      movement.addScaledVector(
        forward,
        -mobileY
      );
    }

    if (Math.abs(mobileX) > 0.1) {
      movement.addScaledVector(
        right,
        mobileX
      );
    }

    const isMoving =
      movement.lengthSq() > 0.001;

    if (isMoving) {
      movement.normalize();

      const sprint =
        keys.current.sprint ||
        mobileSprint;

      const speed =
        sprint
          ? SPRINT_SPEED
          : WALK_SPEED;

      player.position.x +=
        movement.x * speed * dt;

      player.position.z +=
        movement.z * speed * dt;

      const targetRotation =
        Math.atan2(
          movement.x,
          movement.z
        );

      let difference =
        targetRotation -
        player.rotation.y;

      difference = Math.atan2(
        Math.sin(difference),
        Math.cos(difference)
      );

      player.rotation.y +=
        difference *
        Math.min(
          1,
          dt * PLAYER_ROTATION_SPEED
        );

      walkTime.current +=
        dt * (sprint ? 12 : 8);

      const swing =
        Math.sin(walkTime.current);

      const leftLeg =
        characterRef.current?.getObjectByName(
          "PLAYER_LEFT_LEG"
        );

      const rightLeg =
        characterRef.current?.getObjectByName(
          "PLAYER_RIGHT_LEG"
        );

      if (leftLeg) {
        leftLeg.rotation.x =
          swing * 0.45;
      }

      if (rightLeg) {
        rightLeg.rotation.x =
          -swing * 0.45;
      }
    } else {
      const leftLeg =
        characterRef.current?.getObjectByName(
          "PLAYER_LEFT_LEG"
        );

      const rightLeg =
        characterRef.current?.getObjectByName(
          "PLAYER_RIGHT_LEG"
        );

      if (leftLeg) {
        leftLeg.rotation.x =
          THREE.MathUtils.lerp(
            leftLeg.rotation.x,
            0,
            dt * 8
          );
      }

      if (rightLeg) {
        rightLeg.rotation.x =
          THREE.MathUtils.lerp(
            rightLeg.rotation.x,
            0,
            dt * 8
          );
      }
    }

    const jumpPressed =
      keys.current.jump ||
      mobileJump;

    if (
      jumpPressed &&
      grounded.current
    ) {
      velocityY.current = JUMP_FORCE;
      grounded.current = false;
      keys.current.jump = false;
    }

    velocityY.current -=
      GRAVITY * dt;

    player.position.y +=
      velocityY.current * dt;

    if (player.position.y <= GROUND_Y) {
      player.position.y = GROUND_Y;
      velocityY.current = 0;
      grounded.current = true;
    }

    if (gunRef.current) {
      if (recoilTimer.current > 0) {
        recoilTimer.current -= dt;
        gunRef.current.position.z = -0.55;
      } else {
        gunRef.current.position.z = -0.6;
      }
    }
  });

  return (
    <group
      ref={playerRef}
      name="PLAYER"
      position={[7, 0, 19]}
      userData={{
        isPlayer: true,
        player: true,
      }}
    >
      <group ref={characterRef}>
        <group
          name="PLAYER_LEFT_LEG"
          position={[-0.27, 1, 0]}
        >
          <mesh material={suitMaterial}>
            <capsuleGeometry args={[0.23, 1, 8, 10]} />
          </mesh>

          <mesh
            position={[0, -0.65, -0.08]}
            material={bootMaterial}
          >
            <boxGeometry args={[0.45, 0.45, 0.75]} />
          </mesh>

          <mesh
            position={[0, -0.48, -0.48]}
            material={neonMaterial}
          >
            <boxGeometry args={[0.22, 0.05, 0.025]} />
          </mesh>
        </group>

        <group
          name="PLAYER_RIGHT_LEG"
          position={[0.27, 1, 0]}
        >
          <mesh material={suitMaterial}>
            <capsuleGeometry args={[0.23, 1, 8, 10]} />
          </mesh>

          <mesh
            position={[0, -0.65, -0.08]}
            material={bootMaterial}
          >
            <boxGeometry args={[0.45, 0.45, 0.75]} />
          </mesh>

          <mesh
            position={[0, -0.48, -0.48]}
            material={neonMaterial}
          >
            <boxGeometry args={[0.22, 0.05, 0.025]} />
          </mesh>
        </group>

        <mesh
          position={[0, 2.25, 0]}
          material={suitMaterial}
        >
          <capsuleGeometry args={[0.62, 1.25, 8, 12]} />
        </mesh>

        <mesh
          position={[0, 2.35, -0.57]}
          material={armorMaterial}
        >
          <boxGeometry args={[0.88, 0.9, 0.16]} />
        </mesh>

        <mesh
          position={[0, 2.4, -0.67]}
          material={neonMaterial}
        >
          <boxGeometry args={[0.06, 0.65, 0.025]} />
        </mesh>

        <mesh
          position={[0, 1.65, 0]}
          material={beltMaterial}
        >
          <boxGeometry args={[1.08, 0.17, 0.68]} />
        </mesh>

        <group
          name="PLAYER_LEFT_ARM"
          position={[-0.78, 2.35, 0]}
        >
          <mesh material={armorMaterial}>
            <sphereGeometry args={[0.33, 10, 8]} />
          </mesh>

          <mesh
            position={[0, -0.55, 0]}
            material={suitMaterial}
          >
            <capsuleGeometry args={[0.2, 0.8, 8, 8]} />
          </mesh>

          <mesh
            position={[0, -1.05, 0]}
            material={gloveMaterial}
          >
            <sphereGeometry args={[0.23, 10, 8]} />
          </mesh>
        </group>

        <group
          name="PLAYER_RIGHT_ARM"
          position={[0.78, 2.35, 0]}
          rotation={[-0.65, 0, 0]}
        >
          <mesh material={armorMaterial}>
            <sphereGeometry args={[0.33, 10, 8]} />
          </mesh>

          <mesh
            position={[0, -0.55, 0]}
            material={suitMaterial}
          >
            <capsuleGeometry args={[0.2, 0.8, 8, 8]} />
          </mesh>

          <mesh
            position={[0, -1.05, 0]}
            material={gloveMaterial}
          >
            <sphereGeometry args={[0.23, 10, 8]} />
          </mesh>

          <group
            ref={gunRef}
            name="PLAYER_GUN"
            position={[-0.15, -0.85, -0.15]}
            rotation={[0, Math.PI, 0]}
          >
            <mesh material={gunMetal}>
              <boxGeometry args={[0.24, 0.22, 1.05]} />
            </mesh>

            <mesh
              position={[0, 0.13, -0.08]}
              material={gunDark}
            >
              <boxGeometry args={[0.17, 0.1, 0.75]} />
            </mesh>

            <mesh
              position={[0, 0, -0.72]}
              rotation={[Math.PI / 2, 0, 0]}
              material={gunDark}
            >
              <cylinderGeometry args={[0.045, 0.045, 0.65, 8]} />
            </mesh>

            <mesh
              position={[0, 0, -1.05]}
              rotation={[Math.PI / 2, 0, 0]}
              material={gunMetal}
            >
              <cylinderGeometry args={[0.075, 0.06, 0.18, 8]} />
            </mesh>

            <mesh
              position={[0, -0.28, -0.05]}
              rotation={[-0.15, 0, 0]}
              material={gunDark}
            >
              <boxGeometry args={[0.17, 0.5, 0.28]} />
            </mesh>

            <mesh
              position={[0, -0.3, 0.25]}
              rotation={[-0.25, 0, 0]}
              material={gunGrip}
            >
              <boxGeometry args={[0.17, 0.42, 0.2]} />
            </mesh>

            <mesh
              position={[0, 0.14, -0.1]}
              material={gunNeon}
            >
              <boxGeometry args={[0.045, 0.025, 0.55]} />
            </mesh>

            <mesh
              ref={muzzleFlashRef}
              visible={false}
              position={[0, 0, -1.18]}
              rotation={[0, 0, Math.PI / 2]}
              material={
                new THREE.MeshBasicMaterial({
                  color: "#fff1a0",
                  transparent: true,
                  opacity: 0.95,
                })
              }
            >
              <coneGeometry args={[0.15, 0.45, 8]} />
            </mesh>

            <pointLight
              ref={muzzleLightRef}
              position={[0, 0, -1.1]}
              intensity={0}
              distance={5}
              decay={2}
              color="#ff9b32"
            />
          </group>
        </group>

        <mesh
          position={[0, 3.05, 0]}
          material={skinDarkMaterial}
        >
          <cylinderGeometry args={[0.23, 0.27, 0.35, 10]} />
        </mesh>

        <mesh
          position={[0, 3.55, 0]}
          material={skinMaterial}
        >
          <sphereGeometry args={[0.5, 16, 14]} />
        </mesh>

        <mesh
          position={[0, 3.82, 0]}
          material={hairMaterial}
        >
          <sphereGeometry args={[0.53, 16, 12]} />
        </mesh>

        <mesh
          position={[-0.35, 3.75, -0.25]}
          rotation={[0.2, 0, -0.3]}
          material={hairMaterial}
        >
          <coneGeometry args={[0.2, 0.65, 7]} />
        </mesh>

        <mesh
          position={[0, 3.82, -0.4]}
          rotation={[0.25, 0, 0]}
          material={hairMaterial}
        >
          <coneGeometry args={[0.2, 0.7, 7]} />
        </mesh>

        <mesh
          position={[0.35, 3.75, -0.25]}
          rotation={[0.2, 0, 0.3]}
          material={hairMaterial}
        >
          <coneGeometry args={[0.2, 0.65, 7]} />
        </mesh>

        <mesh
          position={[-0.17, 3.55, -0.45]}
          material={neonMaterial}
        >
          <sphereGeometry args={[0.07, 8, 8]} />
        </mesh>

        <mesh
          position={[0.17, 3.55, -0.45]}
          material={neonMaterial}
        >
          <sphereGeometry args={[0.07, 8, 8]} />
        </mesh>
      </group>
    </group>
  );
}
