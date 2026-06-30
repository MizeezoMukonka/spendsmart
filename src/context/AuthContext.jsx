import { createContext, useContext, useState } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ss_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [balanceVisible, setBalanceVisible] = useState(false);

  const login = async (identifier, password) => {
    const data = await apiRequest('/auth/login', 'POST', { identifier, password });
    setUser(data.user);
    localStorage.setItem('ss_user', JSON.stringify(data.user));
    localStorage.setItem('ss_token', data.token);
    return data;
  };

  const register = async (name, email, phone, password, pin) => {
    const data = await apiRequest('/auth/register', 'POST', { name, email, phone, password, pin });
    setUser(data.user);
    localStorage.setItem('ss_user', JSON.stringify(data.user));
    localStorage.setItem('ss_token', data.token);
    return data;
  };

  const verifyPin = async (pin) => {
    const data = await apiRequest('/auth/verify-pin', 'POST', { userId: user.id, pin });
    return data.success;
  };

  const logout = () => {
    setUser(null);
    setBalanceVisible(false);
    localStorage.removeItem('ss_user');
    localStorage.removeItem('ss_token');
  };

  const revealBalance = () => setBalanceVisible(true);
  const hideBalance = () => setBalanceVisible(false);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, verifyPin, balanceVisible, revealBalance, hideBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);