import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from 'react-router-dom';
import VirtualizedCandidateList from './VirtualizedCandidateList'; 
import ProfileAvatar from './AvatarPage';
import { FiMail  } from 'react-icons/fi';
import Loader from '../../components/common/Loader'; 
import NotesModal from './NotesModal';
import './CandidatesKanban.css';

const STAGES = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

// Mock API call functions
const fetchCandidates = async () => (await fetch('/candidates')).json();

const fetchAllJobs = async () => (await fetch('/jobs/all')).json();
const moveCandidate = async ({ id, stage, notes }) => {
    const res = await fetch(`/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, notes }), // Pass notes in the body
    });
    if (!res.ok) throw new Error('Failed to move candidate');
    return res.json();
};

const CandidatesKanban = () => {
    const queryClient = useQueryClient();
    const [view, setView] = useState('kanban');
    const [searchTerm, setSearchTerm] = useState(''); 
    const { data: candidates, isLoading } = useQuery({
        queryKey: ['candidates'],
        queryFn: fetchCandidates,
    }); 

    const { data: jobs, isLoading: isLoadingJobs } = useQuery({
        queryKey: ['allJobs'],
        queryFn: fetchAllJobs,
    });

   const moveMutation = useMutation({
        mutationFn: moveCandidate,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['candidates'] }),
    });

    // CORRECTED: Combined filtering and grouping into a single useMemo hook
    const { filteredCandidates, candidatesByStage } = useMemo(() => {
        // Guard clause to prevent errors when data is loading
        if (!candidates || !Array.isArray(candidates)) {
            const emptyStages = STAGES.reduce((acc, stage) => ({...acc, [stage]: []}), {});
            return { filteredCandidates: [], candidatesByStage: emptyStages };
        }

        // 1. Filter the candidates based on the search term
        const filtered = candidates.filter(c => {
            const term = searchTerm.toLowerCase();
            return c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term);
        });
        
        // 2. Group the already-filtered candidates into stages for the Kanban view
        const grouped = STAGES.reduce((acc, stage) => ({...acc, [stage]: []}), {});
        filtered.forEach(c => {
            if (grouped[c.stage]) grouped[c.stage].push(c);
        });

        // Return both the flat filtered list (for List View) and the grouped list (for Kanban View)
        return { filteredCandidates: filtered, candidatesByStage: grouped };
    }, [candidates, searchTerm]); 
    
    
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
        if (!destination || (source.droppableId === destination.droppableId)) {
            return;
        }

        const candidate = candidates.find(c => c.id === draggableId);
        if (!candidate) return;

        // This is the function the modal will call when "Save" is clicked
        const handleConfirm = (notesFromModal) => {
            moveMutation.mutate({
                id: draggableId,
                stage: destination.droppableId,
                notes: notesFromModal, // Pass the notes to the mutation
            });
        };

        // Create and dispatch the custom event to open the modal
        const event = new CustomEvent('openNotesModal', {
            detail: {
                meta: { name: candidate.name }, // Pass candidate's name to the modal
                onConfirm: handleConfirm, // Pass the confirm handler
            }
        });
        window.dispatchEvent(event);
    };
   
     const jobMap = useMemo(() => {
        if (!jobs) return new Map();
        return new Map(jobs.map(job => [job.id, job]));
    }, [jobs]);
 
    

    if (isLoading) return <Loader text="Loading Candidates..." />;
     

    return (
        <div className="kanban-board">
          <NotesModal/> 
            <div className="kanban-header">
                <h2>Candidates Pipeline</h2>
                <div className="view-controls">
                    <button onClick={() => setView('kanban')} className={view === 'kanban' ? 'active' : ''}>Kanban View</button>
                    <button onClick={() => setView('list')} className={view === 'list' ? 'active' : ''}>List View</button>
                </div>
            </div>
            
            <div className="candidate-filters">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            
            {view === 'kanban' ? (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="kanban-columns">
                        {STAGES.map(stage => (
                            <Droppable key={stage} droppableId={stage}>
                                {(provided) => (
                                    <div   ref={provided.innerRef}
  {...provided.droppableProps}
  className="kanban-column"
  data-stage={stage} >
                                        <h3>{stage.toUpperCase()} ({candidatesByStage[stage].length})</h3>
                                        <div className="candidate-list">
                                            {candidatesByStage[stage].map((c, index) => (
                                                <Draggable key={c.id} draggableId={c.id} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                           <Link to={`/candidates/${c.id}`} className="candidate-card-link">
                <div className="candidate-card">
                    <div className="card-header"> 
                        <ProfileAvatar name={c.name}/>
                        <h4 className="candidate-name">{c.name}</h4>
                    </div>
                    <div className="candidate-email">
                        <FiMail size={14} />
                        <span>{c.email } </span>
                    </div>  
                     <div className="candidate-job-link-wrapper">
            <Link 
                to={`/jobs/${c.jobId}`} 
                className="candidate-job-link"
                onClick={(e) => e.stopPropagation()} // Prevents the main card link from firing
            >
                {jobMap.get(c.jobId)?.title || c.jobId}
            </Link> 
            
        </div>
                </div>
            </Link>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            ) : (
                <VirtualizedCandidateList candidates={filteredCandidates} /> 
        
            )}
        </div>
    );
};

export default CandidatesKanban;