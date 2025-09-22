import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import authStorage, {
  AUTH_STORAGE_EVENTS,
  AUTH_STORAGE_KEYS,
} from '../utils/authStorage';

export const useAuth = () => {
  const initialAuth = authStorage.getAuth();
  const [token, setToken] = useState(initialAuth.token);
  const [user, setUser] = useState(initialAuth.user);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const syncStateFromStorage = useCallback(() => {
    const { token: nextToken, user: nextUser } = authStorage.getAuth();
    setToken(nextToken || null);
    setUser(nextUser || null);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleAuthChange = () => {
      syncStateFromStorage();
    };

    const handleStorageEvent = (event) => {
      if (
        event.key &&
        event.key !== AUTH_STORAGE_KEYS.LOCAL_STORAGE_TOKEN_KEY &&
        event.key !== AUTH_STORAGE_KEYS.LOCAL_STORAGE_USER_KEY
      ) {
        return;
      }

      syncStateFromStorage();
    };

    window.addEventListener(AUTH_STORAGE_EVENTS.CHANGE, handleAuthChange);
    window.addEventListener(AUTH_STORAGE_EVENTS.LOGOUT, handleAuthChange);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener(AUTH_STORAGE_EVENTS.CHANGE, handleAuthChange);
      window.removeEventListener(AUTH_STORAGE_EVENTS.LOGOUT, handleAuthChange);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [syncStateFromStorage]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email,
        password,
      });

      const { token: accessToken, user: userPayload } = response.data;
      const { token: storedToken, user: storedUser } = authStorage.setAuth({
        token: accessToken,
        user: userPayload,
      });

      setToken(storedToken || null);
      setUser(storedUser || null);
      return true;
    } catch (error) {
      console.error('Ошибка авторизации:', error.response?.data || error.message);
      setError('Ошибка авторизации');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    authStorage.clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  return {
    token,
    user,
    login,
    logout,
    error,
    loading,
    isAuthenticated: Boolean(token),
  };
};
