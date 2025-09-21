import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import './AllAssessmentsPage.css';

// API calls
const fetchAllAssessments = async () => (await fetch('/assessments')).json();
const fetchAllJobs = async () => (await fetch('/jobs/all')).json();

export default function AllAssessmentsPage() {
  const { data: assessments = [], isLoading: isLoadingAssessments } = useQuery({
    queryKey: ['allAssessments'],
    queryFn: fetchAllAssessments,
  });

  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: ['allJobs'],
    queryFn: fetchAllJobs,
  });

  const jobTitleMap = useMemo(() => {
    if (!jobs) return new Map();
    return new Map(jobs.map(job => [job.id, job.title]));
  }, [jobs]);

  const isLoading = isLoadingAssessments || isLoadingJobs;

  if (isLoading) return <Loader text="Loading Assessments..." />;

  return (
    <div className="all-assessments-container">
      <div className="board-header">
        <h2>All Assessments</h2>
      </div>

      <div className="assessments-list">
        {assessments.map(assessment => (
          <div key={assessment.jobId} className="assessment-grid-item">
            <Link to={`/assessments/${assessment.jobId}`} className="assessment-card-link">
              <div className="assessment-card">
                <h3>{jobTitleMap.get(assessment.jobId) || 'Unknown Job'}</h3>
                <h3 className="job-id">Job ID: {assessment.jobId}</h3>
                <p>{assessment.sections.length} Section(s)</p>
                <span>Edit Assessment →</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}