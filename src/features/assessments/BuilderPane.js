import React from 'react';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import QuestionEditor from './QuestionEditor';

export default function BuilderPane({ onSave, isSaving }) {
  const { assessment, addSection, addQuestion, updateSectionTitle } = useAssessmentStore();

  // The old loading check is removed from here.

  return (
    <div className="builder-pane">
      <div className="builder-header">
        <h2>Assessment Builder</h2>
        <button onClick={onSave} disabled={isSaving} className="create-job-btn">
          {isSaving ? 'Saving...' : 'Save Assessment'}
        </button>
      </div>
      
      {assessment.sections.map(section => (
        <div key={section.id} className="builder-section">
          <input 
            type="text" 
            value={section.title} 
            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
            className="section-title-input"
            placeholder="Section Title"
          />
          {section.questions.map(q => (
            <QuestionEditor key={q.id} sectionId={section.id} question={q} />
          ))}
          <div className="add-question-controls">
            <strong>Add Question:</strong>
            <button onClick={() => addQuestion(section.id, 'short-text')}>Short Text</button>
            <button onClick={() => addQuestion(section.id, 'long-text')}>Long Text</button>
            <button onClick={() => addQuestion(section.id, 'numeric')}>Numeric</button>
            <button onClick={() => addQuestion(section.id, 'single-choice')}>Single-Choice</button>
            <button onClick={() => addQuestion(section.id, 'multi-choice')}>Multi-Choice</button>
            <button onClick={() => addQuestion(section.id, 'file-upload')}>File Upload</button>
          </div>
        </div>
      ))}
      <button onClick={addSection} className="add-section-btn">+ Add Section</button>
    </div>
  );
}