import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import './App.css';
import Settings from "./components/Settings";
import Dashboard from "./components/Dashboard";
import AdminForm from "./components/AdminForm";
import Project from "./components/Project";
import Deploy from "./components/Deploy";
import Friends from "./components/Friends";
import Codespace from "./components/Codespace";
import EditProfile from "./components/EditProfile";

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
        <Route path="/friends" element={<Friends />} />
        <Route path="/deploy" element={<Deploy />} />
        <Route path="/codespace" element={<Codespace />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </>
  );
}

export default App;
