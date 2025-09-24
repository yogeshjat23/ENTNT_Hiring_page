
import React, { useEffect, useState } from 'react';
import './NotesModal.css';
const MENTIONS = [
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bob' },
  { id: 'u3', name: 'Cathy' },
  { id: 'u4', name: 'Dev' },
];

export default function NotesModal() {
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState(null);
  const [onConfirm, setOnConfirm] = useState(null);
  const [notes, setNotes] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const detail = e.detail || {};
      setMeta(detail.meta || null);
      setOnConfirm(() => detail.onConfirm || null);
      setNotes('');
      setOpen(true);
    };
    window.addEventListener('openNotesModal', handler);
    return () => window.removeEventListener('openNotesModal', handler);
  }, []);

  

  const close = () => {
    setOpen(false);
    setMeta(null);
    setOnConfirm(null);
    setNotes('');
  };

  const confirm = () => {
    if (typeof onConfirm === 'function') onConfirm(notes || '');
    close();
  };


  useEffect(() => {
    const m = notes.match(/@([a-zA-Z0-9_]*)$/);
    if (!m) {
      setSuggestions([]);
      return;
    }
    const term = m[1].toLowerCase();
    setSuggestions(MENTIONS.filter(u => u.name.toLowerCase().includes(term)).slice(0, 6));
  }, [notes]);

  if (!open) return null;

  return (
    <div className="notes-modal-backdrop">
      <div className="notes-modal">
        <h3>Add notes {meta?.name ? `for ${meta.name}` : ''}</h3>
        <textarea
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write notes, use @ to mention..."
        />
        {suggestions.length > 0 && (
          <div className="mention-suggestions">
            {suggestions.map(s => (
              <div key={s.id} className="mention-item">{s.name}</div>
            ))}
          </div>
        )}
        <div className="notes-actions">
          <button onClick={close}>Cancel</button>
          <button onClick={confirm}>Save</button>
        </div>
      </div>
    </div>
  );
}
