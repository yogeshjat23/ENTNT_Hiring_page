import { create } from 'zustand';

// Get the stored theme or default to 'dark'
const storedTheme = localStorage.getItem('theme') || 'dark';

export const useThemeStore = create((set) => ({
  theme: storedTheme,
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme); // Save preference
    return { theme: newTheme };
  }),
}));