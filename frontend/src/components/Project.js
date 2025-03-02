import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { getProjects, addCollaborator, removeCollaborator, changeProjectStatus } from "../api";
import "../styles/Project.css";

export default function Project() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjects();
        console.log("🔍 API Response:", response); 

        if (!response) throw new Error("No response received from API.");

        if (response.success && Array.isArray(response.projects)) {
          setProjects(response.projects);
        } else if (Array.isArray(response)) {
          setProjects(response);
        } else {
          throw new Error(response.message || "Invalid response format.");
        }
      } catch (err) {
        console.error("⚠️ API Error:", err.message);
        setError(err.message || "Failed to load projects.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangeStatus = async (projectId, newStatus) => {
    try {
      await changeProjectStatus(projectId, newStatus);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
      );
    } catch (error) {
      setError("Failed to update project status.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="project-container">
      <div className="workspace">
        <Button onClick={() => navigate("/admin-form")} className="add-project-button">
          Add New Project
        </Button>

        <div className="projects-section">
          <h2>Your Projects</h2>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="project-card">
                <h3>{project.name}</h3>
                <p className="description">{project.description}</p>

                <div className="project-details">
                  <span className={`status ${project.status.toLowerCase()}`}>{project.status}</span>
                  <p><strong>Languages Used:</strong> {project.languages_used.join(", ")}</p>
                  <p><strong>Tags:</strong> {project.tags.join(", ")}</p>
                  <p><strong>Visibility:</strong> {project.visibility}</p>
                  <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Collaborators Section */}
                <div className="collaborators-section">
                  <h4>Collaborators</h4>
                  <ul>
                    {project.collaborators.map((collab) => (
                      <li key={collab.id}>
                        <span>{collab.username} ({collab.email})</span>
                        {collab.online ? <span className="online">🟢 Online</span> : <span className="offline">🔴 Offline</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Project Actions */}
                <div className="project-actions">
                  <Button 
                    onClick={() => project._id && navigate(`/codespace/${project._id}`)}
                    className="view-details-button"
                  >
                    🔍 View Details
                  </Button>
                  <Button className="change-status-button" onClick={() => handleChangeStatus(project.id, project.status === "Completed" ? "In Progress" : "Completed")}>
                    🔄 Change Status
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
