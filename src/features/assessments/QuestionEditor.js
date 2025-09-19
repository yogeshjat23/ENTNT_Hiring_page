import React from 'react';
import { useAssessmentStore } from '../../store/useAssessmentStore';

export default function QuestionEditor({ sectionId, question }) {
  const { updateQuestion, getAllQuestions } = useAssessmentStore();
  const allQuestions = getAllQuestions().filter(q => q.id !== question.id);
  
  const handleFieldChange = (field, value) => {
      updateQuestion(sectionId, question.id, field, value);
  };

  return (
    <div className="question-editor">
      <label>Question Text</label>
      <input type="text" value={question.text} onChange={(e) => handleFieldChange('text', e.target.value)} />
      
      {(question.type === 'single-choice' || question.type === 'multi-choice') && (
        <><label>Options (comma-separated)</label>
        <input type="text" value={question.options.join(', ')} onChange={(e) => handleFieldChange('options', e.target.value.split(',').map(s => s.trim()))} /></>
      )}

      {question.type === 'numeric' && (
        <div className="field-group"><label>Min</label><input type="number" value={question.range?.min} onChange={(e) => updateQuestion(sectionId, question.id, 'range', {...question.range, min: e.target.value})} /><label>Max</label><input type="number" value={question.range?.max} onChange={(e) => updateQuestion(sectionId, question.id, 'range', {...question.range, max: e.target.value})} /></div>
      )}

      <div className="field-group">
        <label><input type="checkbox" checked={question.isRequired} onChange={(e) => handleFieldChange('isRequired', e.target.checked)} /> Required</label>
      </div>

      <div className="conditional-logic">
        <label>Conditional Logic (Optional)</label>
        <select value={question.condition?.questionId} onChange={e => handleFieldChange('condition.questionId', e.target.value)}>
            <option value="">Show always</option>
            {allQuestions.map(q => <option key={q.id} value={q.id}>{q.text}</option>)}
        </select>
        {question.condition?.questionId && (
            <><span>equals</span><input type="text" placeholder="e.g., Yes" value={question.condition?.value} onChange={e => handleFieldChange('condition.value', e.target.value)} /></>
        )}
      </div>
    </div>
  );
}