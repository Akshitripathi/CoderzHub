import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile, updateProfile } from "../api";
import "../styles/EditProfile.css";

const EditProfile = ({ onProfileUpdated }) => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_no: "",
        bio: "",
        github_link: "",
        linkedin_link: "",
        profile_picture: null, // Changed to handle file input
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetchProfile();
                if (response.success) {
                    setUser(response.user);
                    setFormData({
                        name: response.user.name,
                        email: response.user.email,
                        phone_no: response.user.phone_no,
                        bio: response.user.bio || "",
                        github_link: response.user.github_link || "",
                        linkedin_link: response.user.linkedin_link || "",
                        profile_picture: null, // Reset to null for file input
                    });
                } else {
                    setError("Failed to load profile.");
                    navigate("/login");
                }
            } catch (err) {
                setError("Failed to fetch profile. Please try again.");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profile_picture: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            console.log("Auth Token:", token); // Debugging
    
            if (!token) {
                setError("Authentication token is missing. Please log in again.");
                navigate("/login");
                return;
            }
            const form = new FormData();
            for (const key in formData) {
                form.append(key, formData[key]);
            }

            // Log the FormData contents
            for (let [key, value] of form.entries()) {
                console.log(`${key}:`, value);
            }

            // Pass the user ID to the updateProfile API
            const response = await updateProfile(user._id, form);
            console.log("API Response:", response);
            if (response.success) {
                setSuccessMessage("Profile updated successfully!");
                // Notify the parent component (Profile.js) about the updated user data
                if (onProfileUpdated) {
                    onProfileUpdated(response.user);
                }
                setTimeout(() => {
                    navigate("/profile");
                }, 2000); 
            } else {
                setError(response.message || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Error updating profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            {successMessage && <p className="success">{successMessage}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="form-section">
                    <div className="input-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone_no"
                            value={formData.phone_no}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself"
                        ></textarea>
                    </div>
                </div>

                <div className="form-section">
                    <div className="input-group">
                        <label>GitHub Link</label>
                        <input
                            type="url"
                            name="github_link"
                            value={formData.github_link}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>LinkedIn Link</label>
                        <input
                            type="url"
                            name="linkedin_link"
                            value={formData.linkedin_link}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Profile Picture</label>
                        <input
                            type="file"
                            name="profile_picture"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {formData.profile_picture && (
                            <div className="profile-preview">
                                <img
                                    src={URL.createObjectURL(formData.profile_picture)}
                                    alt="Profile Preview"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
