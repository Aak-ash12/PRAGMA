import React, { Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import AgentsPage from './pages/AgentsPage';
import SimulationPage from './pages/SimulationPage';
import PredictionPage from './pages/PredictionPage';
import PoliciesPage from './pages/PoliciesPage';
import XAIPage from './pages/XAIPage';
import DatasetsPage from './pages/DatasetsPage';
import ReportsPage from './pages/ReportsPage';
import AdminPage from './pages/AdminPage';
import ResourceAllocationPage from './pages/ResourceAllocationPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { ToastProvider } from './contexts/ToastContext';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by GlobalErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#081120] text-white flex flex-col items-center justify-center p-6 text-center font-inter">
          <div className="glass-card bg-[#0D1527] border border-primary/40 p-8 rounded-3xl max-w-2xl w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-danger/20 text-danger flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-xl font-bold font-poppins">PRAGMA Diagnostic Catch</h2>
            <div className="p-4 bg-black/60 rounded-xl text-left border border-white/10 text-xs font-mono text-rose-300 space-y-2 overflow-x-auto">
              <p className="font-bold text-white text-sm">{this.state.error?.toString()}</p>
              <pre className="text-[10px] text-gray-400 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack || this.state.error?.stack}
              </pre>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.href = '/dashboard';
              }}
              className="w-full py-3 px-4 bg-primary hover:bg-primaryHover text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-primary/30 uppercase tracking-wider"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <GlobalErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/prediction" element={<PredictionPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/xai" element={<XAIPage />} />
            <Route path="/datasets" element={<DatasetsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/resources" element={<ResourceAllocationPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
