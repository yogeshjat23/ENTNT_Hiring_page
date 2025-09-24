import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

export const useAssessmentStore = create(
  immer((set, get) => ({
    assessment: { sections: [] },
    loadAssessment: (data) => set({ assessment: data }),
    
    addSection: () => set((state) => {
      state.assessment.sections.push({
        id: generateId(),
        title: 'New Section',
        questions: [],
      });
    }),
    
    addQuestion: (sectionId, type) => set((state) => {
      const section = state.assessment.sections.find(s => s.id === sectionId);
      if (section) {
        section.questions.push({
          id: generateId(),
          type,
          text: 'New Question',
          isRequired: false,
          ...(type === 'single-choice' || type === 'multi-choice' ? { options: ['Option 1', 'Option 2'] } : {}),
          ...(type === 'numeric' ? { range: { min: 0, max: 100 } } : {}),
          ...(type === 'short-text' ? { maxLength: 100 } : {}),
          condition: { questionId: '', value: '' },
        });
      }
    }),

    updateQuestion: (sectionId, questionId, field, value) => set((state) => {
      const question = state.assessment.sections
        .find(s => s.id === sectionId)?.questions
        .find(q => q.id === questionId);
      if (question) {
        if (field.startsWith('condition.')) {
            const subField = field.split('.')[1];
            question.condition[subField] = value;
        } else {
            question[field] = value;
        }
      }
    }),
    
    updateSectionTitle: (sectionId, title) => set((state) => {
        const section = state.assessment.sections.find(s => s.id === sectionId);
        if (section) section.title = title;
    }),
    
    
    getAllQuestions: () => {
        return get().assessment.sections.flatMap(s => s.questions);
    }
  }))
);