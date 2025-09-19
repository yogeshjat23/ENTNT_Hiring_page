import React from 'react';

export default function QuestionRenderer({ question, value, onChange }) {
  const handleChange = (e) => onChange(question.id, e.target.value);
  const handleMultiChange = (e) => {
    const { checked, value: optionValue } = e.target;
    const newValues = new Set(value || []);
    if (checked) newValues.add(optionValue);
    else newValues.delete(optionValue);
    onChange(question.id, Array.from(newValues));
  };
  
  const renderInput = () => {
    switch (question.type) {
      case 'short-text':
        return <input type="text" value={value} onChange={handleChange} maxLength={question.maxLength} required={question.isRequired} />;
      case 'long-text':
        return <textarea value={value} onChange={handleChange} required={question.isRequired} />;
      case 'numeric':
        return <input type="number" value={value} onChange={handleChange} min={question.range?.min} max={question.range?.max} required={question.isRequired} />;
      case 'single-choice':
        return (
          <div className="options-group">
            {question.options.map(opt => (
              <label key={opt}><input type="radio" name={question.id} value={opt} checked={value === opt} onChange={handleChange} required={question.isRequired} /> {opt}</label>
            ))}
          </div>
        );
      case 'multi-choice':
        return (
            <div className="options-group">
                {question.options.map(opt => (
                    <label key={opt}><input type="checkbox" name={question.id} value={opt} checked={value.includes(opt)} onChange={handleMultiChange} /> {opt}</label>
                ))}
            </div>
        );
      case 'file-upload':
          return <input type="file" required={question.isRequired} />;
      default:
        return <p>Unsupported question type.</p>;
    }
  };

  return (
    <div className="question-renderer">
      <label htmlFor={question.id}>{question.text} {question.isRequired && ' *'}</label>
      {renderInput()}
    </div>
  );
}