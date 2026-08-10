import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiRequest } from '../utils/api';
import { requestNotificationPermission, scheduleReminder } from '../utils/notifications';
import { User, Mail, Phone, Shield, Globe, LogOut, Home, List, Plus, BarChart2, Settings as SettingsIcon, ChevronRight, Bell, Sun, Moon } from 'lucide-react';

function BottomNav({ active, theme }) {
  const navigate = useNavigate();
  const items = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: List, label: 'Transactions', path: '/transactions' },
    { icon: Plus, label: '', path: '/add' },
    { icon: BarChart2, label: 'Reports', path: '/reports' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center" style={{ background: theme.nav, borderTop: `1px solid ${theme.navBorder}` }}>
      {items.map((item, i) => {
        const Icon = item.icon;
        const isAdd = item.label === '';
        const isActive = active === item.path;
        return (
          <button key={i} onClick={() => navigate(item.path)} className="flex-1 py-3 flex flex-col items-center gap-1">
            {isAdd ? (
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center -mt-6" style={{ background: theme.gold }}>
                <Plus size={24} color="#0A1628" />
              </div>
            ) : (
              <>
                <Icon size={20} color={isActive ? theme.gold : theme.muted} />
                <span className="text-xs" style={{ color: isActive ? theme.gold : theme.muted }}>{item.label}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showChangePin, setShowChangePin] = useState(false);
  const [pinForm, setPinForm] = useState({ currentPin: '', newPin: '', confirmPin: '' });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  const handleLogout = () => { logout(); navigate('/'); };

  const handleToggleNotifications = async () => {
    if (notificationsEnabled) { setNotificationsEnabled(false); return; }
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationsEnabled(true);
      scheduleReminder();
      new Notification('SpendSmart reminders enabled', {
        body: 'We will remind you at 6PM every day to log your expenses.',
        icon: '/icon-192.png',
      });
    }
  };

  const handleChangePin = async (e) => {
    e.preventDefault();
    setPinError(''); setPinSuccess('');
    if (!pinForm.currentPin || !pinForm.newPin || !pinForm.confirmPin) { setPinError('Please fill in all fields.'); return; }
    if (pinForm.newPin.length !== 4) { setPinError('New PIN must be exactly 4 digits.'); return; }
    if (pinForm.newPin !== pinForm.confirmPin) { setPinError('New PINs do not match.'); return; }
    setLoading(true);
    try {
      await apiRequest('/auth/change-pin', 'POST', { userId: user.id, currentPin: pinForm.currentPin, newPin: pinForm.newPin });
      setPinSuccess('PIN changed successfully!');
      setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
      setTimeout(() => { setShowChangePin(false); setPinSuccess(''); }, 2000);
    } catch (err) {
      setPinError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
      <div className="px-4 pt-12 pb-4">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-xl font-bold" style={{ color: theme.text }}>Settings</h1>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
            style={{ background: theme.card, color: theme.gold, border: `1px solid ${theme.border}` }}>
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
        <p className="text-sm" style={{ color: theme.subtext }}>Manage your account</p>
      </div>

      <div className="px-4 space-y-3">

        {/* Profile */}
        <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
          <p className="text-xs font-medium mb-3" style={{ color: theme.gold }}>PROFILE</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: theme.input }}>
              <User size={16} color={theme.gold} />
            </div>
            <div>
              <p className="text-xs" style={{ color: theme.subtext }}>Full name</p>
              <p className="text-sm font-medium" style={{ color: theme.text }}>{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: theme.input }}>
              {user?.email ? <Mail size={16} color={theme.gold} /> : <Phone size={16} color={theme.gold} />}
            </div>
            <div>
              <p className="text-xs" style={{ color: theme.subtext }}>{user?.email ? 'Email address' : 'Phone number'}</p>
              <p className="text-sm font-medium" style={{ color: theme.text }}>{user?.email || user?.phone}</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
          <p className="text-xs font-medium mb-3" style={{ color: theme.gold }}>PREFERENCES</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: theme.input }}>
              <Globe size={16} color={theme.gold} />
            </div>
            <div className="flex-1">
              <p className="text-xs" style={{ color: theme.subtext }}>Currency</p>
             <p className="text-sm font-medium" style={{ color: theme.text }}>{user?.currency || 'ZMW'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${theme.border}` }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: theme.input }}>
              <Bell size={16} color={theme.gold} />
            </div>
            <div className="flex-1">
              <p className="text-xs" style={{ color: theme.subtext }}>Daily reminder</p>
              <p className="text-sm font-medium" style={{ color: theme.text }}>Remind me to log expenses</p>
            </div>
            <button
              onClick={handleToggleNotifications}
              className="w-12 h-6 rounded-full transition-colors relative"
              style={{ background: notificationsEnabled ? theme.gold : theme.input }}>
              <div className="w-5 h-5 rounded-full absolute top-0.5 transition-all"
                style={{ background: '#fff', left: notificationsEnabled ? '26px' : '2px' }} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
          <p className="text-xs font-medium mb-3" style={{ color: theme.gold }}>SECURITY</p>
          <button onClick={() => setShowChangePin(!showChangePin)} className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: theme.input }}>
              <Shield size={16} color={theme.gold} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs" style={{ color: theme.subtext }}>Balance PIN</p>
              <p className="text-sm font-medium" style={{ color: theme.text }}>Change PIN</p>
            </div>
            <ChevronRight size={16} color={theme.muted} />
          </button>

          {showChangePin && (
            <form onSubmit={handleChangePin} className="mt-4 space-y-3 pt-4" style={{ borderTop: `1px solid ${theme.border}` }}>
              {pinError && <p className="text-xs px-3 py-2 rounded-xl" style={{ background: '#2A1A1A', color: '#E57373' }}>{pinError}</p>}
              {pinSuccess && <p className="text-xs px-3 py-2 rounded-xl" style={{ background: '#0A1E0A', color: '#4CAF50' }}>{pinSuccess}</p>}
              {['currentPin', 'newPin', 'confirmPin'].map((field, i) => (
                <div key={i}>
                  <label className="block text-xs mb-1" style={{ color: theme.subtext }}>
                    {field === 'currentPin' ? 'Current PIN' : field === 'newPin' ? 'New PIN' : 'Confirm New PIN'}
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinForm[field]}
                    onChange={e => setPinForm({ ...pinForm, [field]: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="••••"
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                    style={{ background: theme.input, border: `1px solid ${theme.border}`, color: theme.text }}
                  />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-60"
                style={{ background: theme.gold, color: '#0A1628' }}>
                {loading ? 'Changing...' : 'Change PIN'}
              </button>
            </form>
          )}
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-medium"
          style={{ background: '#1E0A0A', color: '#E57373', border: '1px solid #2A1A1A' }}>
          <LogOut size={16} />
          Sign out
        </button>
      </div>

      <BottomNav active="/settings" theme={theme} />
    </div>
  );
}