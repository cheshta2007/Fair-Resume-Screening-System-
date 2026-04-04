import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages (to be created)
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HRDashboard from './pages/HRDashboard';
import CandidateDashboard from './pages/CandidateDashboard';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/hr-dashboard" element={
              <ProtectedRoute allowedRole="hr">
                <HRDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/candidate-dashboard" element={
              <ProtectedRoute allowedRole="candidate">
                <CandidateDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
