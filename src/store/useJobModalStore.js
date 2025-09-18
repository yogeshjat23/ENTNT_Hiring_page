import { create } from 'zustand';

export const useJobModalStore = create((set) => ({
  isOpen: false,
  jobToEdit: null, // This will be null for 'create' mode or hold a job object for 'edit' mode
  openModal: (job = null) => set({ isOpen: true, jobToEdit: job }),
  closeModal: () => set({ isOpen: false, jobToEdit: null }),
}));