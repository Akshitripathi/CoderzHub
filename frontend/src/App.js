import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Routes, Route } from "react-router-dom"; // ✅ No BrowserRouter here!
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
import ProjectDetails from "./components/ProjectDetails";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext.js";
import ProtectedRoute from "./components/ProtectedRoute";

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
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin-form" element={<ProtectedRoute><AdminForm /></ProtectedRoute>} />
            <Route path="/project" element={<ProtectedRoute><Project /></ProtectedRoute>} />
            <Route path="/codespace/:projectId" element={<ProtectedRoute><Codespace /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </AuthProvider>
      </div>
    </>
  );
}

export default App;