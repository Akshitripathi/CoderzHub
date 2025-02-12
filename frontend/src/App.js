import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import VerifyEmail from "./components/EmailVerification";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import './App.css';
import Settings from "./components/Settings";
import Dashboard from "./components/Dashboard";
import AdminForm from "./components/AdminForm";
import Project from "./components/Project";


function App() {
  return (
    <>
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

        <Route path="/verify-email/:token" element={<VerifyEmail />} />
      </Routes>
    </>
  );
}

export default App;
