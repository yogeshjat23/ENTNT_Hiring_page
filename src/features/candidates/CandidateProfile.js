import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { FiUser, FiClock, FiArrowLeft } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
import NotesSection from './NotesSection';
import './CandidateProfile.css';

// API call to fetch main candidate details
const fetchCandidateById = async (id) => {
    const res = await fetch(`/candidates/${id}`);
    if (!res.ok) throw new Error('Candidate not found');
    return res.json();
};

// API call to fetch the candidate's timeline
const fetchTimeline = async (id) => (await fetch(`/candidates/${id}/timeline`)).json();

export default function CandidateProfile() {
  const { id } = useParams();

  // Fetch candidate details
  const { data: candidate, isLoading: isCandidateLoading, isError: isCandidateError } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => fetchCandidateById(id),
  });

  // Fetch candidate timeline
  const { data: timeline = [], isLoading: isTimelineLoading, isError: isTimelineError } = useQuery({
    queryKey: ['timeline', id],
    queryFn: () => fetchTimeline(id),
  });

  if (isCandidateLoading || isTimelineLoading) {
    return <Loader text="Loading Candidate Profile..." />;
  }
  if (isCandidateError || isTimelineError) {
    return <div className="profile-status error">Could not load candidate details.</div>;
  }

  const appliedEvent = timeline.find(event => event.stage.toLowerCase() === 'applied');

  return (
    <div className="candidate-profile-layout">
      <div className="profile-top-bar">
        <Link to="/candidates" className="back-link">
          <FiArrowLeft />
          <span>Back to Candidates</span>
        </Link>
        <div className="candidate-main-info">
          <div>
            <h1>{candidate.name}</h1>
            <p>Candidate Profile</p>
          </div>
          <div className="current-stage-badge">{candidate.stage}</div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card candidate-info-card">
          <h3 className="card-title">
            <FiUser />
            <span>Candidate Information</span>
          </h3>
          <div className="avatar">
            {candidate.name.substring(0, 2).toUpperCase()}
          </div>
          <p className="candidate-name">{candidate.name}</p>
          <p className="candidate-email">{candidate.email}</p>
          <div className="info-grid">
            <span>Position</span><strong>Data Scientist</strong>
            <span>Current Stage</span><strong className="stage-text">{candidate.stage}</strong>
            <span>Applied</span><strong>{appliedEvent ? format(new Date(appliedEvent.timestamp), "MMM dd, yyyy") : 'N/A'}</strong>
          </div>
        </div>

        <div className="profile-card timeline-card">
          <h3 className="card-title">
            <FiClock />
            <span>Timeline</span>
          </h3>
          <div className="timeline">
            {timeline.map((event, index) => (
              <div key={event.id || index} className="timeline-item">
                <div className="timeline-icon">→</div>
                <div className="timeline-content">
                  <p><strong>{event.stage}</strong></p>
                  <span>{event.notes || `Candidate moved to ${event.stage} stage.`}</span>
                </div>
                <div className="timeline-date">
                    {format(new Date(event.timestamp), "MMM dd, yyyy")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <NotesSection candidate={candidate} timeline={timeline} />
      </div>
    </div>
  );
}