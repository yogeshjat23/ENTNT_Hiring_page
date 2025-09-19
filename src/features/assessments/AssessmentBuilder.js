import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import BuilderPane from './BuilderPane';
import FormPreview from './FormPreview';
import './AssessmentBuilder.css';

// API Calls
const fetchAssessment = async (jobId) => (await fetch(`/assessments/${jobId}`)).json();
const saveAssessment = async ({ jobId, data }) => {
    const res = await fetch(`/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save assessment');
    return res.json();
};

export default function AssessmentBuilder() {
  const { jobId } = useParams();
  const queryClient = useQueryClient();
  const { assessment, loadAssessment } = useAssessmentStore();

  const saveMutation = useMutation({
    mutationFn: saveAssessment,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['assessment', jobId] });
        // Only show alert on manual saves, not initial creation
    },
    onError: (err) => alert(`Error: ${err.message}`),
  });

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['assessment', jobId],
    queryFn: () => fetchAssessment(jobId),
  });

  useEffect(() => {
    if (initialData) {
        // THIS IS THE FIX:
        // If the fetched assessment has no sections, it's new.
        // We create a blank one in the database immediately.
        if (initialData.sections.length === 0) {
            const blankAssessment = { jobId, sections: [] };
            saveMutation.mutate({ jobId, data: blankAssessment });
            loadAssessment(blankAssessment);
        } else {
            loadAssessment(initialData);
        }
    }
  }, [initialData, jobId, loadAssessment]); // Added jobId and saveMutation to dependency array

  const handleSave = () => {
    saveMutation.mutate({ jobId, data: assessment });
    alert('Assessment saved successfully!');
  };

  if (isLoading || !assessment?.sections) {
    return <div className="loading-pane">Loading assessment builder...</div>;
  }

  return (
    <div className="assessment-builder-layout">
      <BuilderPane onSave={handleSave} isSaving={saveMutation.isLoading} />
      <FormPreview />
    </div>
  );
}