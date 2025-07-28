import { useState } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5555/api/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user)); // ✅

      setToken(token);
      setUser(user); // ✅
      return true;
    } catch (error) {
      console.error("Ошибка авторизации:", error.response?.data || error.message);
      setError("Ошибка авторизации");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return {
    token,
    user,
    login,
    logout,
    error,
    loading,
    isAuthenticated: !!token,
  };
};
