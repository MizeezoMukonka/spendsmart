    import { useNavigate } from 'react-router-dom';
    import {
    TrendingUp, Shield, Smartphone, BarChart2, CheckCircle,
    ArrowRight, Lock, Wallet, Zap
    } from 'lucide-react';

    export default function Landing() {
    const navigate = useNavigate();

    return (
        <div style={{ background: '#0A1628', minHeight: '100vh' }}>

        {/* Nav */}
        <div className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
            <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#C9A84C' }}>
                <TrendingUp size={20} color="#0A1628" />
            </div>
            <span className="text-white font-bold text-lg">SpendSmart</span>
            </div>
            <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm font-medium px-4 py-2" style={{ color: '#8A9BB5' }}>
                Sign in
            </button>
            <button onClick={() => navigate('/register')}
                className="text-sm font-semibold px-4 py-2 rounded-xl"
                style={{ background: '#C9A84C', color: '#0A1628' }}>
                Get started
            </button>
            </div>
        </div>

        {/* Hero */}
        <div className="px-6 pt-10 pb-16 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: '#111E33', color: '#C9A84C', border: '1px solid #1A2740' }}>
            <Zap size={12} />
            Built for Zambia
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Know where your<br />money goes
            </h1>
            <p className="text-base mb-8" style={{ color: '#8A9BB5' }}>
            SpendSmart is a free expense tracker built for Zambians.
            Track income and expenses, see clear reports, and keep your
            balances private with a personal PIN.
            </p>
            <div className="flex items-center justify-center gap-3">
            <button onClick={() => navigate('/register')}
                className="flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm"
                style={{ background: '#C9A84C', color: '#0A1628' }}>
                Get started free <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/login')}
                className="font-medium px-6 py-3 rounded-xl text-sm"
                style={{ background: '#111E33', color: '#fff', border: '1px solid #1A2740' }}>
                Sign in
            </button>
            </div>
            <p className="text-xs mt-4" style={{ color: '#4A5A70' }}>No credit card needed · Free to start</p>
        </div>

        {/* App preview card */}
        <div className="px-6 max-w-md mx-auto mb-20">
            <div className="rounded-3xl p-5" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
            <p className="text-xs mb-1" style={{ color: '#8A9BB5' }}>Total balance</p>
            <p className="text-3xl font-bold text-white mb-4">K 3,280.00</p>
            <div className="flex gap-3">
                <div className="flex-1 rounded-xl p-3" style={{ background: '#0A1E0A' }}>
                <p className="text-xs mb-1" style={{ color: '#4CAF50' }}>Income</p>
                <p className="text-sm font-semibold text-white">K 8,400.00</p>
                </div>
                <div className="flex-1 rounded-xl p-3" style={{ background: '#1E0A0A' }}>
                <p className="text-xs mb-1" style={{ color: '#E57373' }}>Expenses</p>
                <p className="text-sm font-semibold text-white">K 5,120.00</p>
                </div>
            </div>
            </div>
        </div>

        {/* Features */}
        <div className="px-6 max-w-5xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-white text-center mb-2">Everything you need</h2>
            <p className="text-sm text-center mb-10" style={{ color: '#8A9BB5' }}>
            Simple tools to take control of your money
            </p>

            <div className="grid md:grid-cols-3 gap-4">
            {[
                { icon: Wallet, title: 'Track everything', desc: 'Log your income and expenses in seconds, organized by category.' },
                { icon: Lock, title: 'PIN protected', desc: 'Your balances stay hidden until you enter your personal PIN.' },
                { icon: BarChart2, title: 'Clear reports', desc: 'See exactly where your money goes with simple charts and breakdowns.' },
                { icon: Smartphone, title: 'Phone or email', desc: 'Sign up with your phone number or email — whatever works for you.' },
                { icon: Shield, title: 'Your data is safe', desc: 'Passwords and PINs are encrypted. Only you can see your numbers.' },
                { icon: CheckCircle, title: 'Works everywhere', desc: 'Use SpendSmart on your phone, tablet, or computer — no installs needed.' },
            ].map((f, i) => {
                const Icon = f.icon;
                return (
                <div key={i} className="rounded-2xl p-5" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#1A2740' }}>
                    <Icon size={18} color="#C9A84C" />
                    </div>
                    <p className="text-sm font-semibold text-white mb-1">{f.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#8A9BB5' }}>{f.desc}</p>
                </div>
                );
            })}
            </div>
        </div>

        {/* How it works */}
        <div className="px-6 max-w-3xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-white text-center mb-10">How it works</h2>
            <div className="space-y-4">
            {[
                { step: '1', title: 'Create your account', desc: 'Sign up with your email or phone number — takes less than a minute.' },
                { step: '2', title: 'Add your transactions', desc: 'Log your income and expenses as they happen, organized by category.' },
                { step: '3', title: 'See your reports', desc: 'Check your dashboard and reports any time to see where your money goes.' },
            ].map((s, i) => (
                <div key={i} className="flex items-start gap-4 rounded-2xl p-4" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ background: '#C9A84C', color: '#0A1628' }}>
                    {s.step}
                </div>
                <div>
                    <p className="text-sm font-semibold text-white mb-1">{s.title}</p>
                    <p className="text-xs" style={{ color: '#8A9BB5' }}>{s.desc}</p>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* CTA */}
        <div className="px-6 max-w-2xl mx-auto mb-16 text-center">
            <div className="rounded-3xl p-10" style={{ background: '#111E33', border: '1px solid #1A2740' }}>
            <h2 className="text-2xl font-bold text-white mb-2">Start tracking today</h2>
            <p className="text-sm mb-6" style={{ color: '#8A9BB5' }}>
                Free to use. No card required. Takes one minute.
            </p>
            <button onClick={() => navigate('/register')}
                className="flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm mx-auto"
                style={{ background: '#C9A84C', color: '#0A1628' }}>
                Create your free account <ArrowRight size={16} />
            </button>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-8 text-center" style={{ borderTop: '1px solid #1A2740' }}>
            <p className="text-xs" style={{ color: '#4A5A70' }}>
            SpendSmart · Built for Zambia · Zambian Kwacha (ZMW)
            </p>
            <p className="text-xs mt-1" style={{ color: '#4A5A70' }}>
            Designed and built by <span style={{ color: '#C9A84C' }}>SyntaxSavvy ZM-SSZ</span>
            </p>
        </div>

        </div>
    );
    }