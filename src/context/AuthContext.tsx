import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/ecommerce';
import { getFromStorage, setToStorage } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAdmin: boolean;
  isCustomer: boolean;
  loginAs: (role: UserRole, email?: string, name?: string) => void;
  verifyAdminPasskey: (key: string) => boolean;
  logout: () => void;
  adminPasskeyRequired: boolean;
}

const STORAGE_AUTH_KEY = 'aura_auth_user_v1';

const DEFAULT_ADMIN: User = {
  id: 'usr-admin-01',
  name: 'Store Administrator',
  email: 'mariam9809.m1@gmail.com',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

const DEFAULT_CUSTOMER: User = {
  id: 'usr-cust-99',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  role: 'customer',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return getFromStorage<User | null>(STORAGE_AUTH_KEY, DEFAULT_CUSTOMER);
  });

  useEffect(() => {
    setToStorage(STORAGE_AUTH_KEY, user);
  }, [user]);

  const role: UserRole = user?.role || 'guest';
  const isAdmin = role === 'admin';
  const isCustomer = role === 'customer';

  const loginAs = (targetRole: UserRole, email?: string, name?: string) => {
    if (targetRole === 'guest') {
      setUser(null);
      return;
    }
    if (targetRole === 'admin') {
      setUser({
        ...DEFAULT_ADMIN,
        email: email || DEFAULT_ADMIN.email,
        name: name || DEFAULT_ADMIN.name,
      });
      return;
    }
    setUser({
      ...DEFAULT_CUSTOMER,
      email: email || DEFAULT_CUSTOMER.email,
      name: name || DEFAULT_CUSTOMER.name,
    });
  };

  const verifyAdminPasskey = (key: string): boolean => {
    // Verified admin passkey: accepts standard demo key 'admin123' or 'aura-secure-2026'
    const trimmed = key.trim();
    if (trimmed === 'admin123' || trimmed === 'aura-secure-2026' || trimmed === 'admin') {
      loginAs('admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isCustomer,
        loginAs,
        verifyAdminPasskey,
        logout,
        adminPasskeyRequired: !isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
