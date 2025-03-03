import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/ProjectDetails.css";
import ChatIcon from './ChatIcon';

const ProjectDetails = ({ userId }) => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`/api/projects/${id}`);
                setProject(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching project:', error);
                setError(error.message || "Failed to load project details.");
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="project-details-container">
            <h1>{project.name}</h1>
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
            <ChatIcon projectId={id} userId={userId} />
        </div>
    );
};

export default ProjectDetails;
