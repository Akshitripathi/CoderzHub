import React, { useEffect, useState } from "react";
import { fetchProfile } from "../api";
import { useNavigate } from "react-router-dom";
import '../styles/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetchProfile(token);
            if (response.success) {
                setUser(response.user);
            } else {
                navigate("/login");
            }
        };

        loadProfile();
    }, [navigate]);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="profile-container">
            <img src={user.profilePicture} alt="Profile" className="profile-pic" />
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            <p>{user.bio}</p>
            <div className="social-links">
                {user.socialLinks?.github && <a href={user.socialLinks.github}>GitHub</a>}
                {user.socialLinks?.linkedin && <a href={user.socialLinks.linkedin}>LinkedIn</a>}
                {user.socialLinks?.twitter && <a href={user.socialLinks.twitter}>Twitter</a>}
            </div>
        </div>
    );
};

export default Profile;
