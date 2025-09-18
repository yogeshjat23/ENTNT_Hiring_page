import { create } from 'zustand';

export const useJobModalStore = create((set) => ({
  isOpen: false,
  jobToEdit: null,
  // This will hold the correct submit function from the component that opens the modal
  handleSubmit: () => {}, 
  // Pass the submit handler when opening the modal
  openModal: (job = null, handleSubmitCallback) => set({ 
    isOpen: true, 
    jobToEdit: job, 
    handleSubmit: handleSubmitCallback 
  }),
  // Reset everything on close
  closeModal: () => set({ 
    isOpen: false, 
    jobToEdit: null, 
    handleSubmit: () => {} 
  }),
}));