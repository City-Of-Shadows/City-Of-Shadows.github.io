import React,{Suspense,useEffect,useRef,useState} from "react";
import {Canvas,useThree} from "@react-three/fiber";
import * as THREE from "three";
import City from "./city/City.jsx";
import ThirdPersonCamera from "./components/ThirdPersonCamera.jsx";
import Player from "./player/Player.jsx";
import Enemy from "./enemy/Enemy.jsx";
import OtherPlayer from "./player/OtherPlayer.jsx";
import PlayerStatsProvider from "./player/PlayerStats.jsx";
import socket from "./socket.js";

export default function World({mobileMove={x:0,y:0},mobileSprint=false,mobileJump=false,helicopter=false}) {
const playerRef=useRef(null);
const [otherPlayers,setOtherPlayers]=useState({});
const isMobile=typeof window!=="undefined"&&(window.matchMedia("(pointer: coarse)").matches||navigator.maxTouchPoints>0);
const enemyPositions=[
    [-50,0,50],[-30,0,30],[-170,0,90],[-160,0,80],
    [50,0,-50],[30,0,-30],[170,0,-160],[160,0,-180],
    [150,0,-150],[-150,0,150]];
const TOTAL_ENEMIES=enemyPositions.length; useEffect(() => { if (!socket) { console.error("Socket is not available."); return;}
const handlePlayersList=(players) => { if (!Array.isArray(players)) return;
const playerMap={}; players.forEach((player) => {
if (player&&player.socketId&&player.socketId!==socket.id) { playerMap[player.socketId]=player;}}); setOtherPlayers(playerMap);};
const handlePlayerJoined=(player) => { if (!player||!player.socketId||player.socketId===socket.id) 
return; setOtherPlayers((currentPlayers) => ({ ...currentPlayers, [player.socketId]:player}));};
const handlePlayerPosition=(data) => {if (!data||!data.socketId||data.socketId===socket.id) return; setOtherPlayers((currentPlayers) => {
const existingPlayer=currentPlayers[data.socketId]; if (!existingPlayer) {
return { ...currentPlayers, [data.socketId]:{
              socketId:data.socketId,
              userId:data.userId,
              username:data.username,
              position:data.position||{x:0,y:0,z:0},
              rotation:data.rotation||{x:0,y:0,z:0}}};}
return { ...currentPlayers,[data.socketId]:{
         ...existingPlayer,
            position:data.position||existingPlayer.position,
            rotation:data.rotation||existingPlayer.rotation}};});};
const handlePlayerLeft=(data) => { if (!data?.socketId) return; setOtherPlayers((currentPlayers) => {
const updatedPlayers={...currentPlayers}; delete updatedPlayers[data.socketId]; return updatedPlayers;});};
    socket.on("players-list",handlePlayersList);
    socket.on("player-joined",handlePlayerJoined);
    socket.on("player-position",handlePlayerPosition);
    socket.on("player-left",handlePlayerLeft);
return () => {
      socket.off("players-list",handlePlayersList);
      socket.off("player-joined",handlePlayerJoined);
      socket.off("player-position",handlePlayerPosition);
      socket.off("player-left",handlePlayerLeft);};},[]);
useEffect(() => { if (!socket) return;
const sendPosition=() => {
const player=playerRef.current; if (!player) return;
const position=new THREE.Vector3(); player.getWorldPosition(position); socket.emit("player-position",{
position:{
          x:position.x,
          y:position.y,
          z:position.z},
rotation:{
          x:player.rotation.x,
          y:player.rotation.y,
          z:player.rotation.z }});};
const interval=setInterval(sendPosition,50); return () => clearInterval(interval);},[]); return (
<div style={{position:"fixed",inset:0,width:"100vw",height:"100vh",overflow:"hidden",background:"#05070b"}}>
<PlayerStatsProvider>
<Canvas
     shadows
     camera={{position:[0,6,30],fov:60,near:0.1,far:isMobile?600:1000}}
     dpr={isMobile?[0.6,1]:[1,1]}
     gl={{antialias:false,powerPreference:"high-performance",alpha:false,stencil:false,depth:true}}
onCreated={({gl,scene}) => {
     gl.setClearColor("#07101c",1);
     scene.background=new THREE.Color("#07101c");
     scene.fog=new THREE.Fog("#07101c",isMobile?80:120,isMobile?400:700);}}>
<Suspense fallback={null}>
<ambientLight intensity={0.45}/>
<hemisphereLight skyColor="#5c7ea3" groundColor="#15181d" intensity={0.5}/>
<directionalLight position={[80,120,60]} intensity={1.25} castShadow={!isMobile} shadow-mapSize-width={isMobile?512:1024} shadow-mapSize-height={isMobile?512:1024}/>
<City />
<Player
     externalPlayerRef={playerRef}
     mobileMove={mobileMove}
     mobileSprint={mobileSprint}
     mobileJump={mobileJump} />
{Object.values(otherPlayers).map((player) => (<OtherPlayer key={player.socketId} player={player}/>))}
{enemyPositions.map((enemyPosition,index) => (
<Enemy
      key={`enemy-${index}`}
      enemyIndex={index}
      position={enemyPosition}
      playerRef={playerRef} />))}
<ThirdPersonCamera
      playerRef={playerRef}
      mobileMove={mobileMove}
      mobilehelicopter={helicopter}/>
<WorldEffects />
</Suspense>
</Canvas>
</PlayerStatsProvider></div>);}
function WorldEffects() {
const {scene}=useThree(); 
useEffect(() => {
if (!scene) return; scene.traverse((object) => {
if (object.isMesh) object.frustumCulled=true;});},[scene]); return null;}