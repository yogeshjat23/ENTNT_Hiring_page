import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
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
    return <div className="profile-status">Loading candidate profile...</div>;
  }

  if (isCandidateError || isTimelineError) {
    return <div className="profile-status error">Could not load candidate details.</div>;
  }

  return (
    <div className="candidate-profile-container">
      <div className="profile-header">
        <div>
          <h1 className="candidate-name">{candidate.name}</h1>
          <p className="candidate-email">{candidate.email}</p>
        </div>
        <div className="current-stage-badge">
            Current Stage: <strong>{candidate.stage}</strong>
        </div>
      </div>

      <div className="timeline-section">
        <h2 className="section-title">Hiring Timeline</h2>
        <div className="timeline">
          {timeline.map((event) => (
            <div key={event.id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-stage">{event.stage}</span>
                <span className="timeline-date">
                  {format(new Date(event.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </span>
                {event.notes && <p className="timeline-notes">"{event.notes}"</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link to="/candidates" className="back-link">
        ← Back to Candidates
      </Link>
    </div>
  );
}