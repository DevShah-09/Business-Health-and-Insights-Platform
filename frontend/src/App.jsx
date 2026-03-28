import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/dashboard/Sidebar';
import { TopBar } from './components/dashboard/TopBar';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Financials from './pages/Financials';
import Insights from './pages/Insights';
import Forecast from './pages/Forecast';
import Simulation from './pages/Simulation';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-background text-surface-foreground">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

const AuthenticatedLayout = ({ children }) => (
  <div className="flex h-screen w-screen bg-background text-surface-foreground selection:bg-brand-muted overflow-hidden">
    <Sidebar />
    <main className="flex-1 min-w-0 flex flex-col relative w-full h-full overflow-hidden">
      <TopBar />
      {children}
    </main>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Transactions />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/financials" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Financials />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/insights" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Insights />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/forecast" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Forecast />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/simulation" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Simulation />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Profile />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<div className="p-8 text-surface-foreground">404 - Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
