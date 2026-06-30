import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { TrendingUp, TrendingDown, Trash2, Home, List, Plus, BarChart2, Settings } from 'lucide-react';

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
          <button key={i} onClick={() => navigate(item.path)} className="flex-1 py-3 flex flex-col items-center gap-1">
            {isAdd ? (
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center -mt-6" style={{ background: '#C9A84C' }}>
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

export default function Transactions() {
  const { transactions, deleteTransaction } = useData();
  const { balanceVisible } = useAuth();
  const [filter, setFilter] = useState('all');

  const filtered = transactions.filter(t => filter === 'all' ? true : t.type === filter);
  const val = (amount) => balanceVisible ? formatCurrency(amount) : '••••••';

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0A1628' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold text-white mb-1">Transactions</h1>
        <p className="text-sm" style={{ color: '#8A9BB5' }}>{transactions.length} total records</p>
      </div>

      {/* Filter tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 p-1 rounded-xl" style={{ background: '#111E33' }}>
          {['all', 'income', 'expense'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
              style={{
                background: filter === f ? '#C9A84C' : 'transparent',
                color: filter === f ? '#0A1628' : '#8A9BB5'
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: '#4A5A70' }}>No transactions found</div>
        )}
        {filtered.map(tx => (
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
            <div className="text-right">
              <p className="text-sm font-semibold" style={{ color: tx.type === 'income' ? '#4CAF50' : '#E57373' }}>
                {tx.type === 'income' ? '+' : '-'}{val(tx.amount)}
              </p>
              <button onClick={() => deleteTransaction(tx.id)} className="mt-1">
                <Trash2 size={14} color="#4A5A70" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="/transactions" />
    </div>
  );
}