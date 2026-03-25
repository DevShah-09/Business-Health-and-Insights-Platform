import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/dashboard/Sidebar';
import { TopBar } from './components/dashboard/TopBar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Financials from './pages/Financials';
import Insights from './pages/Insights';
import Forecast from './pages/Forecast';
import Simulation from './pages/Simulation';
import LoginPage from './pages/LoginPage';

/** Wrapper that redirects to /login when not authenticated */
function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // still checking localStorage

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen w-screen bg-background text-surface-foreground selection:bg-brand-muted overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative w-full h-full overflow-hidden">
        <TopBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/financials" element={<Financials />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="*" element={<div className="p-8">404 - Page not found</div>} />
        </Routes>
      </main>
    </div>
  );
}

/** Redirect away from login if already authenticated */
function LoginRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <LoginPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
