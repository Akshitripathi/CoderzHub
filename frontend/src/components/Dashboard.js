import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../ui/button.js";
import { Home, Folder, Settings, Link, UploadCloud, Plus } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "../styles/Dashboard.css"; // Import the CSS file

const workData = [
  { name: "Jan", hours: 30 },
  { name: "Feb", hours: 45 },
  { name: "Mar", hours: 60 },
  { name: "Apr", hours: 20 },
];

const connectionsData = [
  { name: "A", count: 5 },
  { name: "B", count: 10 },
  { name: "C", count: 3 },
  { name: "D", count: 7 },
];

export default function Dashboard() {
  const [active, setActive] = useState("Home");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
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
        {/* Content */}
        <motion.main className="content">
          {active === "Home" && (
            <div>
              {/* Add Project Box */}
              <div className="add-project" onClick={() => navigate("/project")}> {/* Redirect to Projects Page */}
                <Plus size={28} className="icon" />
                <h2>Add Project</h2>
              </div>
              <div className="grid-container">
                {/* Time Spent on Projects */}
                <div className="chart-box">
                  <h2>Time Spent on Projects</h2>
                  <LineChart width={350} height={220} data={workData} className="chart">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Line type="monotone" dataKey="hours" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </div>
                {/* Number of Connections */}
                <div className="chart-box">
                  <h2>Number of Connections</h2>
                  <BarChart width={350} height={220} data={connectionsData} className="chart">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" barSize={30} />
                  </BarChart>
                </div>
              </div>
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
