import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import "../styles/Form.css";

const Login = () => {
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await loginUser(formData);
            setLoading(false);
    
            if (response.success) {
                console.log("Login successful. Token:", response.token);  
                localStorage.setItem("token", response.token);
                navigate("/profile");
            } else {
                setError(response.message);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error during login:", error);
            setError("Something went wrong. Please try again.");
        }
    };
    
    return (
        <div className="login-body">
            <div className="container">
                <h2>Login to Your Account</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="identifier" placeholder="Email or Username" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <button type="submit">{loading ? "Logging in..." : "Login"}</button>
                </form>
                <p className="redirect-link">Don't have an account? <a href="/signup">Sign Up</a></p>
            </div>
        </div>
    );
};

export default Login;
