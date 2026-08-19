import React, { useEffect, useState } from "react";
import World from "./world";
import MobileControls from "./mobile/MobileControls";
import socket from "./socket";

const TOTAL_ENEMIES = 10;

export default function Game() {
const [helicopter, setHelicopter] = useState(false);
const [mobileMove, setMobileMove] = useState({ x: 0, y: 0 });
const [mobileSprint, setMobileSprint] = useState(false);
const [mobileJump, setMobileJump] = useState(false);
const [isMobile, setIsMobile] = useState(false);
const [showInstructions, setShowInstructions] = useState(true);
const [crosshair, setCrosshair] = useState({ x: 50, y: 50 });
const [enemiesKilled, setEnemiesKilled] = useState(0);
const [playerHealth, setPlayerHealth] = useState(100);
const [gameState, setGameState] = useState("playing");
const [gameTime, setGameTime] = useState(0);
const [backendConnected, setBackendConnected] = useState(false); useEffect(() => {
const handleConnect = () => { console.log("Connected to backend:", socket.id); setBackendConnected(true); };
const handleDisconnect = (reason) => { console.log("Backend disconnected:", reason); setBackendConnected(false);};
const handleBackendConnected = (data) => { console.log("Backend says connected:", data);};
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("backend-connected", handleBackendConnected);
if (socket.connected) { handleConnect();} return () => {
    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
    socket.off("backend-connected", handleBackendConnected);};}, []); useEffect(() => {
const checkMobile = () => {
const mobile = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0; setIsMobile(mobile);}; checkMobile(); window.addEventListener("resize", checkMobile);
return () => { window.removeEventListener("resize", checkMobile);};}, []); useEffect(() => { if (isMobile) return;
const handleMouseMove = (event) => { setCrosshair({
    x: (event.clientX / window.innerWidth) * 100,
    y: (event.clientY / window.innerHeight) * 100,});};
    window.addEventListener("mousemove", handleMouseMove);
return () => { window.removeEventListener("mousemove", handleMouseMove);};}, [isMobile]); useEffect(() => {
const handleEnemyKilled = () => { setEnemiesKilled((value) => value + 1);};
const handlePlayerDamage = (event) => {
const damage = Number( event.detail?.amount ?? event.detail?.damage ?? 0);
if (damage <= 0) return; setPlayerHealth((health) => Math.max(0, health - damage));};
    window.addEventListener("game-enemy-killed", handleEnemyKilled);
    window.addEventListener("game-player-damage", handlePlayerDamage);
return () => {
      window.removeEventListener("game-enemy-killed", handleEnemyKilled);
      window.removeEventListener("game-player-damage", handlePlayerDamage);};}, []); useEffect(() => {
const handleServerHealth = (data) => { if (data == null || data.health == null) return;
const health = Number(data.health); if (Number.isNaN(health)) return; setPlayerHealth(Math.max(0, Math.min(100, health)));};
const handleServerEnemyKilled = (data) => { console.log("Enemy killed by server:", data); setEnemiesKilled((value) => Math.min(TOTAL_ENEMIES, value + 1));};
const handleServerGameOver = () => { setGameState("gameover");};
const handleServerVictory = () => { setGameState("victory");};
    socket.on("player-health", handleServerHealth);
    socket.on("game-player-health", handleServerHealth);
    socket.on("enemy-killed", handleServerEnemyKilled);
    socket.on("game-enemy-killed", handleServerEnemyKilled);
    socket.on("game-over", handleServerGameOver);
    socket.on("game-victory", handleServerVictory);
return () => {
    socket.off("player-health", handleServerHealth);
    socket.off("game-player-health", handleServerHealth);
    socket.off("enemy-killed", handleServerEnemyKilled);
    socket.off("game-enemy-killed", handleServerEnemyKilled);
    socket.off("game-over", handleServerGameOver);
    socket.off("game-victory", handleServerVictory);};}, []);
useEffect(() => { if (gameState !== "playing") return;
const timer = setTimeout(() => { setShowInstructions(false);}, 10000);
return () => clearTimeout(timer);}, [gameState]); useEffect(() => {
const handleKeyDown = (event) => {if (event.code !== "KeyV" || event.repeat) return; setHelicopter(true);};
const handleKeyUp = (event) => { if (event.code !== "KeyV") return; setHelicopter(false);};
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);};}, []);
useEffect(() => { if (gameState !== "playing") return;
const timer = setInterval(() => { setGameTime((time) => time + 1);}, 1000);
return () => clearInterval(timer);}, [gameState]); useEffect(() => {
if (enemiesKilled >= TOTAL_ENEMIES && gameState === "playing") { setGameState("victory");}}, [enemiesKilled, gameState]); useEffect(() => {
if (playerHealth <= 0 && gameState === "playing") { setGameState("gameover");}}, [playerHealth, gameState]);
const restartGame = () => {
    setEnemiesKilled(0);
    setPlayerHealth(100);
    setGameTime(0);
    setHelicopter(false);
    setMobileMove({ x: 0, y: 0 });
    setMobileSprint(false);
    setMobileJump(false);
    setCrosshair({ x: 50, y: 50 });
    setShowInstructions(true);
    setGameState("playing");
if (socket.connected) { socket.emit("game-restart"); console.log("Game restart sent to backend");}};
const formatTime = (seconds) => {
const minutes = Math.floor(seconds / 60);
const remainingSeconds = seconds % 60;
return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;};
const healthPercent = Math.max(0, Math.min(100, playerHealth));
const healthColor =
    healthPercent > 60
      ? "#35e879"
      : healthPercent > 30
      ? "#ffc247"
      : "#ff243f";
return (<div style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#05070b",}}>
{gameState === "playing" && (<World
        mobileMove={mobileMove}
        mobileSprint={mobileSprint}
        mobileJump={mobileJump}
        helicopter={helicopter}/>)}
{gameState === "playing" && (<div style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        pointerEvents: "none",
        color: "#fff",
        fontFamily: "Arial, Helvetica, sans-serif",}}>
<div style={{
        position: "absolute",
        top: 75,
        right: 20,
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "6px 10px",
        borderRadius: 20,
        background: "rgba(5,8,15,0.75)",
        border: "1px solid rgba(255,255,255,0.1)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.5,}}>
<span style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: backendConnected ? "#35e879" : "#ff4057",
        boxShadow: backendConnected
          ? "0 0 8px #35e879"
          : "0 0 8px #ff4057",}} />
{backendConnected ? "SERVER ONLINE" : "SERVER OFFLINE"} </div> <div
          style={{
          position: "absolute",
          top: 20,
          left: 20,
          minWidth: 205,
          padding: "14px 17px",
          borderRadius: 12,
          background: "rgba(5,8,15,0.82)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",}}>
<div style={{
         fontSize: 11,
         color: "#7f8da3",
         letterSpacing: 1.5,
         marginBottom: 5,}}>  MISSION </div>
<div style={{
         fontSize: 15,
         fontWeight: 800,}}> SURVIVE THE CITY </div>
<div style={{
        marginTop: 10,
        fontSize: 13,
        color: "#ff5368", }}> 👾 Enemies: <strong>{enemiesKilled}</strong> /{" "} {TOTAL_ENEMIES} </div> </div>
<div style={{
        position: "absolute",
        top: 20,
        right: 20,
        padding: "13px 16px",
        minWidth: 90,
        borderRadius: 12,
        background: "rgba(5,8,15,0.82)",
        border: "1px solid rgba(255,255,255,0.12)",
        textAlign: "right",}} >
<div style={{
       fontSize: 10,
       color: "#7f8da3",
       letterSpacing: 1,}}> TIME </div>
<div style={{ fontSize: 18, fontWeight: 800,}}> {formatTime(gameTime)}</div> </div> {helicopter && (
<div style={{
       position: "absolute",
       top: 110,
       left: "50%",
       transform: "translateX(-50%)",
       padding: "8px 15px",
       borderRadius: 20,
       background: "rgba(20,100,255,0.25)",
       border: "1px solid rgba(80,170,255,0.65)",
       color: "#73c7ff",
       fontSize: 12,
       fontWeight: 800,
       letterSpacing: 1,}}> 🚁 HELICOPTER SHOT </div>)}
<div style={{
       position: "absolute",
       left: isMobile ? "50%" : `${crosshair.x}%`,
       top: isMobile ? "50%" : `${crosshair.y}%`,
       transform: "translate(-50%, -50%)",
       width: 30,
       height: 30,
       display: "flex",
       alignItems: "center",
       justifyContent: "center",
       color: "#fff",
       fontSize: 28,
       fontWeight: 300,
       lineHeight: 1,
       textShadow: "0 0 4px #000, 0 0 10px #000",}}>  + </div>
<div style={{
       position: "absolute",
       left: 24,
       bottom: 25,
       width: isMobile ? 190 : 230,
       padding: "12px 14px",
       borderRadius: 10,
       background: "rgba(5,8,15,0.82)",
       border: "1px solid rgba(255,255,255,0.1)",
       boxShadow: playerHealth <= 30
                  ? "0 0 20px rgba(255,35,63,0.25)"
                  : "none",}}>
<div style={{
       display: "flex",
       justifyContent: "space-between",
       marginBottom: 7,
       fontSize: 12,
       fontWeight: 700,}}>
<span>❤️ HEALTH</span> <span style={{ color: healthColor }}> {playerHealth} </span> </div>
<div style={{
       width: "100%",
       height: 8,
       borderRadius: 10,
       overflow: "hidden",
       background: "rgba(255,255,255,0.12)",}}>
<div style={{
       width: `${healthPercent}%`,
       height: "100%",
       borderRadius: 10,
       background:
       healthPercent > 60
       ? "linear-gradient(90deg,#22c55e,#35e879)"
       : healthPercent > 30
       ? "linear-gradient(90deg,#f59e0b,#ffc247)"
       : "linear-gradient(90deg,#ff243f,#ff6375)",
       transition: "width 0.2s ease, background 0.2s ease",}} /> </div> {playerHealth <= 30 && playerHealth > 0 && (
<div style={{
       marginTop: 7,
       color: "#ff5368",
       fontSize: 10,
       fontWeight: 800,
       letterSpacing: 1,
       textAlign: "center",}}>  ⚠ LOW HEALTH </div>)} </div> </div>)} {gameState === "playing" && showInstructions && (
<div style={{
       position: "fixed",
       top: isMobile ? 115 : 145,
       left: 24,
       zIndex: 1000,
       width: isMobile ? 245 : 305,
       padding: "18px 20px",
       borderRadius: 14,
       background: "rgba(5,8,15,0.94)",
       border: "1px solid rgba(90,170,255,0.38)",
       boxShadow: "0 10px 35px rgba(0,0,0,0.5)",
       color: "#fff",
       fontFamily: "Arial, Helvetica, sans-serif", }}>
<div style={{
       color: "#59b7ff",
       fontSize: 18,
       fontWeight: 800,
       marginBottom: 15, }}>  🎮 GAME CONTROLS </div>
<ControlRow icon="🕹️" text={ isMobile  ? "Joystick — Move" : "W A S D / Arrow Keys — Move" }/>
<ControlRow icon="🏃" text={isMobile ? "Sprint Button — Sprint" : "Shift — Sprint"} />
<ControlRow icon="⬆️" text={isMobile ? "Jump Button — Jump" : "Space — Jump"} />
<ControlRow icon="🔫" text={isMobile ? "Shoot Button — Shoot"  : "Mouse + Left Click — Shoot" } />
<ControlRow  icon="🚁" text={isMobile  ? "Helicopter Button"  : "V — Helicopter Shot" } />
<ControlRow
            icon="🎥"
            text={isMobile ? "Swipe — Camera" : "Mouse — Camera"}
          />

<div
            style={{
              marginTop: 15,
              paddingTop: 12,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              color: "#aeb8c9",
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            💡 <strong>Mission:</strong> Aim at enemies and shoot them.
            Survive until all enemies are eliminated.
          </div>

          <button
            onClick={() => setShowInstructions(false)}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 25,
              height: 25,
              border: "none",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            ×
          </button>
        </div>
      )}

      {gameState === "playing" && !showInstructions && (
        <button
          onClick={() => setShowInstructions(true)}
          style={{
            position: "fixed",
            top: isMobile ? 115 : 145,
            left: 20,
            zIndex: 1000,
            padding: "10px 14px",
            border: "1px solid rgba(90,170,255,0.4)",
            borderRadius: 10,
            background: "rgba(5,8,15,0.85)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          🎮 Controls
        </button>
      )}

      {isMobile && gameState === "playing" && (
        <MobileControls
          onMove={(x, y) => {
            setMobileMove({ x, y });
          }}
          onJump={setMobileJump}
          onSprint={setMobileSprint}
          onHelicopter={() => {
            setHelicopter((value) => !value);
          }}
        />
      )}

      {gameState !== "playing" && (
        <GameEndScreen
          victory={gameState === "victory"}
          enemiesKilled={enemiesKilled}
          gameTime={gameTime}
          onRestart={restartGame}
        />
      )}
    </div>
  );
}

function ControlRow({ icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
        fontSize: 14,
      }}
    >
      <span
        style={{
          width: 27,
          flexShrink: 0,
          fontSize: 19,
          textAlign: "center",
        }}
      >
        {icon}
      </span>

      <span>{text}</span>
    </div>
  );
}

function GameEndScreen({
  victory,
  enemiesKilled,
  gameTime,
  onRestart,
}) {
  const minutes = Math.floor(gameTime / 60);
  const seconds = gameTime % 60;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at center, rgba(25,35,55,0.96), rgba(2,4,8,0.99))",
        color: "#fff",
        textAlign: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "min(450px, 100%)",
          padding: "45px 30px",
          borderRadius: 20,
          background: "rgba(10,14,23,0.95)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.65)",
        }}
      >
        <div
          style={{
            fontSize: 64,
            marginBottom: 12,
          }}
        >
          {victory ? "🏆" : "💀"}
        </div>

        <h1
          style={{
            margin: "0 0 10px",
            fontSize: 38,
            letterSpacing: 3,
            color: victory ? "#ffd34e" : "#ff4057",}}> {victory ? "VICTORY!" : "GAME OVER"}</h1>
<p style={{
            margin: "0 0 25px",
            color: "#8d98aa",
            fontSize: 14,}}>
          {victory
            ? "You survived the city and completed the mission."
            : "You were eliminated. Try again."} </p>

<div style={{
            display: "flex",
            justifyContent: "center",
            gap: 45,
            marginBottom: 30,}}>
<div>
<div style={{
                color: "#7d879a",
                fontSize: 11,
}}>  ENEMIES </div><strong style={{ fontSize: 22 }}> {enemiesKilled}</strong></div><div>
<div style={{
                color: "#7d879a",
                fontSize: 11,}}> TIME </div>
<strong style={{ fontSize: 22 }}>
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")} </strong> </div> </div>
<button onClick={onRestart} style={{
            width: "100%",
            padding: 14,
            border: "none",
            borderRadius: 10,
            background:"linear-gradient(135deg,#267cff,#1554c7)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1,
            cursor: "pointer",}}> 
 🔄 PLAY AGAIN </button> </div> </div>);}