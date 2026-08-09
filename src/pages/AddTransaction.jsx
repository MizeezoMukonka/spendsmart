    import { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useData } from '../context/DataContext';
    import { useTheme } from '../context/ThemeContext';
    import { ArrowLeft, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

    export default function AddTransaction() {
    const { categories, addTransaction } = useData();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [type, setType] = useState('expense');
    const [form, setForm] = useState({ amount: '', category: '', description: '' });
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const filtered = categories.filter(c => c.type === type);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.amount || !form.category) return;
        setLoading(true);
        await addTransaction({ ...form, amount: parseFloat(form.amount), type });
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1200);
    };

    return (
        <div className="min-h-screen pb-10" style={{ background: theme.bg }}>

        {success && (
            <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="rounded-3xl p-8 text-center" style={{ background: theme.card }}>
                <CheckCircle size={48} color={theme.income} style={{ margin: '0 auto 12px' }} />
                <p className="font-semibold text-lg" style={{ color: theme.text }}>Transaction saved!</p>
                <p className="text-sm mt-1" style={{ color: theme.subtext }}>Redirecting to dashboard...</p>
            </div>
            </div>
        )}

        <div className="px-4 pt-12 pb-4 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: theme.card }}>
            <ArrowLeft size={18} color={theme.gold} />
            </button>
            <div>
            <h1 className="text-xl font-bold" style={{ color: theme.text }}>Add Transaction</h1>
            <p className="text-xs" style={{ color: theme.subtext }}>Record your income or expense</p>
            </div>
        </div>

        <div className="px-4 space-y-4">

            <div className="flex p-1 rounded-2xl" style={{ background: theme.card }}>
            <button onClick={() => setType('expense')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{ background: type === 'expense' ? theme.expense : 'transparent', color: type === 'expense' ? '#fff' : theme.subtext }}>
                <TrendingDown size={16} />
                Expense
            </button>
            <button onClick={() => setType('income')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{ background: type === 'income' ? theme.income : 'transparent', color: type === 'income' ? '#fff' : theme.subtext }}>
                <TrendingUp size={16} />
                Income
            </button>
            </div>

            <div className="rounded-2xl p-5" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <p className="text-xs mb-2" style={{ color: theme.subtext }}>Amount (ZMW)</p>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold" style={{ color: theme.gold }}>K</span>
                <input
                type="number"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className="flex-1 bg-transparent text-3xl font-bold focus:outline-none"
                style={{ color: theme.text }}
                />
            </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <p className="text-xs mb-3" style={{ color: theme.subtext }}>Category</p>
            <div className="grid grid-cols-3 gap-2">
                {filtered.map(cat => {
                const Icon = cat.icon;
                return (
                    <button type="button" key={cat.id}
                    onClick={() => setForm({ ...form, category: cat.name })}
                    className="p-3 rounded-xl text-center transition-colors"
                    style={{
                        background: form.category === cat.name ? theme.input : theme.input,
                        border: `1px solid ${form.category === cat.name ? theme.gold : theme.border}`
                    }}>
                    <Icon size={20} color={form.category === cat.name ? theme.gold : theme.subtext} style={{ margin: '0 auto 6px' }} />
                    <div className="text-xs leading-tight" style={{ color: form.category === cat.name ? theme.gold : theme.subtext }}>
                        {cat.name}
                    </div>
                    </button>
                );
                })}
            </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <p className="text-xs mb-2" style={{ color: theme.subtext }}>Description (optional)</p>
            <input
                type="text"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Shoprite groceries"
                className="w-full bg-transparent text-sm focus:outline-none"
                style={{ color: theme.text, caretColor: theme.gold }}
            />
            </div>

            <button
            onClick={handleSubmit}
            disabled={loading || !form.amount || !form.category}
            className="w-full py-4 rounded-2xl text-sm font-semibold transition-opacity disabled:opacity-40"
            style={{ background: theme.gold, color: '#0A1628' }}>
            {loading ? 'Saving...' : 'Save Transaction'}
            </button>

        </div>
        </div>
    );
    }