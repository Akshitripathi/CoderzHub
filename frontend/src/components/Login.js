import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { AuthContext } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Form.css";

const Login = () => {
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setError(""); // Clear error when user starts typing
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await loginUser(formData);
            if (response.success) {
                console.log("Login successful");
                localStorage.setItem("token", response.token);
                login(response.token);
                navigate("/profile");
            } else {
                setError(response.message || "Invalid credentials");
            }
        } catch (error) {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-body">
            <div className="form-container login-container">
                <h2>Welcome Back!</h2>
                <p className="form-subtitle">Login to continue your journey</p>
                
                {error && (
                    <div className="error-message">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="text"
                            name="identifier"
                            placeholder="Email or Username"
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="form-footer">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="/forgot-password" className="forgot-password">
                            Forgot Password?
                        </a>
                    </div>

                    <button type="submit" className={`submit-button ${loading ? 'loading' : ''}`} disabled={loading}>
                        {loading ? (
                            <>
                                <FaSpinner className="spinner" />
                                <span>Logging in...</span>
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                <p className="redirect-link">
                    Don't have an account?{" "}
                    <a href="/signup">Create Account</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
