import React, { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Login({onSwitchToRegister,}) {
const { login } = useAuth();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const handleSubmit = async (event) => { event.preventDefault(); setError(""); setLoading(true); try {
const result = await login({ email, password,});
if (!result.success) { setError(result.message); return;}} catch (error) { console.error(
"Login error:", error);
setError( "Something went wrong while logging in.");} finally {setLoading(false);}};
return (
 <div className="auth-page">
 <div className="auth-background">
 <div className="auth-glow auth-glow-one" />
 <div className="auth-glow auth-glow-two" /></div>
 <div className="auth-card">
 <div className="auth-logo">  <span>GAME</span></div>
   <h1>Welcome Back</h1>
   <p className="auth-subtitle"> Login to continue your game </p>
   <form onSubmit={handleSubmit}>
 <div className="input-group">
   <label>Email</label>
       <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail( event.target.value)}
              autoComplete="email"
              required
              disabled={loading}/></div>
 <div className="input-group">
    <label>Password</label>
        <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword( event.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}/></div>{error && (
 <div className="auth-error"> {error} </div>)}
   <button type="submit" className="auth-button" disabled={loading}> {loading
              ? "LOGIN..."
              : "LOGIN"}</button></form>
 <div className="auth-switch">
   <span> Don't have an account? </span>
   <button type="button" onClick={ onSwitchToRegister } disabled={loading}> CREATE ACCOUNT </button>
</div></div></div>);}
