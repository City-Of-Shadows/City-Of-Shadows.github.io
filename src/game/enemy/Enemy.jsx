import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function Enemy({ position = [15, 0, 10], playerRef = null, enemyIndex = 0, health: initialHealth = 100, speed = 3.5 }) {
  const enemyRef = useRef(null);
  const characterRef = useRef(null);
  const healthBarRef = useRef(null);
  const gunRef = useRef(null);
  const muzzleRef = useRef(null);
  const muzzleLightRef = useRef(null);
  const velocityY = useRef(0);
  const attackTimer = useRef(0);
  const shootTimer = useRef(0);
  const muzzleTimer = useRef(0);
  const hitTimer = useRef(0);
  const deathTimer = useRef(0);
  const killReportedRef = useRef(false);
  const deadRef = useRef(false);
  const { camera } = useThree();
  const [health, setHealth] = useState(Math.max(0, Number(initialHealth) || 100));
  const MAX_HEALTH = Math.max(1, Number(initialHealth) || 100);
  const GRAVITY = 25;
  const CHASE_DISTANCE = 100;
  const SHOOT_DISTANCE = 32;
  const STOP_DISTANCE = 14;
  const ATTACK_DISTANCE = 2.2;
  const SHOOT_DELAY = 0.9;
  const SHOOT_DAMAGE = 8;
  const ATTACK_DELAY = 1.0;
  const ATTACK_DAMAGE = 10;
  const ROTATION_SPEED = 7;
  const DEATH_TIME = 1.25;
  const spawnPosition = useMemo(() => { return [Number(position?.[0]) || 0, Number(position?.[1]) || 0, Number(position?.[2]) || 0]; }, [position]);
  const { skinMaterial, skinDarkMaterial, shirtMaterial, shirtDarkMaterial, pantsMaterial, bootMaterial, hairMaterial, metalMaterial, enemyNeonMaterial, eyeMaterial, gunMetalMaterial, gunDarkMaterial, gunGripMaterial, bulletMaterial } = useMemo(() => { return { skinMaterial: new THREE.MeshStandardMaterial({ color: "#b85f4a", roughness: 0.8 }), skinDarkMaterial: new THREE.MeshStandardMaterial({ color: "#70392f", roughness: 0.85 }), shirtMaterial: new THREE.MeshStandardMaterial({ color: "#57202b", roughness: 0.7 }), shirtDarkMaterial: new THREE.MeshStandardMaterial({ color: "#250d14", roughness: 0.75 }), pantsMaterial: new THREE.MeshStandardMaterial({ color: "#171a21", roughness: 0.8 }), bootMaterial: new THREE.MeshStandardMaterial({ color: "#050608", roughness: 0.35, metalness: 0.3 }), hairMaterial: new THREE.MeshStandardMaterial({ color: "#090909", roughness: 0.7 }), metalMaterial: new THREE.MeshStandardMaterial({ color: "#30343d", roughness: 0.3, metalness: 0.8 }), enemyNeonMaterial: new THREE.MeshStandardMaterial({ color: "#ff283d", emissive: "#ff1028", emissiveIntensity: 3, roughness: 0.25 }), eyeMaterial: new THREE.MeshBasicMaterial({ color: "#ff253c" }), gunMetalMaterial: new THREE.MeshStandardMaterial({ color: "#363c46", metalness: 0.9, roughness: 0.25 }), gunDarkMaterial: new THREE.MeshStandardMaterial({ color: "#07090c", metalness: 0.65, roughness: 0.28 }), gunGripMaterial: new THREE.MeshStandardMaterial({ color: "#11151b", roughness: 0.7 }), bulletMaterial: new THREE.MeshBasicMaterial({ color: "#ff3048" }) }; }, []);

  useEffect(() => {
    return () => {
      skinMaterial.dispose();
      skinDarkMaterial.dispose();
      shirtMaterial.dispose();
      shirtDarkMaterial.dispose();
      pantsMaterial.dispose();
      bootMaterial.dispose();
      hairMaterial.dispose();
      metalMaterial.dispose();
      enemyNeonMaterial.dispose();
      eyeMaterial.dispose();
      gunMetalMaterial.dispose();
      gunDarkMaterial.dispose();
      gunGripMaterial.dispose();
      bulletMaterial.dispose();
    };
  }, [skinMaterial, skinDarkMaterial, shirtMaterial, shirtDarkMaterial, pantsMaterial, bootMaterial, hairMaterial, metalMaterial, enemyNeonMaterial, eyeMaterial, gunMetalMaterial, gunDarkMaterial, gunGripMaterial, bulletMaterial]);

  const reportEnemyKilled = () => {
    if (killReportedRef.current) { return; }
    killReportedRef.current = true;
    const enemy = enemyRef.current;
    if (enemy) {
      enemy.userData.isDead = true;
      enemy.userData.killReported = true;
    }
    const eventDetail = { enemy, enemyId: enemy?.userData?.enemyId ?? null, enemyIndex: enemy?.userData?.enemyIndex ?? enemyIndex };
    window.dispatchEvent(new CustomEvent("enemy-killed", { detail: eventDetail }));
    window.dispatchEvent(new CustomEvent("game-enemy-killed", { detail: eventDetail }));
  };

  const takeDamage = (amount = 10) => {
    if (deadRef.current) { return; }
    const damage = Math.max(0, Number(amount) || 0);
    if (damage <= 0) { return; }
    hitTimer.current = 0.12;
    setHealth((currentHealth) => {
      if (deadRef.current || currentHealth <= 0) { return currentHealth; }
      const newHealth = Math.max(0, currentHealth - damage);
      if (newHealth <= 0) {
        deadRef.current = true;
        deathTimer.current = 0;
        reportEnemyKilled();
      }
      return newHealth;
    });
  };

  useEffect(() => {
    const enemy = enemyRef.current;
    if (!enemy) { return; }
    const enemyId = THREE.MathUtils.generateUUID();
    enemy.userData.enemyId = enemyId;
    enemy.userData.enemyIndex = enemyIndex;
    enemy.userData.isEnemy = true;
    enemy.userData.enemy = true;
    enemy.userData.takeDamage = takeDamage;
    enemy.userData.health = health;
    enemy.userData.maxHealth = MAX_HEALTH;
    enemy.userData.isDead = false;
    enemy.userData.killReported = false;
    return () => {
      delete enemy.userData.takeDamage;
      delete enemy.userData.isEnemy;
      delete enemy.userData.enemy;
    };
  }, []);

  useEffect(() => {
    const enemy = enemyRef.current;
    if (!enemy) { return; }
    enemy.userData.health = health;
    enemy.userData.maxHealth = MAX_HEALTH;
    enemy.userData.isDead = deadRef.current;
    enemy.userData.killReported = killReportedRef.current;
  }, [health]);

  useEffect(() => {
    if (!characterRef.current) { return; }
    characterRef.current.traverse((object) => {
      if (object.isMesh && object.material && object.material.emissive) {
        object.userData.originalEmissive = object.material.emissive.clone();
        object.userData.originalIntensity = object.material.emissiveIntensity;
      }
    });
  }, []);

  const aimAtPlayer = (enemy, player) => {
    const playerPosition = new THREE.Vector3();
    player.getWorldPosition(playerPosition);
    const direction = new THREE.Vector3().subVectors(playerPosition, enemy.position);
    direction.y = 0;
    if (direction.lengthSq() < 0.0001) { return; }
    direction.normalize();
    const targetRotation = Math.atan2(direction.x, direction.z);
    let rotationDifference = targetRotation - enemy.rotation.y;
    rotationDifference = Math.atan2(Math.sin(rotationDifference), Math.cos(rotationDifference));
    enemy.rotation.y += rotationDifference * Math.min(1, 0.12 * 7);
  };

  const damagePlayer = () => {
    if (deadRef.current || !playerRef?.current) { return; }
    const player = playerRef.current;
    const takePlayerDamage = player.userData?.takeDamage;
    if (typeof takePlayerDamage === "function") {
      takePlayerDamage(SHOOT_DAMAGE);
      return;
    }
    window.dispatchEvent(new CustomEvent("player-damage", { detail: { damage: SHOOT_DAMAGE, amount: SHOOT_DAMAGE, enemy: enemyRef.current } }));
    window.dispatchEvent(new CustomEvent("game-player-damage", { detail: { damage: SHOOT_DAMAGE, amount: SHOOT_DAMAGE, enemy: enemyRef.current } }));
  };

  const shootPlayer = () => {
    if (deadRef.current || !enemyRef.current || !playerRef?.current) { return; }
    if (shootTimer.current > 0) { return; }
    const enemy = enemyRef.current;
    const player = playerRef.current;
    shootTimer.current = SHOOT_DELAY;
    muzzleTimer.current = 0.1;
    if (muzzleRef.current) { muzzleRef.current.visible = true; }
    if (muzzleLightRef.current) { muzzleLightRef.current.intensity = 8; }
    const origin = new THREE.Vector3();
    if (muzzleRef.current) {
      muzzleRef.current.getWorldPosition(origin);
    } else if (gunRef.current) {
      gunRef.current.getWorldPosition(origin);
    } else {
      origin.copy(enemy.position);
      origin.y += 2.5;
    }
    const target = new THREE.Vector3();
    player.getWorldPosition(target);
    target.y += 1.3;
    const direction = new THREE.Vector3().subVectors(target, origin);
    if (direction.lengthSq() < 0.0001) { return; }
    direction.normalize();
    const raycaster = new THREE.Raycaster();
    raycaster.set(origin, direction);
    raycaster.far = SHOOT_DISTANCE + 5;
    const hits = raycaster.intersectObject(player, true);
    if (hits.length > 0) { damagePlayer(); }
    const scene = enemy.parent;
    if (scene) {
      const bulletLength = Math.min(SHOOT_DISTANCE, origin.distanceTo(target));
      const geometry = new THREE.CylinderGeometry(0.025, 0.025, bulletLength, 6);
      const bullet = new THREE.Mesh(geometry, bulletMaterial);
      bullet.position.copy(origin).add(direction.clone().multiplyScalar(bulletLength / 2));
      bullet.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      scene.add(bullet);
      setTimeout(() => {
        if (bullet.parent) { bullet.parent.remove(bullet); }
        geometry.dispose();
      }, 80);
    }
  };

  useFrame((state, delta) => {
    const enemy = enemyRef.current;
    if (!enemy) { return; }
    const dt = Math.min(delta, 0.05);
    if (attackTimer.current > 0) { attackTimer.current -= dt; }
    if (shootTimer.current > 0) { shootTimer.current -= dt; }
    if (hitTimer.current > 0) { hitTimer.current -= dt; }
    if (muzzleTimer.current > 0) { muzzleTimer.current -= dt; }
    if (muzzleRef.current) { muzzleRef.current.visible = muzzleTimer.current > 0; }
    if (muzzleLightRef.current) { muzzleLightRef.current.intensity = THREE.MathUtils.lerp(muzzleLightRef.current.intensity, 0, dt * 25); }

    if (deadRef.current) {
      deathTimer.current += dt;
      enemy.userData.isDead = true;
      enemy.rotation.z = THREE.MathUtils.lerp(enemy.rotation.z, -Math.PI / 2, dt * 6);
      enemy.position.y = Math.max(0, enemy.position.y - 1.5 * dt);
      if (characterRef.current) {
        const scale = THREE.MathUtils.lerp(characterRef.current.scale.x, 0.85, dt * 4);
        characterRef.current.scale.set(scale, scale, scale);
      }
      if (deathTimer.current >= DEATH_TIME) { enemy.visible = false; }
      return;
    }

    if (!playerRef?.current) { return; }
    const player = playerRef.current;
    const playerPosition = new THREE.Vector3();
    player.getWorldPosition(playerPosition);
    if (enemy.parent) { enemy.parent.worldToLocal(playerPosition); }
    const direction = new THREE.Vector3().subVectors(playerPosition, enemy.position);
    const distance = direction.length();

    if (distance > CHASE_DISTANCE) {
      velocityY.current -= GRAVITY * dt;
      enemy.position.y += velocityY.current * dt;
      if (enemy.position.y <= 0) {
        enemy.position.y = 0;
        velocityY.current = 0;
      }
      return;
    }

    const shouldMove = distance > STOP_DISTANCE && distance > SHOOT_DISTANCE;
    if (shouldMove) {
      direction.y = 0;
      if (direction.lengthSq() > 0.0001) {
        direction.normalize();
        enemy.position.x += direction.x * speed * dt;
        enemy.position.z += direction.z * speed * dt;
        const targetRotation = Math.atan2(direction.x, direction.z);
        let rotationDifference = targetRotation - enemy.rotation.y;
        rotationDifference = Math.atan2(Math.sin(rotationDifference), Math.cos(rotationDifference));
        enemy.rotation.y += rotationDifference * Math.min(1, dt * ROTATION_SPEED);
        if (characterRef.current) {
          const time = state.clock.elapsedTime * 9;
          const swing = Math.sin(time);
          const opposite = Math.sin(time + Math.PI);
          const leftArm = characterRef.current.getObjectByName("ENEMY_LEFT_ARM");
          const rightArm = characterRef.current.getObjectByName("ENEMY_RIGHT_ARM");
          const leftLeg = characterRef.current.getObjectByName("ENEMY_LEFT_LEG");
          const rightLeg = characterRef.current.getObjectByName("ENEMY_RIGHT_LEG");
          if (leftArm) { leftArm.rotation.x = swing * 0.35; }
          if (rightArm) { rightArm.rotation.x = opposite * 0.35; }
          if (leftLeg) { leftLeg.rotation.x = opposite * 0.45; }
          if (rightLeg) { rightLeg.rotation.x = swing * 0.45; }
          characterRef.current.position.y = Math.abs(Math.sin(time)) * 0.04;
        }
      }
    }

    if (distance <= SHOOT_DISTANCE) {
      aimAtPlayer(enemy, player);
      const leftArm = characterRef.current?.getObjectByName("ENEMY_LEFT_ARM");
      const rightArm = characterRef.current?.getObjectByName("ENEMY_RIGHT_ARM");
      if (leftArm) { leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, -0.55, dt * 6); }
      if (rightArm) { rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, -0.7, dt * 6); }
      shootPlayer();
    }

    if (distance <= ATTACK_DISTANCE && attackTimer.current <= 0) {
      attackTimer.current = ATTACK_DELAY;
      shootTimer.current = 0.25;
      const takePlayerDamage = player.userData?.takeDamage;
      if (typeof takePlayerDamage === "function") {
        takePlayerDamage(ATTACK_DAMAGE);
      } else {
        window.dispatchEvent(new CustomEvent("player-damage", { detail: { damage: ATTACK_DAMAGE, amount: ATTACK_DAMAGE, enemy } }));
        window.dispatchEvent(new CustomEvent("game-player-damage", { detail: { damage: ATTACK_DAMAGE, amount: ATTACK_DAMAGE, enemy } }));
      }
    }

    velocityY.current -= GRAVITY * dt;
    enemy.position.y += velocityY.current * dt;
    if (enemy.position.y <= 0) {
      enemy.position.y = 0;
      velocityY.current = 0;
    }

    if (healthBarRef.current) {
      const healthPercent = THREE.MathUtils.clamp(health / MAX_HEALTH, 0, 1);
      healthBarRef.current.scale.x = healthPercent;
      healthBarRef.current.position.x = -(1.5 * (1 - healthPercent)) / 2;
    }

    const healthBar = enemy.getObjectByName("ENEMY_HEALTH_BAR");
    if (healthBar) { healthBar.quaternion.copy(camera.quaternion); }

    if (hitTimer.current > 0) {
      characterRef.current?.traverse((object) => {
        if (object.isMesh && object.material && object.material.emissive) {
          object.material.emissive.set("#ffffff");
          object.material.emissiveIntensity = 5;
        }
      });
    } else {
      characterRef.current?.traverse((object) => {
        if (object.isMesh && object.material && object.material.emissive && object.userData.originalEmissive) {
          object.material.emissive.copy(object.userData.originalEmissive);
          object.material.emissiveIntensity = object.userData.originalIntensity ?? 0;
        }
      });
    }
  });

  const healthPercent = THREE.MathUtils.clamp(health / MAX_HEALTH, 0, 1);

  return (
    <group ref={enemyRef} name={`ENEMY_${enemyIndex}`} position={spawnPosition} userData={{ takeDamage, health, maxHealth: MAX_HEALTH, isEnemy: true, enemy: true, enemyIndex, isDead: false, killReported: false }}>
      <pointLight position={[0, 2.5, 0]} intensity={1.2} distance={6} decay={2} color="#ff1738" />
      <group ref={characterRef}>
        <group name="ENEMY_LEFT_LEG" position={[-0.27, 1, 0]}>
          <mesh material={pantsMaterial} castShadow>
            <capsuleGeometry args={[0.23, 1, 8, 10]} />
          </mesh>
          <mesh position={[0, -0.65, -0.12]} material={bootMaterial} castShadow>
            <boxGeometry args={[0.44, 0.44, 0.72]} />
          </mesh>
          <mesh position={[0, -0.48, -0.49]} material={enemyNeonMaterial}>
            <boxGeometry args={[0.22, 0.05, 0.025]} />
          </mesh>
        </group>
        <group name="ENEMY_RIGHT_LEG" position={[0.27, 1, 0]}>
          <mesh material={pantsMaterial} castShadow>
            <capsuleGeometry args={[0.23, 1, 8, 10]} />
          </mesh>
          <mesh position={[0, -0.65, -0.12]} material={bootMaterial} castShadow>
            <boxGeometry args={[0.44, 0.44, 0.72]} />
          </mesh>
          <mesh position={[0, -0.48, -0.49]} material={enemyNeonMaterial}>
            <boxGeometry args={[0.22, 0.05, 0.025]} />
          </mesh>
        </group>
        <mesh position={[0, 2.25, 0]} material={shirtMaterial} castShadow>
          <capsuleGeometry args={[0.63, 1.25, 8, 12]} />
        </mesh>
        <mesh position={[0, 2.35, -0.57]} material={shirtDarkMaterial} castShadow>
          <boxGeometry args={[0.85, 0.9, 0.15]} />
        </mesh>
        <mesh position={[0, 2.4, -0.67]} material={enemyNeonMaterial}>
          <boxGeometry args={[0.06, 0.65, 0.025]} />
        </mesh>
        <mesh position={[0, 1.65, 0]} material={metalMaterial}>
          <boxGeometry args={[1.05, 0.16, 0.65]} />
        </mesh>
        <group name="ENEMY_LEFT_ARM" position={[-0.8, 2.25, 0]}>
          <mesh material={shirtMaterial}>
            <sphereGeometry args={[0.32, 10, 8]} />
          </mesh>
          <mesh position={[0, -0.55, 0]} material={shirtMaterial}>
            <capsuleGeometry args={[0.2, 0.8, 8, 8]} />
          </mesh>
          <mesh position={[0, -1.05, 0]} material={skinMaterial}>
            <sphereGeometry args={[0.23, 10, 8]} />
          </mesh>
        </group>
        <group name="ENEMY_RIGHT_ARM" position={[0.8, 2.25, 0]}>
          <mesh material={shirtMaterial}>
            <sphereGeometry args={[0.32, 10, 8]} />
          </mesh>
          <mesh position={[0, -0.55, 0]} material={shirtMaterial}>
            <capsuleGeometry args={[0.2, 0.8, 8, 8]} />
          </mesh>
          <mesh position={[0, -1.05, 0]} material={skinMaterial}>
            <sphereGeometry args={[0.23, 10, 8]} />
          </mesh>
          <group ref={gunRef} name="ENEMY_GUN" position={[0, -0.82, -0.25]} rotation={[0, Math.PI, 0]}>
            <mesh material={gunMetalMaterial} castShadow>
              <boxGeometry args={[0.25, 0.23, 1.0]} />
            </mesh>
            <mesh position={[0, 0.13, -0.08]} material={gunDarkMaterial}>
              <boxGeometry args={[0.17, 0.1, 0.72]} />
            </mesh>
            <mesh position={[0, 0, -0.75]} rotation={[Math.PI / 2, 0, 0]} material={gunDarkMaterial}>
              <cylinderGeometry args={[0.045, 0.045, 0.7, 8]} />
            </mesh>
            <mesh position={[0, 0, -1.12]} rotation={[Math.PI / 2, 0, 0]} material={gunMetalMaterial}>
              <cylinderGeometry args={[0.075, 0.06, 0.18, 8]} />
            </mesh>
            <mesh position={[0, -0.3, 0.2]} rotation={[-0.25, 0, 0]} material={gunGripMaterial}>
              <boxGeometry args={[0.17, 0.45, 0.2]} />
            </mesh>
            <mesh position={[0, 0.14, -0.12]} material={enemyNeonMaterial}>
              <boxGeometry args={[0.045, 0.025, 0.55]} />
            </mesh>
            <mesh ref={muzzleRef} visible={false} position={[0, 0, -1.2]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.16, 0.5, 8]} />
              <meshBasicMaterial color="#ffd36a" transparent opacity={0.95} />
            </mesh>
            <pointLight ref={muzzleLightRef} position={[0, 0, -1.15]} intensity={0} distance={5} decay={2} color="#ff3040" />
          </group>
        </group>
        <mesh position={[0, 3.05, 0]} material={skinDarkMaterial}>
          <cylinderGeometry args={[0.23, 0.27, 0.35, 10]} />
        </mesh>
        <mesh position={[0, 3.55, 0]} material={skinMaterial} castShadow>
          <sphereGeometry args={[0.5, 16, 14]} />
        </mesh>
        <mesh position={[0, 3.82, 0]} material={hairMaterial}>
          <sphereGeometry args={[0.53, 16, 12]} />
        </mesh>
        <mesh position={[-0.35, 3.75, -0.25]} rotation={[0.2, 0, -0.3]} material={hairMaterial}>
          <coneGeometry args={[0.2, 0.65, 7]} />
        </mesh>
        <mesh position={[0, 3.82, -0.4]} rotation={[0.25, 0, 0]} material={hairMaterial}>
          <coneGeometry args={[0.2, 0.7, 7]} />
        </mesh>
        <mesh position={[0.35, 3.75, -0.25]} rotation={[0.2, 0, 0.3]} material={hairMaterial}>
          <coneGeometry args={[0.2, 0.65, 7]} />
        </mesh>
        <mesh position={[-0.17, 3.55, -0.45]} material={eyeMaterial}>
          <sphereGeometry args={[0.07, 8, 8]} />
        </mesh>
        <mesh position={[0.17, 3.55, -0.45]} material={eyeMaterial}>
          <sphereGeometry args={[0.07, 8, 8]} />
        </mesh>
        <pointLight position={[0, 3.55, -0.6]} intensity={1.5} distance={2} decay={2} color="#ff1738" />
        <mesh position={[-0.73, 2.45, -0.25]} material={enemyNeonMaterial}>
          <boxGeometry args={[0.12, 0.3, 0.08]} />
        </mesh>
        <mesh position={[0.73, 2.45, -0.25]} material={enemyNeonMaterial}>
          <boxGeometry args={[0.12, 0.3, 0.08]} />
        </mesh>
      </group>
      <group name="ENEMY_HEALTH_BAR" position={[0, 4.45, 0]}>
        <mesh>
          <planeGeometry args={[1.5, 0.13]} />
          <meshBasicMaterial color="#260006" depthTest={false} depthWrite={false} />
        </mesh>
        <mesh ref={healthBarRef} position={[-(1.5 * (1 - healthPercent)) / 2, 0, 0.01]} scale={[healthPercent, 1, 1]}>
          <planeGeometry args={[1.5, 0.09]} />
          <meshBasicMaterial color="#ff203d" depthTest={false} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
