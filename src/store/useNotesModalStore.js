import { create } from 'zustand';

export const useNotesModalStore = create((set) => ({
  isOpen: false,
  candidateMoveData: null,
  onSubmit: () => {},
  openModal: (data, onSubmitCallback) => set({ 
    isOpen: true, 
    candidateMoveData: data,
    onSubmit: onSubmitCallback 
  }),
  closeModal: () => set({ 
    isOpen: false, 
    candidateMoveData: null,
    onSubmit: () => {} 
  }),
}));