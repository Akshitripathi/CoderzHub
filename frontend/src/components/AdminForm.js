import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import "../styles/AdminForm.css"; // Import external CSS

export default function AdminForm() {
  const [formData, setFormData] = useState({
    adminName: "",
    projectName: "",
    tools: "",
    collaborators: [],
  });

  const [newCollaborator, setNewCollaborator] = useState({ type: "invite", email: "", username: "", permissions: [] });
  const [showCollaboratorForm, setShowCollaboratorForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPermissions, setShowPermissions] = useState(false);

  const permissionsList = ["Read", "Write", "Execute", "Admin"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCollaboratorChange = (e) => {
    setNewCollaborator({ ...newCollaborator, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.adminName.trim()) errors.adminName = "Admin Name is required";
    if (!formData.projectName.trim()) errors.projectName = "Project Name is required";
    if (!formData.tools.trim()) errors.tools = "Tools Required field is empty";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addCollaborator = () => {
    if ((newCollaborator.type === "invite" && !newCollaborator.email) || 
        (newCollaborator.type === "existing" && !newCollaborator.username)) {
      alert("Please provide valid collaborator details.");
      return;
    }
    setShowPermissions(true);
  };

  const handlePermissionsChange = (perm) => {
    setNewCollaborator((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const saveCollaborator = () => {
    setFormData((prev) => ({
      ...prev,
      collaborators: [...prev.collaborators, { ...newCollaborator }],
    }));
    setNewCollaborator({ type: "invite", email: "", username: "", permissions: [] });
    setShowCollaboratorForm(false);
    setShowPermissions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
    }
  };

  return (
    <div className="admin-form-container">
      <Card className="admin-card">
        <CardContent>
          <h2 className="form-title">Admin Project Form</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <input type="text" name="adminName" placeholder="Admin Name" value={formData.adminName} onChange={handleChange} className="input-field" />
            {errors.adminName && <p className="error-message">{errors.adminName}</p>}

            <input type="text" name="projectName" placeholder="Project Name" value={formData.projectName} onChange={handleChange} className="input-field" />
            {errors.projectName && <p className="error-message">{errors.projectName}</p>}

            <input type="text" name="tools" placeholder="Tools Required (e.g., React, Node.js)" value={formData.tools} onChange={handleChange} className="input-field" />
            {errors.tools && <p className="error-message">{errors.tools}</p>}
            
            <div className="collaborator-section">
              <p className="collaborator-text">Add Collaborator:</p>
              <Button type="button" onClick={() => setShowCollaboratorForm(true)} className="add-collaborator-button">
                <Plus size={18} />
              </Button>
            </div>
            
            {showCollaboratorForm && (
              <div className="collaborator-form">
                <label className="collaborator-label">Select Collaborator Type:</label>
                <select name="type" value={newCollaborator.type} onChange={handleCollaboratorChange} className="input-field">
                  <option value="invite">Send Mail Invite</option>
                  <option value="existing">Add Existing User</option>
                </select>
                {newCollaborator.type === "invite" ? (
                  <input type="email" name="email" placeholder="Collaborator Email" value={newCollaborator.email} onChange={handleCollaboratorChange} className="input-field" />
                ) : (
                  <input type="text" name="username" placeholder="Existing Username" value={newCollaborator.username} onChange={handleCollaboratorChange} className="input-field" />
                )}
                <Button type="button" onClick={addCollaborator} className="next-button">
                  Next: Set Permissions
                </Button>
              </div>
            )}

            {showPermissions && (
              <div className="permissions-section">
                <label className="permissions-label">Assign Permissions:</label>
                {permissionsList.map((perm) => (
                  <label key={perm} className="permissions-item">
                    <input type="checkbox" checked={newCollaborator.permissions.includes(perm)} onChange={() => handlePermissionsChange(perm)} />
                    {perm}
                  </label>
                ))}
                <Button type="button" onClick={saveCollaborator} className="save-collaborator-button">
                  Save Collaborator
                </Button>
              </div>
            )}

            {formData.collaborators.length > 0 && (
              <div className="saved-collaborators">
                <h3 className="saved-collaborators-title">Saved Collaborators:</h3>
                <ul>
                  {formData.collaborators.map((collab, index) => (
                    <li key={index} className="collaborator-item">
                      {collab.type === "invite" ? collab.email : collab.username} - Permissions: {collab.permissions.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <Button type="submit" className="submit-button">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
