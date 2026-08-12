    import { useState, useRef } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useData } from '../context/DataContext';
    import { useTheme } from '../context/ThemeContext';
    import { ArrowLeft, TrendingUp, TrendingDown, CheckCircle, Camera, X, Loader } from 'lucide-react';
    import { apiRequest } from '../utils/api';

    export default function AddTransaction() {
    const { categories, addTransaction, currency } = useData();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [type, setType] = useState('expense');
    const [form, setForm] = useState({ amount: '', category: '', description: '' });
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanError, setScanError] = useState('');
    const [scannedItems, setScannedItems] = useState([]);
    const [receiptPreview, setReceiptPreview] = useState(null);

    const filtered = categories.filter(c => c.type === type);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.amount || !form.category) return;
        setLoading(true);
        await addTransaction({ ...form, amount: parseFloat(form.amount), type });
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1200);
    };

    const handleReceiptScan = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setScanError('');
        setScannedItems([]);

        const preview = URL.createObjectURL(file);
        setReceiptPreview(preview);

        setScanning(true);

        try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result.split(',')[1];
            const mediaType = file.type;

            try {
            const data = await apiRequest('/receipt/scan', 'POST', {
                imageBase64: base64,
                mediaType,
            });

            if (data.storeName) setForm(prev => ({ ...prev, description: data.description || data.storeName }));
            if (data.totalAmount) setForm(prev => ({ ...prev, amount: data.totalAmount.toString() }));
            if (data.category) setForm(prev => ({ ...prev, category: data.category }));
            if (data.items) setScannedItems(data.items);
            setType('expense');
            } catch (err) {
            setScanError(err.message || 'Could not scan receipt. Please try again.');
            } finally {
            setScanning(false);
            }
        };
        reader.readAsDataURL(file);
        } catch {
        setScanError('Could not read image file.');
        setScanning(false);
        }
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

        {/* Header */}
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

            {/* Receipt scan button */}
            <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <p className="text-xs font-medium mb-3" style={{ color: theme.gold }}>SCAN RECEIPT</p>
            <p className="text-xs mb-3" style={{ color: theme.subtext }}>Take a photo of your receipt and we will fill in the details automatically</p>

            {receiptPreview && (
                <div className="relative mb-3">
                <img src={receiptPreview} alt="Receipt preview" className="w-full rounded-xl object-cover" style={{ maxHeight: '150px' }} />
                <button
                    onClick={() => { setReceiptPreview(null); setScannedItems([]); setScanError(''); }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.6)' }}>
                    <X size={12} color="#fff" />
                </button>
                </div>
            )}

            {scanning && (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: theme.input }}>
                <Loader size={14} color={theme.gold} className="animate-spin" />
                <p className="text-xs" style={{ color: theme.subtext }}>Scanning receipt with AI...</p>
                </div>
            )}

            {scanError && (
                <div className="mb-3 px-3 py-2 rounded-xl" style={{ background: '#2A1A1A' }}>
                <p className="text-xs" style={{ color: '#E57373' }}>{scanError}</p>
                </div>
            )}

            {scannedItems.length > 0 && (
                <div className="mb-3 px-3 py-2 rounded-xl" style={{ background: theme.input }}>
                <p className="text-xs font-medium mb-1" style={{ color: theme.gold }}>Items found:</p>
                {scannedItems.map((item, i) => (
                    <p key={i} className="text-xs" style={{ color: theme.subtext }}>• {item}</p>
                ))}
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleReceiptScan}
                className="hidden"
            />

            <button
                onClick={() => fileInputRef.current.click()}
                disabled={scanning}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-opacity disabled:opacity-50"
                style={{ background: theme.input, color: theme.gold, border: `1px solid ${theme.gold}` }}>
                <Camera size={16} />
                {scanning ? 'Scanning...' : receiptPreview ? 'Scan different receipt' : 'Take photo or upload receipt'}
            </button>
            </div>

            {/* Type toggle */}
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

            {/* Amount */}
            <div className="rounded-2xl p-5" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <p className="text-xs mb-2" style={{ color: theme.subtext }}>Amount ({currency || 'ZMW'})</p>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold" style={{ color: theme.gold }}>{currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : 'K'}</span>
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

            {/* Category */}
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
                        background: theme.input,
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

            {/* Description */}
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

            {/* Submit */}
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