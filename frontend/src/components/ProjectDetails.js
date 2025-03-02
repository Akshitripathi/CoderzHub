import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProjectById, getProjectFiles } from "../api";
import "../styles/ProjectDetails.css";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await getProjectById(id);
        const filesResponse = await getProjectFiles(id);

        if (projectResponse.success && filesResponse.success) {
          setProject(projectResponse.project);
          setFiles(filesResponse.files);
        } else {
          throw new Error("Failed to fetch project details or files.");
        }
      } catch (err) {
        setError(err.message || "Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="project-details-container">
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <div className="files-section">
        <h3>Files</h3>
        <ul>
          {files.map((file) => (
            <li key={file.filename}>
              <a href={`http://localhost:5000/${file.filepath}`} target="_blank" rel="noopener noreferrer">
                {file.filename}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
