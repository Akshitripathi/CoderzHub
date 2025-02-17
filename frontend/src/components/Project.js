import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { getProjects, addCollaborator, removeCollaborator, changeProjectStatus } from "../api";
import "../styles/Project.css"; 

export default function Project() {
  const navigate = useNavigate();

  const [collaborators, setCollaborators] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects and collaborators on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects from the API
        const projectsResponse = await getProjects();
        setProjects(projectsResponse.projects);

        // Assuming collaborators are part of each project, we can set them accordingly
        // You may need to adjust the API to fetch collaborators separately if needed
        setCollaborators(projectsResponse.collaborators || []);
      } catch (err) {
        setError("Failed to load project data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle adding a collaborator
  const handleAddCollaborator = async (projectId, collaboratorData) => {
    try {
      await addCollaborator(projectId, collaboratorData);
      // Refresh collaborator list
      const updatedProject = projects.find((p) => p.id === projectId);
      updatedProject.collaborators.push(collaboratorData);
      setProjects([...projects]);
    } catch (error) {
      setError("Failed to add collaborator.");
    }
  };

  // Handle removing a collaborator
  const handleRemoveCollaborator = async (projectId, collaboratorId) => {
    try {
      await removeCollaborator(projectId, collaboratorId);
      const updatedProject = projects.find((p) => p.id === projectId);
      updatedProject.collaborators = updatedProject.collaborators.filter(
        (collaborator) => collaborator.id !== collaboratorId
      );
      setProjects([...projects]);
    } catch (error) {
      setError("Failed to remove collaborator.");
    }
  };

  // Handle changing project status
  const handleChangeStatus = async (projectId, newStatus) => {
    try {
      await changeProjectStatus(projectId, newStatus);
      const updatedProject = projects.find((p) => p.id === projectId);
      updatedProject.status = newStatus;
      setProjects([...projects]);
    } catch (error) {
      setError("Failed to update project status.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="project-container">
      {/* Sidebar for collaborators */}
      <div className="sidebar">
        <h2>Collaborators</h2>
        <ul className="collaborators-list">
          {collaborators.map((collab) => (
            <li key={collab.id} style={{ backgroundColor: collab.color }}>
              {collab.name} {collab.online ? "(Online)" : "(Offline)"}
              <Button
                className="remove-collaborator-button"
                onClick={() => handleRemoveCollaborator(collab.projectId, collab.id)}
              >
                Remove
              </Button>
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

        {/* Projects Section */}
        <div className="projects-section">
          <h2>Your Projects</h2>
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <span
                className={`status ${project.status === "In Progress" ? "in-progress" : "completed"}`}
              >
                {project.status}
              </span>
              <Button className="open-codespace-button" onClick={() => navigate(`/codespace/${project.id}`)}>
                Open Codespace
              </Button>
              <div className="project-actions">
                <Button
                  onClick={() => handleChangeStatus(project.id, "Completed")}
                  className="change-status-button"
                >
                  Mark as Completed
                </Button>
                <Button
                  onClick={() => handleChangeStatus(project.id, "In Progress")}
                  className="change-status-button"
                >
                  Mark as In Progress
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
