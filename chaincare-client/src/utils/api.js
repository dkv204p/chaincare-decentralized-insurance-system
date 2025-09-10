const API_URL = 'http://localhost:5000/api';

export const api = {
  async post(endpoint, body, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    return response.json();
  },
  async get(endpoint, token) {
    const headers = { 'Authorization': `Bearer ${token}` };
    const response = await fetch(`${API_URL}${endpoint}`, { headers });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    return response.json();
  },
};