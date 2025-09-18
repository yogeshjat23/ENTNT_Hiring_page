import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="icon sun">☀️</span>
      <span className="icon moon">🌙</span>
    </button>
  );
};

export default ThemeToggle;