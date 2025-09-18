import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './AssessmentBuilder.css';

// Mock API Calls
const fetchAssessment = async (jobId) => {
    const res = await fetch(`/assessments/${jobId}`);
    return res.json();
};

const saveAssessment = async ({ jobId, assessmentData }) => {
    const res = await fetch(`/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData),
    });
    if (!res.ok) throw new Error('Failed to save assessment');
    return res.json();
};

const AssessmentBuilder = () => {
    const { jobId } = useParams();
    const queryClient = useQueryClient();
    const [assessmentState, setAssessmentState] = useState({ sections: [] });

    const { data: initialAssessment, isLoading } = useQuery({
        queryKey: ['assessment', jobId],
        queryFn: () => fetchAssessment(jobId),
        enabled: !!jobId,
    });

    useEffect(() => {
        if (initialAssessment) {
            setAssessmentState(initialAssessment);
        }
    }, [initialAssessment]);

    const saveMutation = useMutation({
        mutationFn: saveAssessment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assessment', jobId] });
            alert('Assessment saved!');
        },
        onError: () => {
            alert('Error saving assessment.');
        }
    });

    const handleSave = () => {
        saveMutation.mutate({ jobId, assessmentData: assessmentState });
    };
    
    // In a real app, you would have functions here to add/remove/edit questions and sections
    // For brevity, this is a simplified view of the structure

    if (isLoading) return <div>Loading Assessment Builder...</div>;

    return (
        <div className="assessment-builder-layout">
            <div className="builder-pane">
                <h2>Assessment Builder for Job: {jobId}</h2>
                <button onClick={handleSave} className="save-btn">
                  {saveMutation.isLoading ? 'Saving...' : 'Save Assessment'}
                </button>
                <div className="form-structure">
                  {/* UI for adding sections and questions would go here */}
                  <pre>{JSON.stringify(assessmentState, null, 2)}</pre>
                </div>
            </div>
            <div className="preview-pane">
                <h2>Live Preview</h2>
                <form className="preview-form">
                    {assessmentState.sections.map(section => (
                        <div key={section.id} className="preview-section">
                            <h3>{section.title}</h3>
                            {section.questions.map(q => (
                                <div key={q.id} className="preview-question">
                                    <label>{q.text} {q.isRequired && '*'}</label>
                                    {q.type === 'short-text' && <input type="text" maxLength={q.maxLength} />}
                                    {q.type === 'long-text' && <textarea />}
                                    {q.type === 'single-choice' && q.options.map(opt => (
                                        <div key={opt}><input type="radio" name={q.id} value={opt} /> {opt}</div>
                                    ))}
                                    {/* Add other question types */}
                                </div>
                            ))}
                        </div>
                    ))}
                </form>
            </div>
        </div>
    );
};

export default AssessmentBuilder;