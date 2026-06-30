import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useAuth } from './AuthContext';
import { ShoppingCart, Bus, Smartphone, Home, Heart, Music, DollarSign, Briefcase, Store, CreditCard, PiggyBank } from 'lucide-react';

const DataContext = createContext();

const DEFAULT_CATEGORIES = [
  { id: 1,  name: 'Food & Groceries', icon: ShoppingCart, type: 'expense' },
  { id: 2,  name: 'Transport',        icon: Bus,          type: 'expense' },
  { id: 3,  name: 'Airtime & Data',   icon: Smartphone,   type: 'expense' },
  { id: 4,  name: 'Rent & Bills',     icon: Home,         type: 'expense' },
  { id: 5,  name: 'Health',           icon: Heart,        type: 'expense' },
  { id: 6,  name: 'Entertainment',    icon: Music,        type: 'expense' },
  { id: 7,  name: 'Other Expense',    icon: DollarSign,   type: 'expense' },
  { id: 8,  name: 'Salary',           icon: Briefcase,    type: 'income'  },
  { id: 9,  name: 'Business',         icon: Store,        type: 'income'  },
  { id: 10, name: 'Mobile Money',     icon: CreditCard,   type: 'income'  },
  { id: 11, name: 'Other Income',     icon: PiggyBank,    type: 'income'  },
];

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/transactions');
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (tx) => {
    try {
      const newTx = await apiRequest('/transactions', 'POST', tx);
      setTransactions(prev => [newTx, ...prev]);
      await fetchTransactions();
    } catch (err) {
      console.error('Failed to add transaction:', err.message);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await apiRequest(`/transactions/${id}`, 'DELETE');
      await fetchTransactions();
    } catch (err) {
      console.error('Failed to delete transaction:', err.message);
    }
  };

  const totalIncome   = transactions.filter(t => t.type === 'income') .reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const balance       = totalIncome - totalExpenses;

  return (
    <DataContext.Provider value={{ transactions, categories, addTransaction, deleteTransaction, totalIncome, totalExpenses, balance, loading, fetchTransactions }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);