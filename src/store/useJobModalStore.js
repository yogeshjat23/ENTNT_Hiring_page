import { create } from 'zustand';

export const useJobModalStore = create((set) => ({
  isOpen: false,
  jobToEdit: null,

  handleSubmit: () => {}, 
  
  openModal: (job = null, handleSubmitCallback) => set({ 
    isOpen: true, 
    jobToEdit: job, 
    handleSubmit: handleSubmitCallback 
  }),

  closeModal: () => set({ 
    isOpen: false, 
    jobToEdit: null, 
    handleSubmit: () => {} 
  }),
}));