import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/formatCurrency';
import { TrendingUp, TrendingDown, Home, List, Plus, BarChart2, Settings, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#C9A84C', '#4F8EF7', '#4CAF50', '#E57373', '#9C27B0', '#FF9800'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function BottomNav({ active, theme }) {
  const navigate = useNavigate();
  const items = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: List, label: 'Transactions', path: '/transactions' },
    { icon: Plus, label: '', path: '/add' },
    { icon: BarChart2, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
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

export default function Reports() {
  const { transactions } = useData();
  const { balanceVisible } = useAuth();
  const { theme } = useTheme();
  const val = (amount) => balanceVisible ? formatCurrency(amount) : '••••••';

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Get all available years from transactions
  const availableYears = useMemo(() => {
    const years = [...new Set(transactions.map(tx => new Date(tx.date).getFullYear()))];
    return years.sort((a, b) => b - a);
  }, [transactions]);

  // Filter state
  const [filterType, setFilterType] = useState('all'); // 'all', 'year', 'month'
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Filter transactions based on selection
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const date = new Date(tx.date);
      if (filterType === 'year') return date.getFullYear() === selectedYear;
      if (filterType === 'month') return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
      return true;
    });
  }, [transactions, filterType, selectedYear, selectedMonth]);

  const filteredIncome = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const filteredExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const filteredBalance = filteredIncome - filteredExpenses;
  const savingsRate = filteredIncome > 0 ? Math.round(((filteredIncome - filteredExpenses) / filteredIncome) * 100) : 0;

  const monthlyData = useMemo(() => {
    const months = {};
    filteredTransactions.forEach(tx => {
      const month = new Date(tx.date).toLocaleString('en-ZM', { month: 'short' });
      if (!months[month]) months[month] = { month, income: 0, expenses: 0 };
      if (tx.type === 'income') months[month].income += Number(tx.amount);
      else months[month].expenses += Number(tx.amount);
    });
    return Object.values(months);
  }, [filteredTransactions]);

  const categoryData = useMemo(() => {
    const cats = {};
    filteredTransactions.filter(tx => tx.type === 'expense').forEach(tx => {
      if (!cats[tx.category]) cats[tx.category] = { name: tx.category, value: 0 };
      cats[tx.category].value += Number(tx.amount);
    });
    return Object.values(cats).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [filteredTransactions]);

  const filterLabel = () => {
    if (filterType === 'all') return 'All time';
    if (filterType === 'year') return `Year ${selectedYear}`;
    return `${MONTHS[selectedMonth]} ${selectedYear}`;
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold mb-1" style={{ color: theme.text }}>Reports</h1>
        <p className="text-sm" style={{ color: theme.subtext }}>Your financial overview</p>
      </div>

      <div className="px-4 space-y-4">

        {/* Filter section */}
        <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} color={theme.gold} />
            <p className="text-sm font-medium" style={{ color: theme.text }}>Filter period</p>
            <span className="ml-auto text-xs px-2 py-1 rounded-lg font-medium" style={{ background: theme.input, color: theme.gold }}>{filterLabel()}</span>
          </div>

          {/* Filter type tabs */}
          <div className="flex gap-2 p-1 rounded-xl mb-3" style={{ background: theme.input }}>
            {[['all', 'All time'], ['year', 'By year'], ['month', 'By month']].map(([val, label]) => (
              <button key={val} onClick={() => setFilterType(val)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: filterType === val ? theme.gold : 'transparent',
                  color: filterType === val ? '#0A1628' : theme.subtext
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Year selector */}
          {(filterType === 'year' || filterType === 'month') && (
            <div className="mb-3">
              <p className="text-xs mb-2" style={{ color: theme.subtext }}>Select year</p>
              <div className="flex gap-2 flex-wrap">
                {(availableYears.length > 0 ? availableYears : [currentYear]).map(year => (
                  <button key={year} onClick={() => setSelectedYear(year)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
                    style={{
                      background: selectedYear === year ? theme.gold : theme.input,
                      color: selectedYear === year ? '#0A1628' : theme.subtext
                    }}>
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Month selector */}
          {filterType === 'month' && (
            <div>
              <p className="text-xs mb-2" style={{ color: theme.subtext }}>Select month</p>
              <div className="grid grid-cols-4 gap-2">
                {MONTHS.map((month, index) => (
                  <button key={index} onClick={() => setSelectedMonth(index)}
                    className="py-1.5 rounded-xl text-xs font-medium transition-colors"
                    style={{
                      background: selectedMonth === index ? theme.gold : theme.input,
                      color: selectedMonth === index ? '#0A1628' : theme.subtext
                    }}>
                    {month.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl p-3 text-center" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <TrendingUp size={16} color={theme.income} style={{ margin: '0 auto 4px' }} />
            <p className="text-xs mb-1" style={{ color: theme.subtext }}>Income</p>
            <p className="text-xs font-semibold" style={{ color: theme.income }}>{val(filteredIncome)}</p>
          </div>
          <div className="rounded-2xl p-3 text-center" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <TrendingDown size={16} color={theme.expense} style={{ margin: '0 auto 4px' }} />
            <p className="text-xs mb-1" style={{ color: theme.subtext }}>Expenses</p>
            <p className="text-xs font-semibold" style={{ color: theme.expense }}>{val(filteredExpenses)}</p>
          </div>
          <div className="rounded-2xl p-3 text-center" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <BarChart2 size={16} color={theme.gold} style={{ margin: '0 auto 4px' }} />
            <p className="text-xs mb-1" style={{ color: theme.subtext }}>Balance</p>
            <p className="text-xs font-semibold" style={{ color: theme.text }}>{val(filteredBalance)}</p>
          </div>
        </div>

        {/* Savings rate */}
        <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium" style={{ color: theme.text }}>Savings rate</p>
            <p className="text-sm font-semibold" style={{ color: savingsRate >= 20 ? theme.income : theme.expense }}>
              {balanceVisible ? `${savingsRate}%` : '••%'}
            </p>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: theme.input }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(savingsRate, 100)}%`, background: savingsRate >= 20 ? theme.income : theme.expense }} />
          </div>
          <p className="text-xs mt-2" style={{ color: theme.muted }}>
            {savingsRate >= 20 ? 'Great job! You are saving well.' : 'Try to save at least 20% of your income.'}
          </p>
        </div>

        {/* Line chart */}
        <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: theme.text }}>Income vs Expenses — {filterLabel()}</p>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: theme.subtext }} />
                <YAxis tick={{ fontSize: 11, fill: theme.subtext }} />
                <Tooltip
                  formatter={(value) => balanceVisible ? formatCurrency(value) : '••••••'}
                  contentStyle={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', color: theme.text }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: theme.subtext }} />
                <Line type="monotone" dataKey="income" name="Income" stroke={theme.income} strokeWidth={2.5} dot={{ fill: theme.income, strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke={theme.expense} strokeWidth={2.5} dot={{ fill: theme.expense, strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-8 text-sm" style={{ color: theme.muted }}>No data for {filterLabel()}</p>
          )}
        </div>

        {/* Pie chart */}
        <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: theme.text }}>Spending by category — {filterLabel()}</p>
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
                  contentStyle={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', color: theme.text }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: theme.subtext }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-8 text-sm" style={{ color: theme.muted }}>No expense data for {filterLabel()}</p>
          )}
        </div>

        {/* Top categories */}
        {categoryData.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <p className="text-sm font-semibold mb-3" style={{ color: theme.text }}>Top spending categories — {filterLabel()}</p>
            <div className="space-y-3">
              {categoryData.slice(0, 5).map((cat, index) => {
                const percentage = Math.round((cat.value / filteredExpenses) * 100);
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm" style={{ color: theme.subtext }}>{cat.name}</span>
                      <span className="text-sm font-medium" style={{ color: theme.text }}>
                        {balanceVisible ? formatCurrency(cat.value) : '••••••'} · {percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: theme.input }}>
                      <div className="h-full rounded-full" style={{ width: `${percentage}%`, background: COLORS[index % COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      <BottomNav active="/reports" theme={theme} />
    </div>
  );
}