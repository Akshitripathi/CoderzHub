
export const registerUser = async (userData) => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Failed to connect to the server" };
    }
};


export const requestPasswordReset = async (email) => {
    const response = await fetch('http://localhost:5000/api/auth/request-password-reset', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    return response.json();
};

export const resetPassword = async (token, newPassword) => {
    const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
    });
    return response.json();
};


export const verifyEmail = async (token) => {
    try {
        const response = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`, {
            method: "GET",
        });
        
        return await response.json();
    } catch (error) {
        return { success: false, message: "Verification failed. Try again later." };
    }
};


export const loginUser = async (userData) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {  // Ensure port is correct
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    return response.json();
};


export const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); 

    if (!token) {
        throw new Error("No authentication token found!");
    }

    const response = await fetch("http://localhost:5000/api/auth/getprofile", {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
    });

    console.log("API Response:", response); 

    if (!response.ok) {
        throw new Error("Failed to fetch profile");
    }

    return response.json();
};


