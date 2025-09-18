import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDebounce } from '../../hooks/useDebounce';
import { useJobModalStore } from '../../store/useJobModalStore';
import Modal from '../../components/common/Modal';
import JobForm from '../../components/jobs/JobForm';
import JobItemCard from '../../components/jobs/JobItemCard';
import './JobsBoard.css';

// --- API Call Functions ---
const fetchJobs = async (titleFilter, tagFilter) => {
    const res = await fetch(`/jobs?search=${titleFilter}&tagSearch=${tagFilter}`);
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
    const queryClient = useQueryClient();
    const [titleFilter, setTitleFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const debouncedTitleFilter = useDebounce(titleFilter, 300);
    const debouncedTagFilter = useDebounce(tagFilter, 300);

    const { isOpen, jobToEdit, openModal, closeModal } = useJobModalStore();
    const [openSection, setOpenSection] = useState(null);

    const { data: jobs = [], isLoading, isError } = useQuery({
        queryKey: ['jobs', debouncedTitleFilter, debouncedTagFilter],
        queryFn: () => fetchJobs(debouncedTitleFilter, debouncedTagFilter),
        keepPreviousData: true,
    });

    const toggleSection = (section) => {
        setOpenSection(prev => (prev === section ? null : section));
    };

    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            closeModal();
        },
        onError: (error) => alert(error.message || 'An error occurred'),
    };
    const createMutation = useMutation({ mutationFn: createJob, ...mutationOptions });
    const updateMutation = useMutation({ mutationFn: updateJob, ...mutationOptions });
   
    const reorderMutation = useMutation({
        mutationFn: reorderJobs,
        onMutate: async (newOrder) => {
            await queryClient.cancelQueries({ queryKey: ['jobs', debouncedTitleFilter, debouncedTagFilter] });
            const previousJobs = queryClient.getQueryData(['jobs', debouncedTitleFilter, debouncedTagFilter]) || [];
            const previousActiveJobs = previousJobs.filter(job => job.status === 'active');
            const previousArchivedJobs = previousJobs.filter(job => job.status === 'archived');
            const reorderedActiveJobs = [...previousActiveJobs];
            const [movedJob] = reorderedActiveJobs.splice(newOrder.fromOrder, 1);
            reorderedActiveJobs.splice(newOrder.toOrder, 0, movedJob);
            const newFullList = [...reorderedActiveJobs, ...previousArchivedJobs];
            queryClient.setQueryData(['jobs', debouncedTitleFilter, debouncedTagFilter], newFullList);
            return { previousJobs };
        },
        onError: (err, newOrder, context) => {
            queryClient.setQueryData(['jobs', debouncedTitleFilter, debouncedTagFilter], context.previousJobs || []);
            alert('Failed to reorder jobs. Changes have been rolled back.');
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['jobs', debouncedTitleFilter, debouncedTagFilter] }),
    });

    const onDragEnd = (result) => {
        if (!result.destination) return;
        reorderMutation.mutate({ fromOrder: result.source.index, toOrder: result.destination.index });
    };

    const handleFormSubmit = (jobData) => {
        if (jobToEdit) {
            updateMutation.mutate({ ...jobData, id: jobToEdit.id });
        } else {
            createMutation.mutate(jobData);
        }
    };

    const activeJobs = jobs.filter(job => job.status === 'active');
    const archivedJobs = jobs.filter(job => job.status === 'archived');

    return (
        <div className="jobs-board">
            <div className="board-header">
                <h2>Jobs Board</h2>
                <button onClick={() => openModal()} className="create-job-btn">
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

            {isLoading && <div>Loading...</div>}
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
                                                        <JobItemCard job={job} index={index} isDragging={snapshot.isDragging}>
                                                            <h3 className="job-title">{job.title}</h3>
                                                            <div className="job-deadline">
                                                                <span>✔️</span>
                                                                <span>Deadline: November 2, 2025</span>
                                                            </div>
                                                            <div className="job-location">
                                                                <span>📍</span>
                                                                <span>{job.tags.join(' / ')}</span>
                                                            </div>
                                                            <a href="#" className="job-apply-link">
                                                                Apply now →
                                                            </a>
                                                        </JobItemCard>
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
                                <JobItemCard key={job.id} job={job} index={index}>
                                     <h3 className="job-title">{job.title}</h3>
                                     <div className="job-deadline">
                                         <span>✔️</span>
                                         <span>Deadline: Expired</span>
                                     </div>
                                     <div className="job-location">
                                         <span>📍</span>
                                         <span>{job.tags.join(' / ')}</span>
                                     </div>
                                     <a href="#" className="job-apply-link">
                                         View Details →
                                     </a>
                                </JobItemCard>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isOpen} onClose={closeModal} title={jobToEdit ? 'Edit Job' : 'Create New Job'}>
                <JobForm
                    initialData={jobToEdit}
                    onCancel={closeModal}
                    onSubmit={handleFormSubmit}
                    isSaving={createMutation.isLoading || updateMutation.isLoading}
                />
            </Modal>
        </div>
    );
};

export default JobsBoard;