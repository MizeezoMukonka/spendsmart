import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Shield, TrendingUp, Phone } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState('email');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', pin: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.password || !form.pin) { setError('Please fill in all fields.'); return; }

if (form.name.trim().length < 3) { setError('Please enter your real full name.'); return; }
if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) { setError('Name should only contain letters.'); return; }
if (form.name.trim().split(' ').length < 2) { setError('Please enter both your first and last name.'); return; }
    if (method === 'email' && !form.email) { setError('Please enter your email address.'); return; }

    if (method === 'phone') {
      if (!form.phone) { setError('Please enter your phone number.'); return; }
      const validPrefixes = ['095', '096', '097', '075', '076', '077'];
      const prefix = form.phone.slice(0, 3);
      if (form.phone.length !== 10 || !validPrefixes.includes(prefix)) {
        setError('Please enter a valid MTN, Airtel or Zamtel number (e.g. 0977123456)');
        return;
      }
    }

    if (form.pin.length !== 4) { setError('PIN must be exactly 4 digits.'); return; }

    setLoading(true);
    try {
      await register(
        form.name,
        method === 'email' ? form.email : null,
        method === 'phone' ? form.phone : null,
        form.password,
        form.pin
      );
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

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: '#C9A84C' }}>
            <TrendingUp size={32} color="#0A1628" />
          </div>
          <h1 className="text-3xl font-bold text-white">SpendSmart</h1>
          <p className="text-sm mt-1" style={{ color: '#8A9BB5' }}>Know where your money goes</p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#111E33' }}>
          <h2 className="text-lg font-semibold text-white mb-4">Create account</h2>

          <div className="flex p-1 rounded-xl mb-4" style={{ background: '#1A2740' }}>
            <button type="button" onClick={() => setMethod('email')}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: method === 'email' ? '#C9A84C' : 'transparent', color: method === 'email' ? '#0A1628' : '#8A9BB5' }}>
              <Mail size={14} /> Email
            </button>
            <button type="button" onClick={() => setMethod('phone')}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: method === 'phone' ? '#C9A84C' : 'transparent', color: method === 'phone' ? '#0A1628' : '#8A9BB5' }}>
              <Phone size={14} /> Phone
            </button>
          </div>

          {error && (
            <div className="text-sm rounded-xl px-4 py-3 mb-4" style={{ background: '#2A1A1A', color: '#E57373' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#8A9BB5' }}>Full name</label>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: '#1A2740' }}>
                <User size={16} color="#C9A84C" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name"
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {method === 'email' ? (
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#8A9BB5' }}>Email address</label>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: '#1A2740' }}>
                  <Mail size={16} color="#C9A84C" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#8A9BB5' }}>Phone number</label>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: '#1A2740' }}>
                  <Phone size={16} color="#C9A84C" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="09XXXXXXXX"
                    maxLength={10}
                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: '#4A5A70' }}>Works with MTN, Airtel & Zamtel numbers</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#8A9BB5' }}>Password</label>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: '#1A2740' }}>
                <Lock size={16} color="#C9A84C" />
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#8A9BB5' }}>4-digit PIN (to reveal balances)</label>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: '#1A2740' }}>
                <Shield size={16} color="#C9A84C" />
                <input
                  type="password"
                  value={form.pin}
                  onChange={e => setForm({ ...form, pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  placeholder="••••"
                  maxLength={4}
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold py-3 rounded-xl text-sm transition-opacity disabled:opacity-60"
              style={{ background: '#C9A84C', color: '#0A1628' }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: '#8A9BB5' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: '#C9A84C' }}>Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#4A5A70' }}>
          Built for Zambia · Zambian Kwacha (ZMW)
        </p>
      </div>
    </div>
  );
}