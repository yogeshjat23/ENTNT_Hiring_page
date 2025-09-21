import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link, Outlet  , useNavigate  } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { useJobModalStore } from '../../store/useJobModalStore';
import JobItemCard from '../../components/jobs/JobItemCard';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import './JobsBoard.css';

// --- API Call Functions ---
const fetchJobs = async (titleFilter, tagFilter, currentPage) => {
    const res = await fetch(`/jobs?search=${titleFilter}&tagSearch=${tagFilter}&page=${currentPage}`);
    if (!res.ok) throw new Error('Network response was not ok');
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

const reorderJobs = async (reorderData) => {
    const res = await fetch(`/jobs/some-id/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reorderData),
    });
    if (!res.ok) throw new Error('Failed to reorder jobs');
    return res.json();
};


const JobsBoard = () => { 
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [titleFilter, setTitleFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const debouncedTitleFilter = useDebounce(titleFilter, 300);
    const debouncedTagFilter = useDebounce(tagFilter, 300);

    const { openModal } = useJobModalStore();
    const [openSection, setOpenSection] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: jobs = [], isLoading, isError } = useQuery({
        queryKey: ['jobs', debouncedTitleFilter, debouncedTagFilter, currentPage],
        queryFn: () => fetchJobs(debouncedTitleFilter, debouncedTagFilter, currentPage),
        keepPreviousData: true,
    });

    
    const totalJobs = 0;
    const pageSize = 8;
    const totalPages = Math.ceil(totalJobs / pageSize);

    const toggleSection = (section) => {
        setOpenSection(prev => (prev === section ? null : section));
    };

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
    const reorderMutation = useMutation({
        mutationFn: reorderJobs,
        onMutate: async (newOrder) => {
            const queryKey = ['jobs', debouncedTitleFilter, debouncedTagFilter, currentPage];
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData(queryKey) || { jobs: [], totalCount: 0 };
            const previousActiveJobs = previousData.jobs.filter(job => job.status === 'active');
            const previousArchivedJobs = previousData.jobs.filter(job => job.status === 'archived');
            const reorderedActiveJobs = [...previousActiveJobs];
            const [movedJob] = reorderedActiveJobs.splice(newOrder.fromOrder, 1);
            reorderedActiveJobs.splice(newOrder.toOrder, 0, movedJob);
            const newFullList = [...reorderedActiveJobs, ...previousArchivedJobs];
            queryClient.setQueryData(queryKey, { ...previousData, jobs: newFullList });
            return { previousData };
        },
        onError: (err, newOrder, context) => {
            const queryKey = ['jobs', debouncedTitleFilter, debouncedTagFilter, currentPage];
            queryClient.setQueryData(queryKey, context.previousData);
            alert('Failed to reorder jobs. Changes have been rolled back.');
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
    });

    const onDragEnd = (result) => {
        if (!result.destination) return;
        reorderMutation.mutate({ fromOrder: result.source.index, toOrder: result.destination.index });
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

    const activeJobs = jobs.filter(job => job.status === 'active');
    const archivedJobs = jobs.filter(job => job.status === 'archived');

    return (
        
        <div className="jobs-board">
            <div className="board-header">
                <h2>Jobs Board</h2>
                <button onClick={() => handleOpenModal()} className="create-job-btn">
                    + <span>Create Job</span>
                </button>
            </div> 
            
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Filter by title..."
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                    className="filter-input"
                />
                <input
                    type="text"
                    placeholder="Filter by tag..."
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="filter-input"
                />
            </div>

            {isLoading &&  <Loader text="Loading Jobs..." />}
            {isError && <div>Error fetching jobs.</div>}

            {/* --- ACTIVE JOBS SECTION --- */}
            {!isLoading && !isError && (
                <div className="jobs-section">
                    <div className="jobs-section-header collapsible" onClick={() => toggleSection('active')}>
                        <h3>Active Jobs ({activeJobs.length})</h3>
                        <span className={`chevron ${openSection === 'active' ? 'open' : ''}`}>▼</span>
                    </div>
                    {openSection === 'active' && (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="jobs">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="jobs-list">
                                        {activeJobs.map((job, index) => (
                                            <Draggable key={job.id} draggableId={job.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <Link to={`/jobs/${job.id}`} className="job-card-link">
                                                            <JobItemCard job={job} index={index} isDragging={snapshot.isDragging}>
                                                                <div className="job-card-main">
                                                                    <h3 className="job-title">{job.title}</h3>
                                                                    <div className="job-location">
                                                                        <span>💻</span>
                                                                        <span>{job.tags.join(' / ')}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="job-actions">
                                                                    <button onClick={(e) => {  e.preventDefault(); navigate(`/assessments/${job.id}`);  }} className="action-btn edit" >
                                                                     Assessment </button>
                                                                    <button onClick={(e) => { e.preventDefault(); archiveMutation.mutate({ id: job.id, status: 'archived' }); }} className="action-btn archive">Archive</button>
                                                                    <button onClick={(e) => { e.preventDefault(); handleOpenModal(job); }} className="action-btn edit">Edit</button>
                                                                </div>
                                                            </JobItemCard>
                                                        </Link>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </div>
            )}   
            

            {/* --- ARCHIVED JOBS SECTION --- */}
            {!isLoading && !isError && archivedJobs.length > 0 && (
                <div className="jobs-section">
                    <div className="jobs-section-header collapsible" onClick={() => toggleSection('archived')}>
                        <h3>Archived Jobs ({archivedJobs.length})</h3>
                        <span className={`chevron ${openSection === 'archived' ? 'open' : ''}`}>▼</span>
                    </div>
                    {openSection === 'archived' && (
                        <div className="jobs-list">
                            {archivedJobs.map((job, index) => (
                                <Link to={`/jobs/${job.id}`} key={job.id} className="job-card-link">
                                    <JobItemCard job={job} index={index}>
                                        <div className="job-card-main">
                                            <h3 className="job-title">{job.title}</h3>
                                            <div className="job-location">
                                                <span>📍</span>
                                                <span>{job.tags.join(' / ')}</span>
                                            </div>
                                        </div>
                                        <div className="job-actions"> 
                                             <button onClick={(e) => {  e.preventDefault(); navigate(`/assessments/${job.id}`);  }} className="action-btn edit" >
                                                                     Assessment </button>
                                            <button onClick={(e) => { e.preventDefault(); archiveMutation.mutate({ id: job.id, status: 'active' }); }} className="action-btn unarchive">Unarchive</button>
                                            <button onClick={(e) => { e.preventDefault(); handleOpenModal(job); }} className="action-btn edit">Edit</button>
                                        </div>
                                    </JobItemCard>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <Outlet />
        </div>
    );
};

export default JobsBoard;