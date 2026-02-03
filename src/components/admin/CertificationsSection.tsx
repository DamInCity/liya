import { useState, useEffect } from 'react';

interface Certification {
    id: string;
    url: string;
    filename: string;
    title?: string;
    uploadedAt: string;
}

interface CertificationsSectionProps {
    token: string;
}

export const CertificationsSection = ({ token }: CertificationsSectionProps) => {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    useEffect(() => {
        loadCertifications();
    }, []);

    const loadCertifications = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/certifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setCertifications(data.certifications || []);
            }
        } catch (error) {
            console.error('Error loading certifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        setUploading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/certifications/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                await loadCertifications();
                form.reset();
                alert('Certification uploaded successfully!');
            } else {
                alert('Failed to upload certification');
            }
        } catch (error) {
            console.error('Error uploading certification:', error);
            alert('Failed to upload certification');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this certification?')) return;

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/certifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setCertifications(certifications.filter(cert => cert.id !== id));
                alert('Certification deleted successfully!');
            } else {
                alert('Failed to delete certification');
            }
        } catch (error) {
            console.error('Error deleting certification:', error);
            alert('Failed to delete certification');
        }
    };

    const handleUpdateTitle = async (id: string) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/certifications/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle })
            });

            if (response.ok) {
                setCertifications(certifications.map(cert => 
                    cert.id === id ? { ...cert, title: editTitle } : cert
                ));
                setEditingId(null);
                setEditTitle('');
            } else {
                alert('Failed to update title');
            }
        } catch (error) {
            console.error('Error updating title:', error);
            alert('Failed to update title');
        }
    };

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    if (loading) {
        return <div style={{ color: 'var(--text-muted)' }}>Loading certifications...</div>;
    }

    return (
        <div>
            {/* Upload Form */}
            <div className="mb-8 p-6 rounded-lg border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Upload Certification
                </h3>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                            Certification Image
                        </label>
                        <input 
                            name="image" 
                            type="file" 
                            accept="image/*"
                            required
                            className="w-full p-3 rounded-lg border" 
                            style={{ 
                                backgroundColor: 'var(--bg-main)', 
                                borderColor: 'var(--border-subtle)', 
                                color: 'var(--text-primary)' 
                            }} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                            Title (Optional)
                        </label>
                        <input 
                            name="title" 
                            type="text" 
                            placeholder="e.g., Professional Modeling Certification"
                            className="w-full p-3 rounded-lg border" 
                            style={{ 
                                backgroundColor: 'var(--bg-main)', 
                                borderColor: 'var(--border-subtle)', 
                                color: 'var(--text-primary)' 
                            }} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={uploading}
                        className="px-6 py-3 rounded-lg font-bold uppercase tracking-wider"
                        style={{ 
                            backgroundColor: 'var(--accent)', 
                            color: 'var(--bg-main)',
                            opacity: uploading ? 0.5 : 1
                        }}
                    >
                        {uploading ? 'Uploading...' : 'Upload Certification'}
                    </button>
                </form>
            </div>

            {/* Certifications Stats */}
            <div className="mb-6">
                <p style={{ color: 'var(--text-muted)' }}>
                    Total Certifications: {certifications.length}
                </p>
            </div>

            {/* Certifications Grid */}
            {certifications.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No certifications uploaded yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certifications.map((cert) => (
                        <div 
                            key={cert.id}
                            className="border rounded-lg overflow-hidden"
                            style={{ borderColor: 'var(--border-subtle)' }}
                        >
                            <div className="aspect-[3/4] relative">
                                <img 
                                    src={`${backendUrl}${cert.url}`}
                                    alt={cert.title || 'Certification'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 space-y-3">
                                {editingId === cert.id ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            placeholder="Enter title"
                                            className="w-full p-2 rounded border text-sm"
                                            style={{ 
                                                backgroundColor: 'var(--bg-main)', 
                                                borderColor: 'var(--border-subtle)', 
                                                color: 'var(--text-primary)' 
                                            }}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdateTitle(cert.id)}
                                                className="px-3 py-1 rounded text-sm"
                                                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-main)' }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditTitle('');
                                                }}
                                                className="px-3 py-1 rounded text-sm border"
                                                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                            {cert.title || 'Untitled'}
                                        </p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            Uploaded: {new Date(cert.uploadedAt).toLocaleDateString()}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingId(cert.id);
                                                    setEditTitle(cert.title || '');
                                                }}
                                                className="px-3 py-1 rounded text-sm border"
                                                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                                            >
                                                Edit Title
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cert.id)}
                                                className="px-3 py-1 rounded text-sm"
                                                style={{ backgroundColor: '#ef4444', color: 'white' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
