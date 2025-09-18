import React, { useState, useEffect } from 'react';
import './JobForm.css';

const createSlug = (title) => title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';

export default function JobForm({ initialData, onSubmit, onCancel, isSaving }) {
  const [job, setJob] = useState({ title: '', slug: '', tags: '' });

  useEffect(() => {
    if (initialData) {
      setJob({
        ...initialData,
        tags: initialData.tags?.join(', ') || '',
      });
    } else {
      setJob({ title: '', slug: '', tags: '' });
    }
  }, [initialData]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!job.title) {
      alert('Title is required.');
      return;
    }
    onSubmit({
      ...job,
      tags: job.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
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
        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
        <button type="submit" disabled={isSaving} className="btn-submit">
          {isSaving ? 'Saving...' : 'Save Job'}
        </button>
      </div>
    </form>
  );
}