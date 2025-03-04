import React, { useEffect, useState } from "react";
import { fetchProfile } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                } else {
                    setError("Failed to load profile");
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

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img
                    src={user.profile_picture || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="profile-pic"
                />
                <h2>{user.username}</h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone Number:</strong> {user.phone_no}</p>
                <p><strong>Status:</strong> {user.status}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Account Status:</strong> {user.account_status}</p>
                <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

           
            <div className="profile-bio">
                <h3>Bio</h3>
                <p>{user.bio || "No bio available."}</p>
            </div>

            
            <div className="profile-stats">
                <div className="stat-card">
                    <h4>Friends</h4>
                    <p>{user.friends?.length || 0} Friends</p>
                </div>
                <div className="stat-card">
                    <h4>Projects</h4>
                    <p>{user.projects?.length || 0} Projects</p>
                </div>
                <div className="stat-card">
                    <h4>Collaborations</h4>
                    <p>{user.collaborations?.length || 0} Collaborations</p>
                </div>
            </div>

            
            {user.notifications && user.notifications.length > 0 && (
                <div className="recent-activities">
                    <h3>Recent Activities</h3>
                    <ul>
                        {user.notifications.map((notification, index) => (
                            <li key={index}>
                                {notification.message} <span>{new Date(notification.createdAt).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            
            <div className="social-links">
                <h3>Social Links</h3>
                {user.github_link && <a href={user.github_link} target="_blank" rel="noopener noreferrer">GitHub</a>}
                {user.linkedin_link && <a href={user.linkedin_link} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                {user.social_profiles?.map((link, index) => (
                    <a key={index} href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                ))}
            </div>

            
            <div className="profile-footer">
                <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
            </div>
        </div>
    );
};

export default Profile;
