import { useState, useEffect } from 'react';

interface StatsData {
    languages: string;
    height: string;
    weight: string;
    bust: string;
    waist: string;
    hips: string;
    shoeSize: string;
    hairColor: string;
    eyeColor: string;
    skinTone: string;
}

export const StatsSection = ({ token }: { token: string }) => {
    const [stats, setStats] = useState<StatsData>({
        languages: '',
        height: '',
        weight: '',
        bust: '',
        waist: '',
        hips: '',
        shoeSize: '',
        hairColor: '',
        eyeColor: '',
        skinTone: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/stats/public`);
            const data = await response.json();
            setStats({
                languages: data.languages || '',
                height: data.height || '',
                weight: data.weight || '',
                bust: data.bust || '',
                waist: data.waist || '',
                hips: data.hips || '',
                shoeSize: data.shoeSize || '',
                hairColor: data.hairColor || '',
                eyeColor: data.eyeColor || '',
                skinTone: data.skinTone || ''
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/stats`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(stats)
            });

            if (!response.ok) {
                throw new Error('Failed to update stats');
            }

            alert('Stats updated successfully!');
        } catch (error: any) {
            alert(error.message || 'Failed to update stats');
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
                Edit Your Profile
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Languages
                        </label>
                        <input
                            type="text"
                            value={stats.languages}
                            onChange={(e) => setStats({ ...stats, languages: e.target.value })}
                            placeholder="e.g., English, Amharic"
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
                            Height
                        </label>
                        <input
                            type="text"
                            value={stats.height}
                            onChange={(e) => setStats({ ...stats, height: e.target.value })}
                            placeholder="e.g., 1.75 m (5 ft 9 in)"
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
                            Weight
                        </label>
                        <input
                            type="text"
                            value={stats.weight}
                            onChange={(e) => setStats({ ...stats, weight: e.target.value })}
                            placeholder="e.g., 56 kg"
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
                            Bust / Chest
                        </label>
                        <input
                            type="text"
                            value={stats.bust}
                            onChange={(e) => setStats({ ...stats, bust: e.target.value })}
                            placeholder="e.g., 32 in"
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
                            Waist
                        </label>
                        <input
                            type="text"
                            value={stats.waist}
                            onChange={(e) => setStats({ ...stats, waist: e.target.value })}
                            placeholder="e.g., 26 in"
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
                            Hips
                        </label>
                        <input
                            type="text"
                            value={stats.hips}
                            onChange={(e) => setStats({ ...stats, hips: e.target.value })}
                            placeholder="e.g., 38 in"
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
                            Shoe Size
                        </label>
                        <input
                            type="text"
                            value={stats.shoeSize}
                            onChange={(e) => setStats({ ...stats, shoeSize: e.target.value })}
                            placeholder="e.g., 39"
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
                            Hair Color
                        </label>
                        <input
                            type="text"
                            value={stats.hairColor}
                            onChange={(e) => setStats({ ...stats, hairColor: e.target.value })}
                            placeholder="e.g., Black"
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
                            Eye Color
                        </label>
                        <input
                            type="text"
                            value={stats.eyeColor}
                            onChange={(e) => setStats({ ...stats, eyeColor: e.target.value })}
                            placeholder="e.g., Black"
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
                            Skin Tone
                        </label>
                        <input
                            type="text"
                            value={stats.skinTone}
                            onChange={(e) => setStats({ ...stats, skinTone: e.target.value })}
                            placeholder="e.g., Dark tan / medium"
                            className="w-full p-3 rounded-lg border"
                            style={{ 
                                backgroundColor: 'var(--bg-main)', 
                                borderColor: 'var(--border-subtle)', 
                                color: 'var(--text-primary)' 
                            }}
                        />
                    </div>
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
