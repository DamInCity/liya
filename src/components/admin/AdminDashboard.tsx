import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty,
    getProjects, createProject, updateProject, deleteProject, deleteProjectImage, addProjectImages
} from '../../services/api';
import { GallerySection } from './GallerySection';
import { CertificationsSection } from './CertificationsSection';
import { BioSection } from './BioSection';
import { StatsSection } from './StatsSection';

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'specialties' | 'projects' | 'gallery' | 'certifications' | 'bio' | 'stats' | 'settings'>('specialties');
    const [specialties, setSpecialties] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');
    const [showAddSpecialty, setShowAddSpecialty] = useState(false);
    const [showAddProject, setShowAddProject] = useState(false);
    const [editingSpecialty, setEditingSpecialty] = useState<any>(null);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [addingImagesProjectId, setAddingImagesProjectId] = useState<string | null>(null);
    const [changingCredentials, setChangingCredentials] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('adminToken');
        if (!storedToken) {
            navigate('/admin/login');
            return;
        }
        setToken(storedToken);
        loadData();
    }, [navigate]);

    const loadData = async () => {
        try {
            const [specialtiesRes, projectsRes] = await Promise.all([
                getSpecialties(),
                getProjects()
            ]);
            setSpecialties(specialtiesRes.specialties || []);
            setProjects(projectsRes.projects || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const handleChangeCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        const currentPassword = formData.get('currentPassword');
        const newUsername = formData.get('newUsername');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (newPassword && newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (!newUsername && !newPassword) {
            alert('Please provide either a new username or password');
            return;
        }

        setChangingCredentials(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${apiUrl}/auth/change-credentials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newUsername: newUsername || undefined,
                    newPassword: newPassword || undefined
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to change credentials');
            }

            if (data.token) {
                localStorage.setItem('adminToken', data.token);
                setToken(data.token);
            }

            alert('Credentials updated successfully!');
            form.reset();
        } catch (error: any) {
            alert(error.message || 'Failed to change credentials');
        } finally {
            setChangingCredentials(false);
        }
    };

    const handleCreateSpecialty = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        try {
            const result = await createSpecialty({
                title: formData.get('title'),
                description: formData.get('description'),
                icon: formData.get('icon')
            }, token);
            
            setSpecialties([...specialties, result.specialty]);
            setShowAddSpecialty(false);
            form.reset();
        } catch (error) {
            alert('Failed to create specialty');
        }
    };

    const handleUpdateSpecialty = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        try {
            const result = await updateSpecialty(editingSpecialty.id, {
                title: formData.get('title'),
                description: formData.get('description'),
                icon: formData.get('icon')
            }, token);
            
            setSpecialties(specialties.map(s => s.id === editingSpecialty.id ? result.specialty : s));
            setEditingSpecialty(null);
        } catch (error) {
            alert('Failed to update specialty');
        }
    };

    const handleDeleteSpecialty = async (id: string) => {
        if (!confirm('Are you sure you want to delete this specialty?')) return;
        try {
            await deleteSpecialty(id, token);
            setSpecialties(specialties.filter(s => s.id !== id));
        } catch (error) {
            alert('Failed to delete specialty');
        }
    };

    const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        try {
            const result = await createProject(formData, token);
            setProjects([...projects, result.project]);
            setShowAddProject(false);
            form.reset();
        } catch (error) {
            alert('Failed to create project');
        }
    };

    const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        try {
            const tags = formData.get('tags');
            const result = await updateProject(editingProject.id, {
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                tags: tags ? (tags as string).split(',').map(t => t.trim()) : []
            }, token);
            
            setProjects(projects.map(p => p.id === editingProject.id ? result.project : p));
            setEditingProject(null);
        } catch (error) {
            alert('Failed to update project');
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await deleteProject(id, token);
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            alert('Failed to delete project');
        }
    };

    const handleDeleteProjectImage = async (projectId: string, imageId: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        try {
            await deleteProjectImage(projectId, imageId, token);
            // Update local state
            setProjects(projects.map(p => {
                if (p.id === projectId) {
                    return {
                        ...p,
                        images: p.images.filter((img: any) => img.id !== imageId)
                    };
                }
                return p;
            }));
        } catch (error) {
            alert('Failed to delete image');
        }
    };

    const handleAddProjectImagesClick = async (projectId: string) => {
        // Try both possible input IDs (edit form and direct button)
        let input = document.getElementById(`add-images-${projectId}`) as HTMLInputElement | null;
        if (!input) {
            input = document.getElementById(`add-images-direct-${projectId}`) as HTMLInputElement | null;
        }
        if (!input || !input.files || input.files.length === 0) {
            alert('Please select images to upload');
            return;
        }
        const formData = new FormData();
        Array.from(input.files).forEach(file => formData.append('images', file));
        setAddingImagesProjectId(projectId);
        try {
            const result = await addProjectImages(projectId, formData, token);
            setProjects(projects.map(p => p.id === projectId ? result.project : p));
            // clear input
            if (input) input.value = '';
            alert('Images added successfully');
        } catch (error) {
            alert('Failed to add images');
        } finally {
            setAddingImagesProjectId(null);
        }
    }; 

    if (loading) {
        return (
            <div 
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-main)' }}
            >
                <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
            </div>
        );
    }

    return (
        <div 
            className="min-h-screen"
            style={{ backgroundColor: 'var(--bg-main)' }}
        >
            {/* Header */}
            <div 
                className="border-b"
                style={{ borderColor: 'var(--border-subtle)' }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 
                        className="text-2xl font-bold"
                        style={{ 
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-heading)' 
                        }}
                    >
                        Admin Dashboard
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg transition-colors text-center"
                            style={{ 
                                color: 'var(--text-muted)',
                                border: '1px solid var(--border-subtle)'
                            }}
                        >
                            View Site
                        </a>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg transition-colors"
                            style={{ 
                                backgroundColor: 'var(--accent)',
                                color: 'var(--bg-main)'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('specialties')}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all whitespace-nowrap text-sm sm:text-base"
                        style={{
                            backgroundColor: activeTab === 'specialties' ? 'var(--accent)' : 'var(--bg-elevated)',
                            color: activeTab === 'specialties' ? 'var(--bg-main)' : 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    >
                        Specialties ({specialties.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all whitespace-nowrap text-sm sm:text-base"
                        style={{
                            backgroundColor: activeTab === 'projects' ? 'var(--accent)' : 'var(--bg-elevated)',
                            color: activeTab === 'projects' ? 'var(--bg-main)' : 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    >
                        Projects ({projects.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all whitespace-nowrap text-sm sm:text-base"
                        style={{
                            backgroundColor: activeTab === 'gallery' ? 'var(--accent)' : 'var(--bg-elevated)',
                            color: activeTab === 'gallery' ? 'var(--bg-main)' : 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    >
                        Gallery
                    </button>
                    <button
                        onClick={() => setActiveTab('certifications')}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all whitespace-nowrap text-sm sm:text-base"
                        style={{
                            backgroundColor: activeTab === 'certifications' ? 'var(--accent)' : 'var(--bg-elevated)',
                            color: activeTab === 'certifications' ? 'var(--bg-main)' : 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    >
                        Certifications
                    </button>
                    <button
                        onClick={() => setActiveTab('bio')}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all whitespace-nowrap text-sm sm:text-base"
                        style={{
                            backgroundColor: activeTab === 'bio' ? 'var(--accent)' : 'var(--bg-elevated)',
                            color: activeTab === 'bio' ? 'var(--bg-main)' : 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    >
                        Bio
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all whitespace-nowrap text-sm sm:text-base"
                        style={{
                            backgroundColor: activeTab === 'stats' ? 'var(--accent)' : 'var(--bg-elevated)',
                            color: activeTab === 'stats' ? 'var(--bg-main)' : 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    >
                        Stats
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all whitespace-nowrap text-sm sm:text-base"
                        style={{
                            backgroundColor: activeTab === 'settings' ? 'var(--accent)' : 'var(--bg-elevated)',
                            color: activeTab === 'settings' ? 'var(--bg-main)' : 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    >
                        Settings
                    </button>
                </div>

                {/* Specialties Tab */}
                {activeTab === 'specialties' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 
                                className="text-xl font-bold"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                Manage Specialties
                            </h2>
                            <button
                                onClick={() => setShowAddSpecialty(!showAddSpecialty)}
                                className="px-4 py-2 rounded-lg font-bold"
                                style={{
                                    backgroundColor: 'var(--accent)',
                                    color: 'var(--bg-main)'
                                }}
                            >
                                {showAddSpecialty ? 'Cancel' : '+ Add Specialty'}
                            </button>
                        </div>

                        {/* Add Specialty Form */}
                        {showAddSpecialty && (
                            <form onSubmit={handleCreateSpecialty} className="mb-6 p-6 rounded-lg border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>New Specialty</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Icon</label>
                                        <input name="icon" type="text" placeholder="👗" className="w-full p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Title *</label>
                                        <input name="title" type="text" required className="w-full p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Description *</label>
                                        <textarea name="description" required rows={3} className="w-full p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <button type="submit" className="w-full py-3 rounded-lg font-bold" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-main)' }}>Create Specialty</button>
                                </div>
                            </form>
                        )}

                        <div className="grid gap-4">
                            {specialties.map((specialty) => (
                                <div
                                    key={specialty.id}
                                    className="p-6 rounded-lg border"
                                    style={{
                                        backgroundColor: 'var(--bg-elevated)',
                                        borderColor: 'var(--border-subtle)'
                                    }}
                                >
                                    {editingSpecialty?.id === specialty.id ? (
                                        <form onSubmit={handleUpdateSpecialty} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Icon</label>
                                                <input name="icon" type="text" defaultValue={specialty.icon} className="w-full p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Title *</label>
                                                <input name="title" type="text" defaultValue={specialty.title} required className="w-full p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Description *</label>
                                                <textarea name="description" defaultValue={specialty.description} required rows={3} className="w-full p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="submit" className="flex-1 py-2 rounded-lg font-bold" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-main)' }}>Save</button>
                                                <button type="button" onClick={() => setEditingSpecialty(null)} className="flex-1 py-2 rounded-lg font-bold" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>Cancel</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        {specialty.icon && <span className="text-2xl">{specialty.icon}</span>}
                                                        <h3 
                                                            className="text-lg font-bold"
                                                            style={{ color: 'var(--text-primary)' }}
                                                        >
                                                            {specialty.title}
                                                        </h3>
                                                    </div>
                                                    <p style={{ color: 'var(--text-muted)' }}>
                                                        {specialty.description}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingSpecialty(specialty)}
                                                        className="px-3 py-1 rounded text-sm"
                                                        style={{ 
                                                            border: '1px solid var(--border-subtle)',
                                                            color: 'var(--text-muted)'
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSpecialty(specialty.id)}
                                                        className="px-3 py-1 rounded text-sm"
                                                        style={{ 
                                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                            color: '#ef4444'
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 
                                className="text-xl font-bold"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                Manage Projects
                            </h2>
                            <button
                                onClick={() => setShowAddProject(!showAddProject)}
                                className="px-4 py-2 rounded-lg font-bold"
                                style={{
                                    backgroundColor: 'var(--accent)',
                                    color: 'var(--bg-main)'
                                }}
                            >
                                {showAddProject ? 'Cancel' : '+ Add Project'}
                            </button>
                        </div>

                        {/* Add Project Form */}
                        {showAddProject && (
                            <form onSubmit={handleCreateProject} className="mb-6 p-6 rounded-lg border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>New Project</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Title *</label>
                                        <input name="title" type="text" required className="w-full p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Category</label>
                                        <input name="category" type="text" placeholder="Editorial, Commercial, etc." className="w-full p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Description *</label>
                                        <textarea name="description" required rows={4} className="w-full p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Tags (comma-separated)</label>
                                        <input name="tags" type="text" placeholder="fashion, luxury, campaign" className="w-full p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Images (select multiple)</label>
                                        <input name="images" type="file" accept="image/*" multiple className="w-full p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <button type="submit" className="w-full py-3 rounded-lg font-bold" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-main)' }}>Create Project</button>
                                </div>
                            </form>
                        )}

                        <div className="grid gap-4">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="p-4 sm:p-6 rounded-lg border"
                                    style={{
                                        backgroundColor: 'var(--bg-elevated)',
                                        borderColor: 'var(--border-subtle)'
                                    }}
                                >
                                    {editingProject?.id === project.id ? (
                                        <form onSubmit={handleUpdateProject} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Title *</label>
                                                <input name="title" type="text" required defaultValue={project.title} className="w-full p-3 rounded-lg border text-sm sm:text-base" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Category</label>
                                                <input name="category" type="text" defaultValue={project.category} placeholder="Editorial, Commercial, etc." className="w-full p-3 rounded-lg border text-sm sm:text-base" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Description *</label>
                                                <textarea name="description" required rows={3} defaultValue={project.description} className="w-full p-3 rounded-lg border text-sm sm:text-base" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Tags (comma-separated)</label>
                                                <input name="tags" type="text" defaultValue={project.tags?.join(', ')} placeholder="fashion, luxury, campaign" className="w-full p-3 rounded-lg border text-sm sm:text-base" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
                                            </div>
                                            
                                            {/* Display existing images with delete buttons */}
                                            {project.images && project.images.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Current Images</label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                        {project.images.map((img: any) => (
                                                            <div key={img.id} className="relative group">
                                                                <img
                                                                    src={`${import.meta.env.VITE_BACKEND_URL || ''}${img.url}`}
                                                                    alt={project.title}
                                                                    className="w-full h-24 sm:h-32 object-cover rounded"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteProjectImage(project.id, img.id)}
                                                                    className="absolute top-1 right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                                                    style={{ 
                                                                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                                                        color: 'white'
                                                                    }}
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Add new images */}
                                            <div className="mt-4">
                                                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Add Images (select multiple)</label>
                                                <div className="flex gap-2 items-center">
                                                    <input id={`add-images-${project.id}`} name="addImages" type="file" accept="image/*" multiple className="p-2 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} onChange={() => handleAddProjectImagesClick(project.id)} />
                                                    {addingImagesProjectId === project.id && (
                                                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Uploading...</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <button type="submit" className="flex-1 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-main)' }}>Save</button>
                                                <button type="button" onClick={() => setEditingProject(null)} className="flex-1 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>Cancel</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                                                <div className="flex-1">
                                                    <h3 
                                                        className="text-base sm:text-lg font-bold mb-1"
                                                        style={{ color: 'var(--text-primary)' }}
                                                    >
                                                        {project.title}
                                                    </h3>
                                                    {project.category && (
                                                        <p 
                                                            className="text-xs sm:text-sm mb-2"
                                                            style={{ color: 'var(--text-muted)' }}
                                                        >
                                                            {project.category}
                                                        </p>
                                                    )}
                                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                                        {project.description}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => setEditingProject(project)}
                                                        className="flex-1 sm:flex-none px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap"
                                                        style={{ 
                                                            border: '1px solid var(--border-subtle)',
                                                            color: 'var(--text-muted)'
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const input = document.getElementById(`add-images-direct-${project.id}`) as HTMLInputElement | null;
                                                            if (input) input.click();
                                                        }}
                                                        className="flex-1 sm:flex-none px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap"
                                                        style={{ 
                                                            border: '1px solid var(--border-subtle)',
                                                            color: 'var(--text-muted)'
                                                        }}
                                                    >
                                                        Add Images
                                                    </button>
                                                    <input id={`add-images-direct-${project.id}`} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={() => handleAddProjectImagesClick(project.id)} />
                                                    <button
                                                        onClick={() => handleDeleteProject(project.id)}
                                                        className="flex-1 sm:flex-none px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap"
                                                        style={{ 
                                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                            color: '#ef4444'
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>

                                            {project.images && project.images.length > 0 && (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                                    {project.images.map((img: any) => (
                                                        <img
                                                            key={img.id}
                                                            src={`${import.meta.env.VITE_BACKEND_URL || ''}${img.url}`}
                                                            alt={project.title}
                                                            className="w-full h-16 sm:h-20 object-cover rounded"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}

                            {projects.length === 0 && (
                                <div 
                                    className="text-center py-12"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    No projects yet. Create your first project!
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Gallery Tab */}
                {activeTab === 'gallery' && (
                    <GallerySection />
                )}

                {/* Certifications Tab */}
                {activeTab === 'certifications' && (
                    <CertificationsSection token={token} />
                )}

                {/* Bio Tab */}
                {activeTab === 'bio' && (
                    <BioSection token={token} />
                )}

                {/* Stats Tab */}
                {activeTab === 'stats' && (
                    <StatsSection token={token} />
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div>
                        <h2 
                            className="text-xl font-bold mb-6"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Settings
                        </h2>

                        {/* Change Credentials Form */}
                        <div 
                            className="p-6 rounded-lg border max-w-2xl"
                            style={{ 
                                backgroundColor: 'var(--bg-elevated)',
                                borderColor: 'var(--border-subtle)'
                            }}
                        >
                            <h3 
                                className="text-lg font-bold mb-4"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                Change Admin Credentials
                            </h3>
                            <p 
                                className="text-sm mb-6"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                Update your admin username and/or password. You must provide your current password.
                            </p>

                            <form onSubmit={handleChangeCredentials} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                        Current Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            required
                                            className="w-full p-3 pr-12 rounded-lg border"
                                            style={{ 
                                                backgroundColor: 'var(--bg-main)', 
                                                borderColor: 'var(--border-subtle)', 
                                                color: 'var(--text-primary)' 
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            {showCurrentPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                                    <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                                        Leave fields blank if you don't want to change them
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                        New Username
                                    </label>
                                    <input
                                        name="newUsername"
                                        type="text"
                                        placeholder="Leave blank to keep current"
                                        className="w-full p-3 rounded-lg border"
                                        style={{ 
                                            backgroundColor: 'var(--bg-main)', 
                                            borderColor: 'var(--border-subtle)', 
                                            color: 'var(--text-primary)' 
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Leave blank to keep current"
                                            className="w-full p-3 pr-12 rounded-lg border"
                                            style={{ 
                                                backgroundColor: 'var(--bg-main)', 
                                                borderColor: 'var(--border-subtle)', 
                                                color: 'var(--text-primary)' 
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            {showNewPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            className="w-full p-3 pr-12 rounded-lg border"
                                            style={{ 
                                                backgroundColor: 'var(--bg-main)', 
                                                borderColor: 'var(--border-subtle)', 
                                                color: 'var(--text-primary)' 
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={changingCredentials}
                                        className="px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
                                        style={{
                                            backgroundColor: 'var(--accent)',
                                            color: 'var(--bg-main)'
                                        }}
                                    >
                                        {changingCredentials ? 'Updating...' : 'Update Credentials'}
                                    </button>
                                </div>

                                <div 
                                    className="p-4 rounded-lg border"
                                    style={{ 
                                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                        borderColor: 'rgba(33, 150, 243, 0.3)',
                                        color: 'var(--text-muted)'
                                    }}
                                >
                                    <p className="text-sm">
                                        <strong>Note:</strong> Credentials are stored in the database and will persist automatically. 
                                        No manual configuration needed.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
