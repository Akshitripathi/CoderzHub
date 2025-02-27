import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import '../styles/Form.css';

const Signup = () => {
    const [formData, setFormData] = useState({ 
        username: "", 
        email: "", 
        password: "", 
        phone_no: "", 
        profile_picture: "", 
        bio: "",
        github_link: "",
        linkedin_link: ""
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const response = await registerUser(formData);
        setLoading(false);

        if (response.success) {
            setMessage("Registration successful! Please check your email for verification.");
            setTimeout(() => navigate("/login"), 3000);
        } else {
            setError(response.message);
        }
    };

    return (
        <div className="signup-body">
            <div className="container">
                <h2>Create an Account</h2>
                {error && <p className="error">{error}</p>}
                {message && <p className="success">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                    <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <input type="text" name="phone_no" placeholder="Phone Number" onChange={handleChange} required />
                    <input type="text" name="profile_picture" placeholder="Profile Picture URL" onChange={handleChange} />
                    <textarea name="bio" placeholder="Bio" onChange={handleChange}></textarea>
                    <input type="text" name="github_link" placeholder="GitHub Link" onChange={handleChange} />
                    <input type="text" name="linkedin_link" placeholder="LinkedIn Link" onChange={handleChange} />
                    <button type="submit">{loading ? "Signing up..." : "Register"}</button>
                </form>
                <p className="redirect-link">Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
};

export default Signup;
