import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import './CandidatesKanban.css';

const STAGES = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

// Mock API call functions
const fetchCandidates = async () => {
    const res = await fetch('/candidates');
    return res.json();
};

const moveCandidate = async ({ id, stage }) => {
    const res = await fetch(`/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
    });
    if (!res.ok) throw new Error('Failed to move candidate');
    return res.json();
};

const CandidatesKanban = () => {
    const queryClient = useQueryClient();
    const { data: candidates = [], isLoading } = useQuery({
        queryKey: ['candidates'],
        queryFn: fetchCandidates
    });

    const moveMutation = useMutation({
        mutationFn: moveCandidate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
        },
        // You can add optimistic updates here as well
    });

    const candidatesByStage = useMemo(() => {
        const grouped = STAGES.reduce((acc, stage) => {
            acc[stage] = [];
            return acc;
        }, {});
        candidates.forEach(c => {
            if (grouped[c.stage]) {
                grouped[c.stage].push(c);
            }
        });
        return grouped;
    }, [candidates]);
    
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId) return;

        moveMutation.mutate({ id: draggableId, stage: destination.droppableId });
    };

    if (isLoading) return <div>Loading candidates...</div>;

    return (
        <div className="kanban-board">
            <h2>Candidates Pipeline</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-columns">
                    {STAGES.map(stage => (
                        <Droppable key={stage} droppableId={stage}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`kanban-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                >
                                    <h3>{stage.toUpperCase()} ({candidatesByStage[stage].length})</h3>
                                    <div className="candidate-list">
                                        {candidatesByStage[stage].map((candidate, index) => (
                                            <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="candidate-card"
                                                    >
                                                        <h4>{candidate.name}</h4>
                                                        <p>{candidate.email}</p>
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
        </div>
    );
};

export default CandidatesKanban;