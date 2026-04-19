import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/Upload';
import CaseResult from './pages/CaseResult';
import HistoryPage from './pages/History';
import ScrollToTop from './components/ScrollToTop';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

import Welcome from './pages/Welcome';
import DemoPage from './pages/Demo';
import About from './pages/About';
import Contact from './pages/Contact';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import ScanManagement from './pages/ScanManagement';
import PublicLayout from './layouts/PublicLayout';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Pages Wrapper */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={
          user ? <Navigate to="/dashboard" replace /> : <Welcome />
        } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/demo" element={<DemoPage />} />
      </Route>

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="cases/:id" element={<CaseResult />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
        <Route path="scan-management" element={<ScanManagement />} />
      </Route>

      {/* Catch-all route to redirect any unknown paths to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <AuthProvider>
            <ChatProvider>
              <AppRoutes />
            </ChatProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
