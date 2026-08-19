import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import Login from "./Login";
import Register from "./Register";

export default function AuthScreen() {
const { loading } = useAuth();
const [showRegister, setShowRegister] = useState(false);
if (loading) {
return (
<div className="loading-screen">
<div className="loading-text">
 LOADING... 
 </div></div>);}
if (showRegister) {
return (<Register onSwitchToLogin={() => setShowRegister(false)}/>);}
return (<Login onSwitchToRegister={() => setShowRegister(true)}/>);}