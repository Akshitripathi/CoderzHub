import React, { useState, useEffect } from "react";
import "../styles/Deploy.css";
import { getProjects } from "../api"; 

export default function Deploy() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects(); 
        if (response.success) {
          setProjects(response.projects);
        } else {
          setError("Failed to fetch projects");
        }
      } catch (err) {
        setError("Error fetching projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="deploy-container">
      <h2>Deploy Your Projects</h2>

      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : projects.length === 0 ? (
        <p>No projects found. Start a new one!</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project._id} className={`project-item ${project.status.toLowerCase()}`}>
              {project.name} - {project.status}
            </li>
          ))}
        </ul>
      )}

      <button className="deploy-button">Deploy New Project</button>
    </div>
  );
}
