const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth
export const login = async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
};

// Specialties
export const getSpecialties = async () => {
    const response = await fetch(`${API_BASE_URL}/specialties`);
    if (!response.ok) throw new Error('Failed to fetch specialties');
    return response.json();
};

export const createSpecialty = async (data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/specialties`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create specialty');
    return response.json();
};

export const updateSpecialty = async (id: string, data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/specialties/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update specialty');
    return response.json();
};

export const deleteSpecialty = async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/specialties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete specialty');
    return response.json();
};

// Projects
export const getProjects = async () => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
};

export const createProject = async (formData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
};

export const updateProject = async (id: string, data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
};

export const deleteProject = async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return response.json();
};

export const addProjectImages = async (id: string, formData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/images`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to add images');
    return response.json();
};

export const deleteProjectImage = async (projectId: string, imageId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/images/${imageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete image');
    return response.json();
};

// Images
export const getImages = async () => {
    const response = await fetch(`${API_BASE_URL}/images`);
    if (!response.ok) throw new Error('Failed to fetch images');
    return response.json();
};

export const uploadImage = async (formData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/images`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
};

export const replaceImage = async (id: string, formData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/images/replace/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to replace image');
    return response.json();
};

export const deleteImage = async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/images/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete image');
    return response.json();
};
