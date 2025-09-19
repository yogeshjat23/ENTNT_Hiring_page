import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Outlet } from 'react-router-dom'; // Make sure Outlet is imported
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from './store/useThemeStore';
import ThemeToggle from './components/common/ThemeToggle';
import JobsBoard from './features/jobs/JobsBoard';
import CandidatesKanban from './features/candidates/CandidatesKanban';
import AssessmentBuilder from './features/assessments/AssessmentBuilder';
import { useJobModalStore } from './store/useJobModalStore';
import Modal from './components/common/Modal';
import JobForm from './components/jobs/JobForm';
import JobDetailsModal from './features/jobs/JobDetailsModal'; // Ensure this is imported
import CandidateProfile from "./features/candidates/CandidateProfile";
import AllAssessmentsPage from './features/assessments/AllAssessmentsPage';
import CreateAssessmentPage from './features/assessments/CreateAssessmentPage';
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
            <NavLink to = "/assessments/new" > Create Assessment </NavLink> 
              <NavLink to="/assessments" end>All Assessments</NavLink>
            <ThemeToggle />
          </nav>

          <main>
            <Routes>
              {/* The JobDetailsModal route is no longer nested here */}
            
              <Route path="/" element={<JobsBoard />} />
              <Route path="/jobs" element={<JobsBoard />} />
              <Route path="/candidates" element={<CandidatesKanban />} />
              <Route path="/candidates/:id" element={<CandidateProfile />} />
                  <Route path="/assessments" element={<AllAssessmentsPage />} />
                  < Route path = "/assessments/new" element = {<CreateAssessmentPage/>}/>
              <Route path="/assessments/:jobId" element={<AssessmentBuilder />} />
              
            </Routes>
          </main>

          {/* This Outlet will render routes that should appear OVER the main content */}
          <Routes>
              <Route path="/jobs/:jobId" element={<JobDetailsModal />} />
          </Routes>
          
          {/* The Create/Edit modal is rendered based on Zustand state, which is fine */}
          <Modal isOpen={isOpen} onClose={closeModal} title={jobToEdit ? 'Edit Job' : 'Create New Job'}>
            <JobForm />
          </Modal>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

// A layout component to handle nested routes if you want to bring that back later
// For now, the simpler structure above is better.
const JobsLayout = () => (
    <>
      <JobsBoard />
      <Outlet />
    </>
);


export default App;