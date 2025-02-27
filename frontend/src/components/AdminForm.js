import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api";
import "../styles/AdminForm.css";

export default function AdminForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    languages_used: [],
    tags: [],
    visibility: "Public",
    collaborators: [],
  });

  const [collaboratorType, setCollaboratorType] = useState(""); // "existing" or "new"
  const [collaboratorInput, setCollaboratorInput] = useState(""); // Username or Email
  const [permissions, setPermissions] = useState([]); // Multiple permissions
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Project name is required.";
    if (!formData.description.trim()) errors.description = "Description is required.";
    if (formData.languages_used.length === 0) errors.languages_used = "At least one language is required.";
    if (formData.tags.length === 0) errors.tags = "At least one tag is required.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const togglePermission = (perm) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    
    const usernameInput = collaboratorInput.trim();
    if (!usernameInput) {
      console.error("Invalid username provided:", usernameInput);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/get-id?username=${encodeURIComponent(usernameInput)}`);
      const text = await response.text();
      
      try {
        const data = JSON.parse(text);
        if (response.ok && data.userId) {
          if (permissions.length === 0) {
            console.error("No permissions selected.");
            return;
          }
          
          setFormData((prevData) => ({
            ...prevData,
            collaborators: [...prevData.collaborators, { user: data.userId, permissions }],
          }));

          setCollaboratorInput(""); // Clear input field
          setPermissions([]); // Reset permissions
          console.log("Collaborator added:", { user: data.userId, permissions });
        } else {
          console.error("User not found:", data.message);
        }
      } catch (jsonError) {
        console.error("Received non-JSON response:", text);
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const adminId = localStorage.getItem("userId");
    if (!adminId) {
      console.error("Admin ID is missing");
      return;
    }

    const projectData = {
      ...formData,
      admin: adminId,
      collaborators: formData.collaborators.map((collab) => ({
        user: collab.user || null,
        email: collab.email || null,
        permissions: collab.permissions,
      })),
    };

    console.log("Sending Project Data:", projectData);

    try {
      const response = await createProject(projectData);
      if (response && response.project) {
        const language = encodeURIComponent(formData.languages_used[0]);
        navigate(`/codespace/${response.project._id}?lang=${language}`);
      } else {
        console.error("Project creation failed:", response?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit}>
        <label>Project Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <span className="error">{errors.name}</span>}

        <label>Description:</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        {errors.description && <span className="error">{errors.description}</span>}

        <label>Languages Used:</label>
        <input
          type="text"
          placeholder="Comma separated (e.g. JavaScript, Python)"
          onBlur={(e) =>
            setFormData({
              ...formData,
              languages_used: e.target.value.split(",").map((lang) => lang.trim()),
            })
          }
        />
        {errors.languages_used && <span className="error">{errors.languages_used}</span>}

        <label>Tags:</label>
        <input
          type="text"
          placeholder="Comma separated tags"
          onBlur={(e) =>
            setFormData({
              ...formData,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            })
          }
        />
        {errors.tags && <span className="error">{errors.tags}</span>}

        <label>Visibility:</label>
        <select
          value={formData.visibility}
          onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
        >
          <option value="Public">Public</option>
          <option value="Private">Private</option>
          <option value="Restricted">Restricted</option>
        </select>

        <label>Add Collaborators:</label>
        <select onChange={(e) => setCollaboratorType(e.target.value)}>
          <option value="">Select Collaborator Type</option>
          <option value="existing">Add Existing User</option>
          <option value="new">Add New Collaborator</option>
        </select>

        {collaboratorType && (
          <>
            <input
              type={collaboratorType === "existing" ? "text" : "email"}
              placeholder={collaboratorType === "existing" ? "Enter Username" : "Enter Email"}
              value={collaboratorInput}
              onChange={(e) => setCollaboratorInput(e.target.value)}
            />

            <label>Permissions:</label>
            <div className="permissions-checkbox">
              {["Read", "Write", "Admin"].map((perm) => (
                <label key={perm}>
                  <input
                    type="checkbox"
                    value={perm}
                    checked={permissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                  />
                  {perm}
                </label>
              ))}
            </div>

            <button type="button" className="add-btn" onClick={handleAddCollaborator}>
              Add Collaborator
            </button>
          </>
        )}

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}
