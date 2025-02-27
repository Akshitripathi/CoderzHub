import "./App.css";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Dashboard from "./components/Dashboard";
import AdminForm from "./components/AdminForm";
import Project from "./components/Project";
import Codespace from "./components/Codespace";
import EditProfile from "./components/EditProfile";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import {AuthProvider} from './context/AuthContext.js';

function App() {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const numDots = 30; 
    const dotElements = [];
    
    for (let i = 0; i < numDots; i++) {
      const size = Math.random() * 6 + 4; // koi bhi size 4px se 10px k bech m 
      const duration = Math.random() * 10 + 5; // koi bhi animation speed  5s se 15s k bech m 
      const top = Math.random() * 100;
      const left = Math.random() * 100;

      dotElements.push(
        <div
          key={i}
          className="dot"
          style={{
            top: `${top}vh`,
            left: `${left}vw`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${duration}s`,
          }}
        />
      );
    }

    setDots(dotElements);
  }, []);

  return (
    <>
      <div className="background-container">{dots}</div>
      <div className="main-content">
        <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-form" element={<AdminForm />} />
          <Route path="/project" element={<Project />} />
          <Route path="/codespace/:projectId" element={<Codespace />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
        <Footer/>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
