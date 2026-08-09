    import { createContext, useContext, useState, useEffect } from 'react';

    const ThemeContext = createContext();

    export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('ss_theme');
        return saved ? saved === 'dark' : true; // default dark
    });

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        localStorage.setItem('ss_theme', next ? 'dark' : 'light');
    };

    const theme = {
        isDark,
        bg: isDark ? '#0A1628' : '#F4F6FA',
        card: isDark ? '#111E33' : '#FFFFFF',
        border: isDark ? '#1A2740' : '#E2E8F0',
        text: isDark ? '#FFFFFF' : '#0A1628',
        subtext: isDark ? '#8A9BB5' : '#64748B',
        muted: isDark ? '#4A5A70' : '#94A3B8',
        input: isDark ? '#1A2740' : '#F1F5F9',
        nav: isDark ? '#111E33' : '#FFFFFF',
        navBorder: isDark ? '#1A2740' : '#E2E8F0',
        gold: '#C9A84C',
        income: '#4CAF50',
        expense: '#E57373',
        incomeBg: isDark ? '#0A1E0A' : '#F0FDF4',
        expenseBg: isDark ? '#1E0A0A' : '#FFF5F5',
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
        {children}
        </ThemeContext.Provider>
    );
    }

    export const useTheme = () => useContext(ThemeContext);