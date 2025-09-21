import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiMessageSquare, FiSend } from 'react-icons/fi';
import './NotesSection.css'
// API function to add a note
const addNoteToCandidate = async ({ id, stage, notes }) => {
    const res = await fetch(`/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, notes }),
    });
    if (!res.ok) throw new Error('Failed to add note');
    return res.json();
};

const MOCK_USERS = ['Alice', 'Bob', 'Cathy', 'Dev'];

export default function NotesSection({ candidate, timeline }) {
    const queryClient = useQueryClient();
    const [note, setNote] = useState('');

    const addNoteMutation = useMutation({
        mutationFn: addNoteToCandidate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timeline', candidate.id] });
            setNote('');
        },
        onError: (err) => alert(err.message),
    });

    const handleSubmitNote = (e) => {
        e.preventDefault();
        if (!note.trim()) return;
        addNoteMutation.mutate({ id: candidate.id, stage: candidate.stage, notes: note });
    };

    const notesFromTimeline = (Array.isArray(timeline) ? timeline : []).filter(event => event.notes);

    return (
        <div className="profile-card notes-section">
            <h3 className="card-title">
                <FiMessageSquare />
                <span>Notes ({notesFromTimeline.length})</span>
            </h3>
            <form onSubmit={handleSubmitNote} className="add-note-form">
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note... Use @ to mention someone"
                    rows={3}
                />
                <div className="note-actions">
                    <div className="mention-helper">
                        {note.includes('@') && MOCK_USERS.map(u => `@${u}`).join(' ')}
                    </div>
                    <button type="submit" disabled={addNoteMutation.isLoading}>
                        <FiSend />
                        <span>{addNoteMutation.isLoading ? 'Adding...' : 'Add Note'}</span>
                    </button>
                </div>
            </form>
            <div className="notes-list">
                {notesFromTimeline.length === 0 ? (
                    <div className="no-notes-placeholder">
                        <FiMessageSquare size={40} />
                        <p>No notes yet</p>
                    </div>
                ) : (
                    [...notesFromTimeline].reverse().map(event => (
                        <div key={event.id} className="note-item">
                            <p>"{event.notes}"</p>
                            <small>Added in stage: <strong>{event.stage}</strong></small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}