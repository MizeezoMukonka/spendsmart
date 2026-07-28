    import { useState } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';
    import { Lock, TrendingUp, User, Eye, EyeOff } from 'lucide-react';

    export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.identifier || !form.password) { setError('Please fill in all fields.'); return; }
        setLoading(true);
        try {
        await login(form.identifier, form.password);
        navigate('/dashboard');
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4" style={{ background: '#0A1628' }}>
        <div className="w-full max-w-sm">

            <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: '#C9A84C' }}>
                <TrendingUp size={32} color="#0A1628" />
            </div>
            <h1 className="text-3xl font-bold text-white">SpendSmart</h1>
            <p className="text-sm mt-1" style={{ color: '#8A9BB5' }}>Know where your money goes</p>
            </div>

            <div className="rounded-2xl p-6" style={{ background: '#111E33' }}>
            <h2 className="text-lg font-semibold text-white mb-5">Sign in</h2>

            {error && (
                <div className="text-sm rounded-xl px-4 py-3 mb-4" style={{ background: '#2A1A1A', color: '#E57373' }}>{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#8A9BB5' }}>Email or Phone number</label>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: '#1A2740' }}>
                    <User size={16} color="#C9A84C" />
                    <input
                    type="text"
                    value={form.identifier}
                    onChange={e => setForm({ ...form, identifier: e.target.value })}
                    placeholder="you@example.com or 0977123456"
                    autoComplete="off"
                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                    />
                </div>
                </div>
                <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#8A9BB5' }}>Password</label>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: '#1A2740' }}>
                    <Lock size={16} color="#C9A84C" />
                    <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    autoComplete="off"
                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword
                        ? <EyeOff size={16} color="#8A9BB5" />
                        : <Eye size={16} color="#8A9BB5" />}
                    </button>
                </div>
                </div>
                <button
                type="submit"
                disabled={loading}
                className="w-full font-semibold py-3 rounded-xl text-sm transition-opacity disabled:opacity-60"
                style={{ background: '#C9A84C', color: '#0A1628' }}
                >
                {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <p className="text-center text-sm mt-5" style={{ color: '#8A9BB5' }}>
                Don't have an account?{' '}
                <Link to="/register" className="font-medium" style={{ color: '#C9A84C' }}>Create one</Link>
            </p>
            </div>

            <p className="text-center text-xs mt-6" style={{ color: '#4A5A70' }}>
            Built for Zambia · Zambian Kwacha (ZMW)
            </p>
        </div>
        </div>
    );
    }