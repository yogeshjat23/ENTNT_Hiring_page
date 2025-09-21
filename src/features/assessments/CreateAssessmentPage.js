import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './CreateAssessmentPage.css';
import Loader from '../../components/common/Loader'; // For a better loading experience

// API call to fetch all jobs for the dropdown
const fetchAllJobs = async () => (await fetch('/jobs/all')).json();

export default function CreateAssessmentPage() {
    const [jobId, setJobId] = useState('');
    const navigate = useNavigate();

    // Fetch all jobs to populate the dropdown
    const { data: jobs = [], isLoading } = useQuery({
        queryKey: ['allJobs'],
        queryFn: fetchAllJobs,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (jobId) {
            navigate(`/assessments/${jobId.trim()}`);
        } else {
            alert('Please select or enter a Job ID.');
        }
    };

    if (isLoading) {
        return <Loader text="Loading available jobs..." />;
    }

    return (
        <div className="create-assessment-container">
            <div className="create-assessment-box">
                <h2>Create or Edit an Assessment</h2>
                <p>Select an existing job from the dropdown or manually enter a Job ID.</p>
                
                <form onSubmit={handleSubmit}>
                    <label htmlFor="job-select">Select Existing Job</label>
                    <select
                        id="job-select"
                        value={jobId}
                        onChange={(e) => setJobId(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="">
                            {isLoading ? 'Loading jobs...' : 'Choose a job'}
                        </option>
                        {jobs.map(job => (
                            <option key={job.id} value={job.id}>
                                {job.title} (ID: {job.id})
                            </option>
                        ))}
                    </select>

                    <span className="or-divider">OR</span>

                    <label htmlFor="job-input">Manually Enter Job ID</label>
                    <input
                        id="job-input"
                        type="text"
                        value={jobId}
                        onChange={(e) => setJobId(e.target.value)}
                        placeholder="e.g., job-1, job-new, etc."
                    />
                    <button type="submit" className="create-job-btn">
                        Go to Builder →
                    </button>
                </form>
                <Link to="/assessments" className="back-link">
                    ← View All Assessments
                </Link>
            </div>
        </div>
    );
}