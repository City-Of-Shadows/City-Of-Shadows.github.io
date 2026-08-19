import React, { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Register({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => { event.preventDefault(); setError("");
  if (password !== confirmPassword) { setError("Passwords do not match."); return;} setLoading(true); try {
 const result = await register({ username, email, password,});
  if (!result.success) { setError(result.message); return;}} catch (error) 
   { console.error("Registration error:", error); setError( error.message ||
    "Unable to create account. Please try again.");} finally {setLoading(false);}};
return (
<div className="auth-page">
<div className="auth-background">
<div className="auth-glow auth-glow-one" />
<div className="auth-glow auth-glow-two" /> </div>
<div className="auth-card">
<div className="auth-logo"> <span>GAME</span> </div>

        <h1>Create Account</h1>
<p className="auth-subtitle">  Join the game and start playing </p>
<form onSubmit={handleSubmit}>
<div className="input-group"> <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required /> </div>
<div className="input-group"> <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required /> </div>
<div className="input-group"> <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required /></div>
<div className="input-group"> <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required /></div> {error && (
<div className="auth-error">{error}</div>)}
<button type="submit" className="auth-button" disabled={loading}> {loading
              ? "CREATING..."
              : "CREATE ACCOUNT"}</button></form>
<div className="auth-switch"> <span>Already have an account?</span>
<button type="button" onClick={onSwitchToLogin}> LOGIN</button>
</div></div></div>);}
