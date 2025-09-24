import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useJobModalStore } from '../../store/useJobModalStore';
import Modal from '../../components/common/Modal';
import './JobDetailsModal.css';

const fetchJobById = async (jobId) => {
    const res = await fetch(`/jobs/${jobId}`);
    if (!res.ok) throw new Error('Job not found');
    return res.json();
};
const createJob = async (newJob) => {
    const res = await fetch('/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
};

const updateJob = async (jobData) => {
    const { id, ...updates } = jobData;
    const res = await fetch(`/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update job');
    return res.json();
};
const toggleJobStatus = async ({ id, status }) => {
    const res = await fetch(`/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update job status');
    return res.json();
};

export default function JobDetailsModal() {
      const queryClient = useQueryClient();
      const { openModal } = useJobModalStore();

const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            useJobModalStore.getState().closeModal();
        },
        onError: (error) => alert(error.message || 'An error occurred'),
    };
       const createMutation = useMutation({ mutationFn: createJob, ...mutationOptions });
          const updateMutation = useMutation({ mutationFn: updateJob, ...mutationOptions });

   const archiveMutation = useMutation({
        mutationFn: toggleJobStatus,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
        onError: (error) => alert(error.message),
    });
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobById(jobId),
  });

  const handleClose = () => {
    navigate('/jobs');
  };
    const handleOpenModal = (job = null) => {
        const handleSubmit = (jobData) => {
            if (job) {
                updateMutation.mutate({ ...jobData, id: job.id });
            } else {
                createMutation.mutate(jobData);
            }
        };
        openModal(job, handleSubmit);
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
                 <div className="job-actions">
                 <button onClick={(e) => {  e.preventDefault(); navigate(`/assessments/${job.id}`);  }} className="action-btn edit" >
                                                                     Assessment </button>
                 <button onClick={(e) => { e.preventDefault(); archiveMutation.mutate({ id: job.id, status: 'archived' }); }} className="action-btn archive">Archive</button>
                <button onClick={(e) => { e.preventDefault(); handleOpenModal(job); }} className="action-btn edit">Edit</button>

            </div>
            </div>
        )}
    </Modal>
  );
}