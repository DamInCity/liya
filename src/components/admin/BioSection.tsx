import { useState, useEffect } from 'react';

interface BioData {
    name: string;
    title: string;
    description: string;
    location: string;
}

export const BioSection = ({ token }: { token: string }) => {
    const [bio, setBio] = useState<BioData>({
        name: '',
        title: '',
        description: '',
        location: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBio();
    }, []);

    const fetchBio = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/bio/public`);
            const data = await response.json();
            setBio({
                name: data.name || '',
                title: data.title || '',
                description: data.description || '',
                location: data.location || ''
            });
        } catch (error) {
            console.error('Error fetching bio:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/bio`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bio)
            });

            if (!response.ok) {
                throw new Error('Failed to update bio');
            }

            alert('Bio updated successfully!');
        } catch (error: any) {
            alert(error.message || 'Failed to update bio');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>Loading...</div>;
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Edit Hero Bio Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Name *
                    </label>
                    <input
                        type="text"
                        value={bio.name}
                        onChange={(e) => setBio({ ...bio, name: e.target.value })}
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
                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Title *
                    </label>
                    <input
                        type="text"
                        value={bio.title}
                        onChange={(e) => setBio({ ...bio, title: e.target.value })}
                        required
                        placeholder="e.g., Professional Model · 3 Years Experience"
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
                        Description *
                    </label>
                    <textarea
                        value={bio.description}
                        onChange={(e) => setBio({ ...bio, description: e.target.value })}
                        required
                        rows={4}
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
                        Location & Availability *
                    </label>
                    <input
                        type="text"
                        value={bio.location}
                        onChange={(e) => setBio({ ...bio, location: e.target.value })}
                        required
                        placeholder="e.g., Addis Ababa, Ethiopia · Available for..."
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
                    disabled={saving}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold transition-all"
                    style={{
                        backgroundColor: saving ? 'var(--border-subtle)' : 'var(--accent)',
                        color: 'var(--bg-main)',
                        opacity: saving ? 0.6 : 1
                    }}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};
