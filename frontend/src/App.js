import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminForm from "./components/AdminForm";
import Codespace from "./components/Codespace";
import Dashboard from "./components/Dashboard";
import EditProfile from "./components/EditProfile";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Project from "./components/Project";
import ProjectDetails from "./components/ProjectDetails";
import Settings from "./components/Settings";
import Signup from "./components/Signup";
import { AuthProvider, useAuth } from "./context/AuthContext.js";

function App() {
  const [dots, setDots] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const numDots = 30;
    const dotElements = [];

    for (let i = 0; i < numDots; i++) {
      const size = Math.random() * 6 + 4;
      const duration = Math.random() * 10 + 5;
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
            <Route path="/project/:id" element={<ProjectDetails userId={user?.id} />} />

          </Routes>
          <Footer />
        </AuthProvider>
      </div>
    </>
  );
}

export default App;