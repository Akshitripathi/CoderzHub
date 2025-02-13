import React, { useState } from "react";
import "../styles/Deploy.css";

export default function Deploy() {
  const [projects, setProjects] = useState([
    { id: 1, name: "Project Alpha", status: "Deployed" },
    { id: 2, name: "Project Beta", status: "Pending" },
  ]);

  return (
    <div className="deploy-container">
      <h2>Deploy Your Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id} className={`project-item ${project.status.toLowerCase()}`}>
            {project.name} - {project.status}
          </li>
        ))}
      </ul>
      <button className="deploy-button">Deploy New Project</button>
    </div>
  );
}
