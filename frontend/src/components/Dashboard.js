import { motion } from "framer-motion";
import { Folder, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { fetchFriends, getProjects } from "../api"; // ✅ FIXED IMPORTS
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [connections, setConnections] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectsResponse = await getProjects(); 
        const friendsResponse = await fetchFriends(); 

        if (projectsResponse.success) setProjects(projectsResponse.projects);
        if (friendsResponse.success) setConnections(friendsResponse.friends.length); 
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loading-spinner"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="main-content">
        <motion.main className="content">
          <div className="dashboard-header">
            <h1>Welcome to Your Dashboard</h1>
          </div>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <Folder size={28} className="icon" />
              <h2>{projects.length}</h2>
              <p>Projects</p>
            </div>
            <div className="dashboard-card">
              <Users size={28} className="icon" />
              <h2>{connections}</h2>
              <p>Connections</p>
            </div>
          </div>

          <div className="grid-container">
            <div className="chart-box">
              <h2>Projects Overview</h2>
              <LineChart width={350} height={220} data={projects} className="chart">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="tasks" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </div>

            <div className="chart-box">
              <h2>Connections Growth</h2>
              <BarChart width={350} height={220} data={[{ name: "Friends", count: connections }]} className="chart">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" barSize={30} />
              </BarChart>
            </div>
          </div>

          <div className="action-buttons">
            <button className="dashboard-btn" onClick={() => navigate("/project")}>
              <Plus size={18} /> Add New Project
            </button>
            <button className="dashboard-btn" onClick={() => navigate("/friends")}>
              <Users size={18} /> View Connections
            </button>
          </div>
        </motion.main>
      </div>
    </div>
  );
}