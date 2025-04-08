import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (payload: { username: string; password?: string; code?: string }) => Promise<any>;
  verifyCode: (payload: { username: string; code: string }) => Promise<any>;
  logout: () => void;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchCode: string;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const requestVerificationCode = async (): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:5000/auth/request-verification-code', {
        email: 'sufyanakbar01239@gmail.com',
      });
      console.log(response.data.message);
      return true;
    } catch (error: any) {
      console.error('Error requesting verification code:', error);
      return false;
    }
  };

  const login = async (payload: { username: string; password?: string; code?: string }): Promise<any> => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', payload);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
        return { token: response.data.token };
      }

      if (response.data.message === 'Verification code sent to your email') {
        return { message: 'Verification code sent' };
      }

      return null;
    } catch (error: any) {
      console.error('Login error:', error);
      return null;
    }
  };

  const verifyCode = async (payload: { username: string; code: string }): Promise<any> => {
    try {
      const response = await axios.post('http://localhost:5000/auth/verify-code', payload);

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
        return { token: response.data.token };
      }

      return null;
    } catch (error: any) {
      console.error('Verification error:', error);
      return null;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('token');
  };

  const bankDetails = {
    accountName: 'Lottery Admin',
    accountNumber: '1234567890',
    bankName: 'National Bank',
    branchCode: 'NB001',
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, verifyCode, logout, bankDetails }}>
      {children}
    </AdminContext.Provider>
  );
};