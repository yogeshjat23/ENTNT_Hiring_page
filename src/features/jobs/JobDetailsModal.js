import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Modal from '../../components/common/Modal';
import './JobDetailsModal.css';

const fetchJobById = async (jobId) => {
    const res = await fetch(`/jobs/${jobId}`);
    if (!res.ok) throw new Error('Job not found');
    return res.json();
};

export default function JobDetailsModal() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobById(jobId),
  });

  const handleClose = () => {
    navigate('/jobs'); // Navigate back to the main jobs list
  };

  return (
    <Modal isOpen={true} onClose={handleClose} title={job?.title || 'Loading...'}>
        {isLoading && <div>Loading job details...</div>}
        {isError && <div>Could not load job details.</div>}
        {job && (
            <div className="job-details-content">
                <p className="job-detail-field"><strong>Status:</strong> <span className={job.status}>{job.status}</span></p>
                <p className="job-detail-field"><strong>Tags:</strong> {job.tags.join(', ')}</p>
                <div className="job-description">
                    <h3>Job Description</h3>
                    <p>This is a placeholder for the full job description. In a real application, this would contain detailed information about the role, responsibilities, and qualifications required.</p>
                </div>
            </div>
        )}
    </Modal>
  );
}