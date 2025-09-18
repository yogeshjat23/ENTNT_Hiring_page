import React, { useState, useEffect } from 'react';
import { useJobModalStore } from '../../store/useJobModalStore';
import './JobForm.css';

const createSlug = (title) => title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';

export default function JobForm() {
  // Get all necessary data and functions from the global store
  const { jobToEdit, handleSubmit, closeModal } = useJobModalStore();

  const [job, setJob] = useState({ title: '', slug: '', tags: '' });

  useEffect(() => {
    if (jobToEdit) {
      setJob({
        ...jobToEdit,
        tags: jobToEdit.tags?.join(', ') || '',
      });
    } else {
      setJob({ title: '', slug: '', tags: '' }); // Reset for 'create' mode
    }
  }, [jobToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prev => {
      const newJob = { ...prev, [name]: value };
      if (name === 'title') {
        newJob.slug = createSlug(value);
      }
      return newJob;
    });
  };

  const handleSubmitWrapper = (e) => {
    e.preventDefault();
    if (!job.title) {
      alert('Title is required.');
      return;
    }
    // Call the handleSubmit function that was passed into the store
    handleSubmit({
      ...job,
      tags: job.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmitWrapper} className="job-form">
      <div className="form-group">
        <label htmlFor="title">Job Title</label>
        <input type="text" id="title" name="title" value={job.title} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="slug">Slug</label>
        <input type="text" id="slug" name="slug" value={job.slug} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input type="text" id="tags" name="tags" value={job.tags} onChange={handleChange} />
      </div>
      <div className="form-actions">
        <button type="button" onClick={closeModal} className="btn-cancel">Cancel</button>
        <button type="submit" className="btn-submit">
            Save Job
        </button>
      </div>
    </form>
  );
}