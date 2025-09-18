import React, { useEffect } from 'react'; // Added useEffect
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import JobsBoard from './features/jobs/JobsBoard';
import CandidatesKanban from './features/candidates/CandidatesKanban';
import AssessmentBuilder from './features/assessments/AssessmentBuilder';
import { useThemeStore } from './store/useThemeStore'; // Added: Import the theme store
import ThemeToggle from './components/common/ThemeToggle'; // Added: Import the toggle button

import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  // Added: Get the current theme from the store
  const theme = useThemeStore((state) => state.theme);

  // Added: This effect runs when the theme changes and applies a class to the body
  useEffect(() => {
    // Clear any existing theme classes
    document.body.className = '';
    // Add the current theme class (e.g., 'dark-mode' or 'light-mode')
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

          {/* Added: The theme toggle button is placed here */}
       

          <main>
            <Routes>
              <Route path="/" element={<JobsBoard />} />
              <Route path="/jobs" element={<JobsBoard />} />
              <Route path="/candidates" element={<CandidatesKanban />} />
              <Route path="/assessments/:jobId" element={<AssessmentBuilder />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;