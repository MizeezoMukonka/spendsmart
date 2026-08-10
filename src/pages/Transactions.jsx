import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { TrendingUp, TrendingDown, Trash2, Home, List, Plus, BarChart2, Settings, Calendar } from 'lucide-react';

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

export default function Transactions() {
  const { transactions, deleteTransaction } = useData();
  const { balanceVisible } = useAuth();
  const { theme } = useTheme();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [typeFilter, setTypeFilter] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [showDateFilter, setShowDateFilter] = useState(false);

  const availableYears = useMemo(() => {
    const years = [...new Set(transactions.map(tx => new Date(tx.date).getFullYear()))];
    return years.sort((a, b) => b - a);
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const date = new Date(tx.date);
      const matchesType = typeFilter === 'all' ? true : tx.type === typeFilter;
      const matchesDate =
        filterType === 'all' ? true :
        filterType === 'year' ? date.getFullYear() === selectedYear :
        date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
      return matchesType && matchesDate;
    });
  }, [transactions, typeFilter, filterType, selectedYear, selectedMonth]);

  const val = (amount) => balanceVisible ? formatCurrency(amount) : '••••••';

  const filterLabel = () => {
    if (filterType === 'all') return 'All time';
    if (filterType === 'year') return `${selectedYear}`;
    return `${MONTHS[selectedMonth].slice(0, 3)} ${selectedYear}`;
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
      <div className="px-4 pt-12 pb-4">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-xl font-bold" style={{ color: theme.text }}>Transactions</h1>
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium"
            style={{ background: theme.card, color: theme.gold, border: `1px solid ${theme.border}` }}>
            <Calendar size={13} />
            {filterLabel()}
          </button>
        </div>
        <p className="text-sm" style={{ color: theme.subtext }}>{filtered.length} records</p>
      </div>

      {/* Date filter panel */}
      {showDateFilter && (
        <div className="px-4 mb-3">
          <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <p className="text-xs font-medium mb-3" style={{ color: theme.gold }}>FILTER BY PERIOD</p>

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

            {(filterType === 'year' || filterType === 'month') && (
              <div className="mb-3">
                <p className="text-xs mb-2" style={{ color: theme.subtext }}>Year</p>
                <div className="flex gap-2 flex-wrap">
                  {(availableYears.length > 0 ? availableYears : [currentYear]).map(year => (
                    <button key={year} onClick={() => setSelectedYear(year)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium"
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

            {filterType === 'month' && (
              <div>
                <p className="text-xs mb-2" style={{ color: theme.subtext }}>Month</p>
                <div className="grid grid-cols-4 gap-2">
                  {MONTHS.map((month, index) => (
                    <button key={index} onClick={() => setSelectedMonth(index)}
                      className="py-1.5 rounded-xl text-xs font-medium"
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
        </div>
      )}

      {/* Type filter */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 p-1 rounded-xl" style={{ background: theme.card }}>
          {['all', 'income', 'expense'].map(f => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
              style={{
                background: typeFilter === f ? theme.gold : 'transparent',
                color: typeFilter === f ? '#0A1628' : theme.subtext
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div className="px-4 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: theme.muted }}>
            No transactions found for {filterLabel()}
          </div>
        )}
        {filtered.map(tx => (
          <div key={tx.id} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: tx.type === 'income' ? theme.incomeBg : theme.expenseBg }}>
              {tx.type === 'income'
                ? <TrendingUp size={18} color={theme.income} />
                : <TrendingDown size={18} color={theme.expense} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: theme.text }}>{tx.description || tx.category}</p>
              <p className="text-xs" style={{ color: theme.muted }}>{tx.category} · {formatDate(tx.date)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold" style={{ color: tx.type === 'income' ? theme.income : theme.expense }}>
                {tx.type === 'income' ? '+' : '-'}{val(tx.amount)}
              </p>
              <button onClick={() => deleteTransaction(tx.id)} className="mt-1">
                <Trash2 size={14} color={theme.muted} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="/transactions" theme={theme} />
    </div>
  );
}