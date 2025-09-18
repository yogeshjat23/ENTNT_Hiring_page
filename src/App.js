import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from './store/useThemeStore';
import ThemeToggle from './components/common/ThemeToggle';
import JobsBoard from './features/jobs/JobsBoard';
import CandidatesKanban from './features/candidates/CandidatesKanban';
import AssessmentBuilder from './features/assessments/AssessmentBuilder';
import { useJobModalStore } from './store/useJobModalStore';
import Modal from './components/common/Modal';
import JobForm from './components/jobs/JobForm';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const theme = useThemeStore((state) => state.theme);
  const { isOpen, jobToEdit, closeModal } = useJobModalStore();

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`${theme}-mode`);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <nav>
            <h1>TalentFlow</h1>
            <NavLink to="/jobs">Jobs</NavLink>
            <NavLink to="/candidates">Candidates</NavLink>
            <NavLink to="/assessments/job-1">Assessments</NavLink>
            <ThemeToggle />
          </nav>

          <main>
            <Routes>
              <Route path="/" element={<JobsBoard />} />
              <Route path="/jobs" element={<JobsBoard />} />
              <Route path="/candidates" element={<CandidatesKanban />} />
              <Route path="/assessments/:jobId" element={<AssessmentBuilder />} />
            </Routes>
          </main>

          {/* The Modal is now rendered here, at the root, to ensure it's on top of all content */}
          <Modal isOpen={isOpen} onClose={closeModal} title={jobToEdit ? 'Edit Job' : 'Create New Job'}>
            <JobForm />
          </Modal>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;