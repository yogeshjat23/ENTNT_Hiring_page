import React, { useState } from 'react';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import QuestionRenderer from './QuestionRenderer';

export default function FormPreview() {
  const { assessment } = useAssessmentStore();
  const [responses, setResponses] = useState({});

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };
  
  const isQuestionVisible = (question) => {
    if (!question.condition?.questionId) return true;
    
    const { questionId, value } = question.condition;
    const targetResponse = responses[questionId];
    
    return targetResponse === value;
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      alert('Form submitted! (Responses logged to console)');
      console.log('Candidate Responses:', responses);
     
  }

  return (
    <div className="preview-pane">
      <div className="preview-header">
        <h2>Live Preview</h2>
      </div>
      <form className="preview-form" onSubmit={handleSubmit}>
        {assessment.sections.map(section => (
          <fieldset key={section.id} className="preview-section">
            <legend>{section.title}</legend>
            {section.questions.map(q => 
                isQuestionVisible(q) && (
                    <QuestionRenderer 
                        key={q.id} 
                        question={q} 
                        value={responses[q.id] || ''}
                        onChange={handleResponseChange}
                    />
                )
            )}
          </fieldset>
        ))}
         <button type="submit" className="create-job-btn">Submit Assessment</button>
      </form>
    </div>
  );
}