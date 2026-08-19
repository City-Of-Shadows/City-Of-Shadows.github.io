import React from "react";
import Game from "./game/Game.jsx";
import AuthScreen from "./auth/AuthScreen.jsx";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";

function AppContent() {
const {user, loading,} = useAuth(); if (loading) {
return (
<div className="loading-screen">
<div className="loading-text"> LOADING...</div></div>);}
if (!user) {
return <AuthScreen />;}
return <Game />;}
export default function App() {
return (
<AuthProvider>
<AppContent />
</AuthProvider>);}