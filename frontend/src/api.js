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
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
  
    const data = await response.json();
  
    if (data.token && data.userId) { // Ensure userId is stored
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId); // Store userId in local storage
      window.dispatchEvent(new Event("authChange")); 
    }
  
    return data;
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

export const updateProfile = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No authentication token found!");
    }

    const response = await fetch("http://localhost:5000/api/auth/updateprofile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error("Failed to update profile");
    }

    return response.json();
};


export const fetchFriends = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No authentication token found!");
    }

    const response = await fetch("http://localhost:5000/api/friends", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch friends list");
    }

    return response.json();
};



const API_URL = "http://localhost:5000/api/project";

const makeRequest = async (endpoint, method, body = null, token = null) => {
    try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        });

        const data = await response.json();

        if (data.token && data.userId) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);  // Ensure userId is stored
          window.dispatchEvent(new Event("authChange")); 
        }
        return data;

    } catch (error) {
        console.log(error);
        return { success: false, message: "Failed to connect to the server" };
    }
};

export const createProject = async (projectData) => {
    const token = localStorage.getItem("token");
    console.log("Sending Project Data:", projectData);  // Debugging

    const response = await makeRequest("/create-project", "POST", projectData, token);
    
    console.log("Response from API:", response);  // Debugging
    return response;
};


export const getProjects = async () => {
    const token = localStorage.getItem("token");
    return makeRequest("/get-all-project", "GET", null, token);
};

export const getProjectById = async (id) => {
    const token = localStorage.getItem("token");
    return makeRequest(`/get-project/${id}`, "GET", null, token);
};

export const updateProject = async (id, updatedData) => {
    const token = localStorage.getItem("token");
    return makeRequest(`/update-project/${id}`, "PUT", updatedData, token);
};

export const deleteProject = async (id) => {
    const token = localStorage.getItem("token");
    return makeRequest(`/delete-project/${id}`, "DELETE", null, token);
};


export const addCollaborator = async (projectId, collaboratorData) => {
    const token = localStorage.getItem("token");
    return makeRequest("/add-collaborator-project", "POST", { projectId, ...collaboratorData }, token);
};

export const removeCollaborator = async (projectId, collaboratorId) => {
    const token = localStorage.getItem("token");
    return makeRequest("/remove-collaborator-project", "POST", { projectId, collaboratorId }, token);
};


export const likeProject = async (projectId) => {
    const token = localStorage.getItem("token");
    return makeRequest("/like-project", "POST", { projectId }, token);
};

export const unlikeProject = async (projectId) => {
    const token = localStorage.getItem("token");
    return makeRequest("/unlike-project", "POST", { projectId }, token);
};

export const changeProjectStatus = async (projectId, newStatus) => {
    const token = localStorage.getItem("token");
    return makeRequest("/change-status-project", "POST", { projectId, newStatus }, token);
};

export const getProjectFiles = async (projectId) => {
    const token = localStorage.getItem("token");
    const response = await makeRequest(`/get-project-files/${projectId}`, "GET", null, token);
    console.log("API response for project files:", response);
    return Array.isArray(response.files) ? response.files : [];
};

export const saveFileContent = async (projectId, filePath, content) => {
    const token = localStorage.getItem("token");
    return makeRequest(`/project/${projectId}/save-file`, "POST", { filePath, content }, token);
};

export const compileCode = async (language, code) => {
    const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
    });
    return response.json();
};

const API_BASE_URL = 'http://localhost:5000/api';

export async function deleteFile(projectId, filename) {
  try {
    const response = await fetch(`${API_BASE_URL}/project/${projectId}/files/${filename}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

export async function renameFile(projectId, oldFilename, newFilename) {
  try {
    const response = await fetch(`${API_BASE_URL}/project/${projectId}/files/${oldFilename}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newFilename }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error renaming file:', error);
    throw error;
  }
}
