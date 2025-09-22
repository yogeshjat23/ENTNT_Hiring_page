import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { FiUser, FiClock, FiArrowLeft, FiBriefcase  , FiMail , FiArrowRightCircle } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
import NotesSection from './NotesSection';
import './CandidateProfile.css';

// API calls
const fetchCandidateById = async (id) => {
    const res = await fetch(`/candidates/${id}`);
    if (!res.ok) throw new Error('Candidate not found');
    return res.json();
};
const fetchTimeline = async (id) => (await fetch(`/candidates/${id}/timeline`)).json();
const fetchAllJobs = async () => (await fetch('/jobs/all')).json();

export default function CandidateProfile() {
  const { id } = useParams();

  const { data: candidate, isLoading: isCandidateLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => fetchCandidateById(id),
  });

  const { data: timeline = [], isLoading: isTimelineLoading } = useQuery({
    queryKey: ['timeline', id],
    queryFn: () => fetchTimeline(id),
  });
  
  const { data: jobs = [], isLoading: areJobsLoading } = useQuery({
      queryKey: ['allJobs'],
      queryFn: fetchAllJobs,
  });

  const jobMap = useMemo(() => {
    if (!jobs) return new Map();
    return new Map(jobs.map(job => [job.id, job.title]));
  }, [jobs]); 

  const generateColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  // CORRECTED: Use a template literal with backticks ``
  const color = `hsl(${hash % 360}, 75%, 60%)`;
  return color;
}; 
const getInitials = (name = '') => {
  const allNames = name.trim().split(' ');
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      // CORRECTED: Use proper string concatenation
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, '');
  return initials;
};

  const isLoading = isCandidateLoading || isTimelineLoading || areJobsLoading;

  if (isLoading) {
    return <Loader text="Loading Candidate Profile..." />;
  }

  const appliedEvent = timeline.find(event => event.stage.toLowerCase() === 'applied');
  const jobTitle = jobMap.get(candidate?.jobId) || 'Not Assigned'; 

  const backgroundColor = generateColor(candidate.name);
   const initials = getInitials(candidate.name);

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
            <div className="avatar"  style={{ backgroundColor }} >
                {initials}
            </div>
            <p className="candidate-name">{candidate.name}</p>
            <p className="candidate-email">{candidate.email}</p> 
           
             <div className="profile-card job-info-card">
            <h3 className="card-title">
                <FiBriefcase />
                <span>Assigned Job</span>
            </h3>
            <div className="info-grid">
                <span>Position</span>
                <strong>
                    <Link to={`/jobs/${candidate.jobId}`} className="profile-job-link">
                        {jobTitle}
                    </Link>
                </strong>
                <span>Current Stage</span><strong className="stage-text">{candidate.stage}</strong>
                <span>Applied</span><strong>{appliedEvent ? format(new Date(appliedEvent.timestamp), "MMM dd, yyyy") : 'N/A'}</strong>
                  <a href={`mailto:${candidate.email}`} className="send-mail-btn">
        <FiMail />
        <span>Send Mail</span>
    </a>
            </div>
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
                    <div className="timeline-icon-wrapper">
                <FiArrowRightCircle size={40} />
            </div>
                  
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

        <NotesSection candidate={candidate} timeline={timeline} />
      </div>
    </div>
  );
}