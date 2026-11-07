import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth.js';
import { setUnauthorizedHandler } from '../api/axios.js';
import { ROLES } from '../utils/constants.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('al_token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('al_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => logout());
  }, [logout]);

  const refreshMe = useCallback(async () => {
    if (!localStorage.getItem('al_token')) {
      setLoading(false);
      return null;
    }
    try {
      const res = await authApi.me();
      setUser(res.data.user);
      setProfile(res.data.profile);
      return res.data;
    } catch {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('al_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    await refreshMe();
    return res.data.user;
  };

  const register = async (body) => {
    const res = await authApi.register(body);
    localStorage.setItem('al_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    await refreshMe();
    return res.data.user;
  };

  const homePath = useMemo(() => {
    if (!user) return '/';
    if (user.role === ROLES.ADMIN) return '/admin';
    if (user.role === ROLES.ALUMNUS) return '/alumni';
    return '/dashboard';
  }, [user]);

  const value = {
    user,
    profile,
    token,
    loading,
    login,
    register,
    logout,
    refreshMe,
    homePath,
    isPendingAlumni:
      user?.role === ROLES.ALUMNUS && user?.verifyStatus === 'pending',
    isVerifiedAlumni:
      user?.role === ROLES.ALUMNUS && user?.verifyStatus === 'approved',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
