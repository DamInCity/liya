import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';

export const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(username, password);
            localStorage.setItem('adminToken', response.token);
            localStorage.setItem('adminUser', JSON.stringify(response.user));
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center px-4"
            style={{ backgroundColor: 'var(--bg-main)' }}
        >
            <div 
                className="w-full max-w-md p-8 rounded-2xl border"
                style={{ 
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-subtle)'
                }}
            >
                <div className="text-center mb-8">
                    <h1 
                        className="text-3xl font-bold mb-2"
                        style={{ 
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-heading)' 
                        }}
                    >
                        Admin Login
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Sign in to manage your portfolio
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div 
                            className="p-4 rounded-lg text-sm"
                            style={{ 
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.3)'
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div>
                        <label 
                            className="block text-sm font-bold mb-2 uppercase tracking-wider"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border outline-none transition-all"
                            style={{
                                backgroundColor: 'var(--bg-main)',
                                borderColor: 'var(--border-subtle)',
                                color: 'var(--text-primary)'
                            }}
                            placeholder="admin"
                        />
                    </div>

                    <div>
                        <label 
                            className="block text-sm font-bold mb-2 uppercase tracking-wider"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 pr-12 rounded-lg border outline-none transition-all"
                                style={{
                                    backgroundColor: 'var(--bg-main)',
                                    borderColor: 'var(--border-subtle)',
                                    color: 'var(--text-primary)'
                                }}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                {showPassword ? (
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-bold transition-all disabled:opacity-50"
                        style={{
                            backgroundColor: 'var(--accent)',
                            color: 'var(--bg-main)'
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                        Default credentials: admin / admin123
                    </div>
                </form>
            </div>
        </div>
    );
};
