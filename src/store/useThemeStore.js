import { create } from 'zustand';

const storedTheme = localStorage.getItem('theme') || 'dark';

export const useThemeStore = create((set) => ({
  theme: storedTheme,
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme); 
    return { theme: newTheme };
  }),
}));