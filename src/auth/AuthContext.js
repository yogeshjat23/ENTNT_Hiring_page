import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const MOCK_HR_USER = {
    name: 'HR Manager',
    initials: 'HR',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
  
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn ? MOCK_HR_USER : null;
  });
  
  const navigate = useNavigate();

   const login = (username, password) => {
    if (username === 'hr' && password === 'hr123') {
      localStorage.setItem('isLoggedIn', 'true');
      setUser(MOCK_HR_USER);
      navigate('/');
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    navigate('/login');
  };

  
  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};