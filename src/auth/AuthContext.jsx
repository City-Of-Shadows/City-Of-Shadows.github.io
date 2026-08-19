import React,{createContext,useContext,useEffect,useState} from "react";
const AuthContext=createContext(null);
const API_URL="https://server-production-d49f3.up.railway.app/api/auth";
const TOKEN_KEY="game_auth_token";
const USER_KEY="game_auth_user";
export function AuthProvider({children}) {
const [user,setUser]=useState(null);
const [token,setToken]=useState(null);
const [loading,setLoading]=useState(true); useEffect(() => {
const restoreLogin=async () => { try {
const savedToken=localStorage.getItem(TOKEN_KEY);
const savedUser=localStorage.getItem(USER_KEY);
if (!savedToken) { setUser(null); setToken(null); return;} setToken(savedToken);
if (savedUser) { try { setUser(JSON.parse(savedUser));} catch { localStorage.removeItem(USER_KEY);}}
const response=await fetch(`${API_URL}/me`,{ method:"GET", headers:{ Authorization:`Bearer ${savedToken}`,},});
const data=await response.json();
if (!response.ok || !data.success) { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY);
 setUser(null); setToken(null); return;}
 setUser(data.user); localStorage.setItem(USER_KEY,JSON.stringify(data.user));} catch (error) {
console.error("Restore login error:",error);
const savedToken=localStorage.getItem(TOKEN_KEY);
const savedUser=localStorage.getItem(USER_KEY);
if (savedToken) setToken(savedToken);
if (savedUser) { try { setUser(JSON.parse(savedUser));} catch { setUser(null);}}} 
finally { setLoading(false);}}; restoreLogin(); },[]);
const register=async ({username,email,password}) => { try {
const response=await fetch(`${API_URL}/register`,{ method:"POST", headers:{"Content-Type":"application/json",}, 
body:JSON.stringify({ username, email, password,}),});
const data=await response.json(); if (!response.ok) {
return { success:false, message:data.message || "Registration failed.",};}
if (data.token) { localStorage.setItem(TOKEN_KEY,data.token); setToken(data.token);}
if (data.user) { localStorage.setItem(USER_KEY,JSON.stringify(data.user)); setUser(data.user);}
return {success:true,
        message:data.message || "Account created successfully.",
        user:data.user,
        token:data.token,};} catch (error) {console.error("Register request error:",error);
return {success:false,
        message:"Unable to connect to the server.",};}};
const login=async ({email,password}) => { try {
const response=await fetch(`${API_URL}/login`,{ method:"POST", headers:{ "Content-Type":"application/json",},
body:JSON.stringify({ email, password,}),});
const data=await response.json(); if (!response.ok) {  
return { success:false, message:data.message || "Invalid email or password.",};}
if (data.token) { localStorage.setItem(TOKEN_KEY,data.token); setToken(data.token);}
if (data.user) { localStorage.setItem(USER_KEY,JSON.stringify(data.user)); setUser(data.user);}
return {success:true,
        message:data.message || "Login successful.",
        user:data.user,
        token:data.token,};} catch (error) {console.error("Login request error:",error);
return {success:false, message:"Unable to connect to the server.",};}};
const logout=async () => {
const currentToken=localStorage.getItem(TOKEN_KEY); try { if (currentToken) {
await fetch(`${API_URL}/logout`,{ method:"POST", headers:{ Authorization:`Bearer ${currentToken}`,},});}} 
catch (error) { console.error("Logout request error:",error);} finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem("game_current_user");
      setToken(null); setUser(null);}};
const value={ user, token, loading, isAuthenticated:!!user && !!token, register, login, logout,};
return (<AuthContext.Provider value={value}> {children} </AuthContext.Provider>);}
export function useAuth() {const context=useContext(AuthContext);
if (!context) { throw new Error("useAuth must be used inside an AuthProvider");} return context;}
