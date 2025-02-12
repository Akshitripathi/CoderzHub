import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../ui/button";
import "../styles/Project.css"; // Importing the new CSS file

export default function Project() {
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: "Alice", online: true, color: "#FF5733" },
    { id: 2, name: "Bob", online: false, color: "#33FF57" },
    { id: 3, name: "Charlie", online: true, color: "#3357FF" },
  ]);

  return (
    <div className="project-container">
      {/* Sidebar for collaborators */}
      <div className="sidebar">
        <h2>Collaborators</h2>
        <ul className="collaborators-list">
          {collaborators.map((collab) => (
            <li key={collab.id} style={{ backgroundColor: collab.color }}>
              {collab.name} {collab.online ? "(Online)" : "(Offline)"}
            </li>
          ))}
        </ul>
      </div>

      {/* Main workspace */}
      <div className="workspace">
        <h2>Codespace</h2>
        <div className="button-container">
          <Button className="add-file-button">Add File</Button>
          <Button className="add-folder-button">Add Folder</Button>
        </div>

        <Button onClick={() => navigate("/admin-form")} className="add-project-button">
          Add Project
        </Button>
      </div>
    </div>
  );
}
