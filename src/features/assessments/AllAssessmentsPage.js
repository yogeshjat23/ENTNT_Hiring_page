import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import './AllAssessmentsPage.css';

// API call to fetch all assessments
const fetchAllAssessments = async () => (await fetch('/assessments')).json();

export default function AllAssessmentsPage() {
  const { data: assessments = [], isLoading, isError } = useQuery({
    queryKey: ['allAssessments'],
    queryFn: fetchAllAssessments,
  });

  if (isLoading) return <div className="assessments-status">Loading all assessments...</div>;
  if (isError) return <div className="assessments-status error">Could not load assessments.</div>;

  return (
    <div className="all-assessments-container">
      <div className="board-header">
        <h2>All Assessments</h2>
      </div>

      <div className="assessment-grid-item">
        {assessments.map(assessment => (
          <Link to={`/assessments/${assessment.jobId}`} key={assessment.jobId} className="assessment-card-link">
            <div className="assessment-card">
              <h3>Assessment for Job ID: {assessment.jobId}</h3>
              <p>{assessment.sections.length} Section(s)</p>
              <span>Edit Assessment →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}