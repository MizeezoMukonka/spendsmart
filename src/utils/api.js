const API = 'https://spendsmart-backend-qgk7.onrender.com/api';

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('ss_token');
  
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API}${endpoint}`, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
};