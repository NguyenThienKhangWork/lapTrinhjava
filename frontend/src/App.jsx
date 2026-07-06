import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import PostJob from './pages/PostJob';
import BrowseJobs from './pages/BrowseJobs';
import Marketplace from './pages/Marketplace';
import JobDetail from './pages/JobDetail';
import ProjectDetail from './pages/ProjectDetail';
import AdminDashboard from './pages/AdminDashboard';
import ExpertServices from './pages/ExpertServices';
import ExpertProfile from './pages/ExpertProfile';
import ReviewPage from './pages/ReviewPage';
import ChatList from './pages/ChatList';
import TransactionHistory from './pages/TransactionHistory';
import Notifications from './pages/Notifications';
import AiChatbox from './components/AiChatbox';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '200px 20px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--cp-cyan)', background: '#05050a', minHeight: '100vh' }}>
        ⚡ LOADING CORE SECURITY SYSTEM...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <Navbar />
      <main style={{ flex: 1, position: 'relative' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Client Protected Routes */}
          <Route path="/client" element={<ProtectedRoute allowedRoles={['CLIENT']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute allowedRoles={['CLIENT']}><PostJob /></ProtectedRoute>} />

          {/* Expert Protected Routes */}
          <Route path="/expert" element={<ProtectedRoute allowedRoles={['EXPERT']}><ExpertDashboard /></ProtectedRoute>} />
          <Route path="/expert/services" element={<ProtectedRoute allowedRoles={['EXPERT']}><ExpertServices /></ProtectedRoute>} />
          <Route path="/expert/profile" element={<ProtectedRoute allowedRoles={['EXPERT']}><ExpertProfile /></ProtectedRoute>} />
          <Route path="/browse-jobs" element={<ProtectedRoute allowedRoles={['EXPERT']}><BrowseJobs /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />

          {/* Shared Protected Routes (Client + Expert) */}
          <Route path="/projects/:id" element={<ProtectedRoute allowedRoles={['CLIENT', 'EXPERT']}><ProjectDetail /></ProtectedRoute>} />
          <Route path="/projects/:projectId/review" element={<ProtectedRoute allowedRoles={['CLIENT', 'EXPERT']}><ReviewPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute allowedRoles={['CLIENT', 'EXPERT']}><ChatList /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute allowedRoles={['CLIENT', 'EXPERT']}><TransactionHistory /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute allowedRoles={['CLIENT', 'EXPERT', 'ADMIN']}><Notifications /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <AiChatbox />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a0a14',
              color: '#e0e0ec',
              border: '1px solid #00f0ff',
              fontFamily: 'Share Tech Mono, monospace',
              borderRadius: '0px',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}
