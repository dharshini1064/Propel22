import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Layout components
import Layout from './components/layout/Layout';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard components
import Dashboard from './components/dashboard/Dashboard';

// Company Profile components
import CompanyProfile from './components/company/CompanyProfile';
import PartnerList from './components/company/PartnerList';

// Business Plan components
import BusinessPlanWizard from './components/business-plan/BusinessPlanWizard';
import BusinessPlanList from './components/business-plan/BusinessPlanList';
import BusinessPlanDetail from './components/business-plan/BusinessPlanDetail';

// Bookkeeping components
import BookkeepingForm from './components/bookkeeping/BookkeepingForm';
import BookkeepingList from './components/bookkeeping/BookkeepingList';

// Evaluation components
import EvaluationForm from './components/evaluation/EvaluationForm';
import EvaluationList from './components/evaluation/EvaluationList';

// Reports components
import Reports from './components/reports/Reports';

// Document components
import Documents from './components/documents/Documents';

function App() {
  // In a real app, this would be handled with a proper auth context
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Mock login function
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Mock logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/" element={isAuthenticated ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          
          {/* Company Profile routes */}
          <Route path="company-profile" element={<CompanyProfile />} />
          <Route path="partners" element={<PartnerList />} />
          
          {/* Business Plan routes */}
          <Route path="business-plans" element={<BusinessPlanList />} />
          <Route path="business-plans/create" element={<BusinessPlanWizard />} />
          <Route path="business-plans/:id" element={<BusinessPlanDetail />} />
          <Route path="business-plans/:id/edit" element={<BusinessPlanWizard />} />
          
          {/* Bookkeeping routes */}
          <Route path="bookkeeping" element={<BookkeepingList />} />
          <Route path="bookkeeping/new" element={<BookkeepingForm />} />
          <Route path="bookkeeping/:id" element={<BookkeepingForm />} />
          
          {/* Evaluation routes */}
          <Route path="evaluations" element={<EvaluationList />} />
          <Route path="evaluations/new" element={<EvaluationForm />} />
          <Route path="evaluations/:id" element={<EvaluationForm />} />
          
          {/* Reports routes */}
          <Route path="reports" element={<Reports />} />
          
          {/* Documents routes */}
          <Route path="documents" element={<Documents />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Box>
  );
}

export default App;