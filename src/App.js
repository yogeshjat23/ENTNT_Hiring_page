import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, Link, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { useThemeStore } from './store/useThemeStore';
import ThemeToggle from './components/common/ThemeToggle';
import {FiGrid  , FiBriefcase, FiUsers, FiClipboard, FiList, FiLogOut, FiLogIn  ,FiRefreshCw } from 'react-icons/fi';
import Modal from './components/common/Modal';
import JobForm from './components/jobs/JobForm';
import { useJobModalStore } from './store/useJobModalStore'; 


// Page Components 

import ErrorBoundary from './components/common/ErrorBoundary';
import DashboardPage from './features/dashboard/DashboardPage';
import HomePage from './features/home/HomePage';
import LoginPage from './features/login/LoginPage';
import JobsBoard from './features/jobs/JobsBoard';
import JobDetailsModal from './features/jobs/JobDetailsModal';
import CandidatesKanban from './features/candidates/CandidatesKanban';
import CandidateProfile from './features/candidates/CandidateProfile';
import AllAssessmentsPage from './features/assessments/AllAssessmentsPage';
import CreateAssessmentPage from './features/assessments/CreateAssessmentPage';
import AssessmentBuilder from './features/assessments/AssessmentBuilder';

import './App.css';

const queryClient = new QueryClient();

// --- Unified App Layout (Handles both public and private states) ---
const AppLayout = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [isRefreshing, setIsRefreshing] = useState(false); // Add this state

  const handleRefresh = () => {
    setIsRefreshing(true); // Start animation
    // Reload the page after a short delay to allow the animation to be seen
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };


  return (
    <div className="App">
      <nav>
        <div className="nav-left">
          <h1><Link to="/" className="home-link">TalentFlow</Link></h1>
          {isLoggedIn && (
            <>
             
               <NavLink to="/dashboard"><FiGrid /><span>Dashboard</span></NavLink>
                <NavLink to="/jobs"><FiBriefcase /><span>Jobs</span></NavLink>
              <NavLink to="/candidates"><FiUsers /><span>Candidates</span></NavLink>
              <NavLink to="/assessments/new"><FiClipboard /><span>Create Assessment</span></NavLink>
              <NavLink to="/assessments" end><FiList /><span>All Assessments</span></NavLink>
            </>
          )}
        </div>
        <div className="nav-right">
    
          <button 
            onClick={handleRefresh} 
            className={`nav-action-btn ${isRefreshing ? 'refreshing' : ''}`} 
            title="Refresh Page"
          >
            <FiRefreshCw />
          </button>

          <ThemeToggle />
          {isLoggedIn ? (
            <div className="profile-section">
              <button className="profile-button" onClick={() => setIsDropdownOpen(prev => !prev)}>
                {user?.initials || 'U'}
              </button>
              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">Signed in as <br/> <strong>{user?.name || 'User'}</strong></div>
                  <button onClick={logout} className="dropdown-item logout-item"><FiLogOut /><span>Logout</span></button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-nav-button"><FiLogIn/><span>Login</span></Link>
          )}
        </div>
      </nav>
      <main><Outlet /></main>
     
    </div>
  );
};

// --- Main App Component ---
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
        <ErrorBoundary>
        <AuthProvider>
          <Routes>
            {/* All pages now use the smart AppLayout */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Routes are nested here */} 
                <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/jobs" element={<ProtectedRoute><JobsBoard /></ProtectedRoute>} />
              <Route path="/candidates" element={<ProtectedRoute><CandidatesKanban /></ProtectedRoute>} />
              <Route path="/candidates/:id" element={<ProtectedRoute><CandidateProfile /></ProtectedRoute>} />
              <Route path="/assessments" element={<ProtectedRoute><AllAssessmentsPage /></ProtectedRoute>} />
              <Route path="/assessments/new" element={<ProtectedRoute><CreateAssessmentPage /></ProtectedRoute>} />
              <Route path="/assessments/:jobId" element={<ProtectedRoute><AssessmentBuilder /></ProtectedRoute>} />
            </Route>

            {/* Top-level modal route also needs protection */}
            <Route path="/jobs/:jobId" element={<ProtectedRoute><JobDetailsModal /></ProtectedRoute>} />
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
          {/* Create/Edit Job Modal remains at the top level */}
          <Modal isOpen={isOpen} onClose={closeModal} title={jobToEdit ? 'Edit Job' : 'Create New Job'}>
            <JobForm />
          </Modal>
        </AuthProvider>
          </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}

// ProtectedRoute Wrapper (no changes needed)
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default App;