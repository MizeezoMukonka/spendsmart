import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { Eye, EyeOff, Lock, Delete, TrendingUp, TrendingDown, Home, List, Plus, BarChart2, Settings } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { scheduleReminder } from '../utils/notifications';

function PinModal({ onSuccess, onClose }) {
  const { user } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKey = (val) => {
    if (val === 'del') { setPin(p => p.slice(0, -1)); return; }
    if (pin.length >= 4) return;
    const next = pin + val;
    setPin(next);
  };

  const handleSubmitPin = async () => {
    if (pin.length !== 4) return;
    try {
      const result = await apiRequest('/auth/verify-pin', 'POST', {
        userId: user.id,
        pin: pin,
      });
      if (result.success) { onSuccess(); }
      else { setError(true); setTimeout(() => { setPin(''); setError(false); }, 600); }
    } catch (err) {
      setError(true);
      setTimeout(() => { setPin(''); setError(false); }, 600);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-3xl p-6 w-full max-w-xs text-center" style={{ background: '#111E33' }}>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3" style={{ background: '#1A2740' }}>
          <Lock size={24} color="#C9A84C" />
        </div>
        <h3 className="font-semibold text-white mb-1">Enter your PIN</h3>
        <p className="text-sm mb-6" style={{ color: '#8A9BB5' }}>To reveal your balances</p>
        <div className="flex justify-center gap-3 mb-6">
          {[0,1,2,3].map(i => (
            <div key={i} className="w-3 h-3 rounded-full transition-colors" style={{
              background: pin.length > i ? (error ? '#E57373' : '#C9A84C') : '#1A2740',
              border: `2px solid ${pin.length > i ? (error ? '#E57373' : '#C9A84C') : '#2A3D5A'}`
            }} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1','2','3','4','5','6','7','8','9','','0','del'].map((k, i) => (
            k === '' ? <div key={i} /> :
            <button key={i} onClick={() => handleKey(k)}
              className="py-4 rounded-2xl text-lg font-medium transition-colors"
              style={{ background: '#1A2740', color: k === 'del' ? '#8A9BB5' : '#ffffff' }}>
              {k === 'del' ? <Delete size={18} style={{ margin: '0 auto' }} /> : k}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmitPin}
          disabled={pin.length !== 4}
          className="w-full py-3 rounded-2xl text-sm font-semibold mb-3 transition-opacity disabled:opacity-40"
          style={{ background: '#C9A84C', color: '#0A1628' }}>
          Enter
        </button>
        <button onClick={onClose} className="text-sm" style={{ color: '#8A9BB5' }}>Cancel</button>
      </div>
    </div>
  );
}

function BottomNav({ active }) {
  const navigate = useNavigate();
  const items = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: List, label: 'Transactions', path: '/transactions' },
    { icon: Plus, label: '', path: '/add' },
    { icon: BarChart2, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center" style={{ background: '#111E33', borderTop: '1px solid #1A2740' }}>
      {items.map((item, i) => {
        const Icon = item.icon;
        const isAdd = item.label === '';
        const isActive = active === item.path;
        return (
          <button key={i} onClick={() => navigate(item.path)}
            className="flex-1 py-3 flex flex-col items-center gap-1">
            {isAdd ? (
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center -mt-6 shadow-lg" style={{ background: '#C9A84C' }}>
                <Plus size={24} color="#0A1628" />
              </div>
            ) : (
              <>
                <Icon size={20} color={isActive ? '#C9A84C' : '#4A5A70'} />
                <span className="text-xs" style={{ color: isActive ? '#C9A84C' : '#4A5A70' }}>{item.label}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const { user, balanceVisible, revealBalance, hideBalance } = useAuth();
  const { transactions, totalIncome, totalExpenses, balance } = useData();
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      scheduleReminder();
    }
  }, []);

  const recent = transactions.slice(0, 5);
  const val = (amount) => balanceVisible ? formatCurrency(amount) : '••••••';

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0A1628' }}>
      {showPin && (
        <PinModal
          onSuccess={() => { revealBalance(); setShowPin(false); }}
          onClose={() => setShowPin(false)}
        />
      )}

      <div className="px-4 pt-12 pb-6" style={{ background: '#0A1628' }}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-sm mb-1" style={{ color: '#8A9BB5' }}>{greeting()}</p>
            <h1 className="text-xl font-bold text-white">{user?.name}</h1>
          </div>
          <button
            onClick={() => balanceVisible ? hideBalance() : setShowPin(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
            style={{ background: '#111E33', color: '#C9A84C', border: '1px solid #1A2740' }}>
            {balanceVisible ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Reveal</>}
          </button>
        </div>

        <div className="rounded-2xl p-5 mb-4" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
          <p className="text-xs mb-1" style={{ color: '#8A9BB5' }}>Total Balance</p>
          <p className="text-3xl font-bold text-white mb-4">{val(balance)}</p>
          <div className="flex gap-4">
            <div className="flex-1 rounded-xl p-3" style={{ background: '#0A1E0A' }}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} color="#4CAF50" />
                <span className="text-xs" style={{ color: '#4CAF50' }}>Income</span>
              </div>
              <p className="text-sm font-semibold text-white">{val(totalIncome)}</p>
            </div>
            <div className="flex-1 rounded-xl p-3" style={{ background: '#1E0A0A' }}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown size={14} color="#E57373" />
                <span className="text-xs" style={{ color: '#E57373' }}>Expenses</span>
              </div>
              <p className="text-sm font-semibold text-white">{val(totalExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-white">Recent transactions</h2>
          <button onClick={() => window.location.href = '/transactions'} className="text-xs font-medium" style={{ color: '#C9A84C' }}>See all</button>
        </div>

        <div className="space-y-3">
          {recent.length === 0 && (
            <div className="text-center py-12 text-sm" style={{ color: '#4A5A70' }}>
              No transactions yet — tap + to add one
            </div>
          )}
          {recent.map(tx => (
            <div key={tx.id} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: tx.type === 'income' ? '#0A1E0A' : '#1E0A0A' }}>
                {tx.type === 'income'
                  ? <TrendingUp size={18} color="#4CAF50" />
                  : <TrendingDown size={18} color="#E57373" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{tx.description || tx.category}</p>
                <p className="text-xs" style={{ color: '#4A5A70' }}>{tx.category} · {formatDate(tx.date)}</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: tx.type === 'income' ? '#4CAF50' : '#E57373' }}>
                {tx.type === 'income' ? '+' : '-'}{val(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="/dashboard" />
    </div>
  );
}