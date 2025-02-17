import React, { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/EditProfile.css";

const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_no: "",
        bio: "",
        github_link: "",
        linkedin_link: "",
        profile_picture: ""
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
                        profile_picture: response.user.profile_picture || ""
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await updateProfile(formData);
            if (response.success) {
                setSuccessMessage("Profile updated successfully!");
                setTimeout(() => {
                    navigate("/profile");
                }, 2000); // Redirect after 2 seconds
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
            <form onSubmit={handleSubmit}>
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
                </div>

                <div className="form-section">
                    <div className="input-group">
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself"
                        ></textarea>
                    </div>

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
                </div>

                <div className="form-section">
                    <div className="input-group">
                        <label>Profile Picture URL</label>
                        <input
                            type="url"
                            name="profile_picture"
                            value={formData.profile_picture}
                            onChange={handleChange}
                            placeholder="URL to your profile picture"
                        />
                    </div>

                    {formData.profile_picture && (
                        <div className="profile-preview">
                            <img src={formData.profile_picture} alt="Profile Preview" />
                        </div>
                    )}
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
