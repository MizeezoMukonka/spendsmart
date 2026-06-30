import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { TrendingUp, TrendingDown, Home, List, Plus, BarChart2, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#C9A84C', '#4F8EF7', '#4CAF50', '#E57373', '#9C27B0', '#FF9800'];

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

export default function Reports() {
  const { transactions, totalIncome, totalExpenses, balance } = useData();
  const { balanceVisible } = useAuth();
  const val = (amount) => balanceVisible ? formatCurrency(amount) : '••••••';

  const monthlyData = useMemo(() => {
    const months = {};
    transactions.forEach(tx => {
      const month = new Date(tx.date).toLocaleString('en-ZM', { month: 'short' });
      if (!months[month]) months[month] = { month, income: 0, expenses: 0 };
      if (tx.type === 'income') months[month].income += Number(tx.amount);
      else months[month].expenses += Number(tx.amount);
    });
    return Object.values(months).slice(-6);
  }, [transactions]);

  const categoryData = useMemo(() => {
    const cats = {};
    transactions.filter(tx => tx.type === 'expense').forEach(tx => {
      if (!cats[tx.category]) cats[tx.category] = { name: tx.category, value: 0 };
      cats[tx.category].value += Number(tx.amount);
    });
    return Object.values(cats).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [transactions]);

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0A1628' }}>
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold text-white mb-1">Reports</h1>
        <p className="text-sm" style={{ color: '#8A9BB5' }}>Your financial overview</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl p-3 text-center" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
            <TrendingUp size={16} color="#4CAF50" style={{ margin: '0 auto 4px' }} />
            <p className="text-xs mb-1" style={{ color: '#8A9BB5' }}>Income</p>
            <p className="text-xs font-semibold" style={{ color: '#4CAF50' }}>{val(totalIncome)}</p>
          </div>
          <div className="rounded-2xl p-3 text-center" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
            <TrendingDown size={16} color="#E57373" style={{ margin: '0 auto 4px' }} />
            <p className="text-xs mb-1" style={{ color: '#8A9BB5' }}>Expenses</p>
            <p className="text-xs font-semibold" style={{ color: '#E57373' }}>{val(totalExpenses)}</p>
          </div>
          <div className="rounded-2xl p-3 text-center" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
            <BarChart2 size={16} color="#C9A84C" style={{ margin: '0 auto 4px' }} />
            <p className="text-xs mb-1" style={{ color: '#8A9BB5' }}>Balance</p>
            <p className="text-xs font-semibold text-white">{val(balance)}</p>
          </div>
        </div>

        {/* Savings rate */}
        <div className="rounded-2xl p-4" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-white">Savings rate</p>
            <p className="text-sm font-semibold" style={{ color: savingsRate >= 20 ? '#4CAF50' : '#E57373' }}>
              {balanceVisible ? `${savingsRate}%` : '••%'}
            </p>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1A2740' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(savingsRate, 100)}%`, background: savingsRate >= 20 ? '#4CAF50' : '#E57373' }} />
          </div>
          <p className="text-xs mt-2" style={{ color: '#4A5A70' }}>
            {savingsRate >= 20 ? 'Great job! You are saving well.' : 'Try to save at least 20% of your income.'}
          </p>
        </div>

        {/* Bar chart */}
        <div className="rounded-2xl p-4" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
          <p className="text-sm font-semibold text-white mb-4">Income vs Expenses</p>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2740" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8A9BB5' }} />
                <YAxis tick={{ fontSize: 11, fill: '#8A9BB5' }} />
                <Tooltip
                  formatter={(value) => balanceVisible ? formatCurrency(value) : '••••••'}
                  contentStyle={{ background: '#0A1628', border: '1px solid #1A2740', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="income" name="Income" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#E57373" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-8 text-sm" style={{ color: '#4A5A70' }}>No data yet — add some transactions!</p>
          )}
        </div>

        {/* Pie chart */}
        <div className="rounded-2xl p-4" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
          <p className="text-sm font-semibold text-white mb-4">Spending by category</p>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => balanceVisible ? formatCurrency(value) : '••••••'}
                  contentStyle={{ background: '#0A1628', border: '1px solid #1A2740', borderRadius: '12px', color: '#fff' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#8A9BB5' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-8 text-sm" style={{ color: '#4A5A70' }}>No expense data yet!</p>
          )}
        </div>

        {/* Top categories */}
        {categoryData.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
            <p className="text-sm font-semibold text-white mb-3">Top spending categories</p>
            <div className="space-y-3">
              {categoryData.slice(0, 5).map((cat, index) => {
                const percentage = Math.round((cat.value / totalExpenses) * 100);
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm" style={{ color: '#8A9BB5' }}>{cat.name}</span>
                      <span className="text-sm font-medium text-white">
                        {balanceVisible ? formatCurrency(cat.value) : '••••••'} · {percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1A2740' }}>
                      <div className="h-full rounded-full" style={{ width: `${percentage}%`, background: COLORS[index % COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNav active="/reports" />
    </div>
  );
}