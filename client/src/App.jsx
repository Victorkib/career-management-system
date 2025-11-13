'use client';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ConfigProvider, theme as antTheme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ErrorBoundary from './components/v2/common/ErrorBoundary';

// Pages
import Landing from './pages/v2/Landing';
import Login from './pages/v2/Login';
import Register from './pages/v2/Register';
import Dashboard from './pages/v2/Dashboard';
import ResultsInput from './pages/v2/ResultsInput';
import CareerRecommendations from './pages/v2/CareerRecommendations';
import CareerDetails from './pages/v2/CareerDetails';
import Profile from './pages/v2/Profile';
import NotFound from './pages/v2/NotFound';
import About from './pages/v2/About';
import Contact from './pages/v2/Contact';
import FAQ from './pages/v2/FAQ';
import VerifyEmail from './pages/v2/VerifyEmail';
import ForgotPassword from './pages/v2/ForgotPassword';
import ResetPassword from './pages/v2/ResetPassword';
import ResendVerification from './pages/v2/ResendVerification';
import SessionManagement from './pages/v2/SessionManagement';
import Careers from './pages/v2/Careers';
import Trends from './pages/v2/Trends';
import Guides from './pages/v2/Guides';
import Institutions from './pages/v2/Institutions';

// Admin Pages
import AdminDashboard from './pages/v2/admin/Dashboard';
import AdminUsers from './pages/v2/admin/Users';
import AdminCareers from './pages/v2/admin/Careers';
import AdminInstitutions from './pages/v2/admin/Institutions';
import AdminActivity from './pages/v2/admin/Activity';
import AdminSettings from './pages/v2/admin/Settings';
import AdminBackup from './pages/v2/admin/Backup';
import AcceptInvitation from './pages/v2/admin/AcceptInvitation';

// Components
import Layout from './components/v2/Layout';
import AdminLayout from './components/v2/admin/AdminLayout';
import AdminAnalytics from './pages/v2/admin/Analytics';
import InstitutionDetails from './pages/v2/InstitutionsDetails';
import Terms from './pages/v2/Terms';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  // Check both authentication and admin role
  return isAuthenticated && user?.role === 'admin' ? (
    children
  ) : (
    <Navigate to="/dashboard" />
  );
};

// Theme-aware ConfigProvider
const ThemedConfigProvider = ({ children }) => {
  const { theme } = useTheme();

  // Create a custom theme based on current mode
  const customTheme = {
    token: {
      colorPrimary: '#0080ff',
      borderRadius: 6,
      fontFamily: "'Inter', sans-serif",
    },
    algorithm:
      theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  };

  return <ConfigProvider theme={customTheme}>{children}</ConfigProvider>;
};

function App() {
  return (
    <ThemeProvider>
      <ThemedConfigProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Router>
              <ErrorBoundary>
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <Layout>
                        <Landing />
                      </Layout>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <Layout>
                        <Login />
                      </Layout>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <Layout>
                        <Register />
                      </Layout>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <Layout>
                        <About />
                      </Layout>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <Layout>
                        <Contact />
                      </Layout>
                    }
                  />
                  <Route
                    path="/faq"
                    element={
                      <Layout>
                        <FAQ />
                      </Layout>
                    }
                  />
                  <Route
                    path="/verify-email/:token"
                    element={
                      <Layout>
                        <VerifyEmail />
                      </Layout>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <Layout>
                        <ForgotPassword />
                      </Layout>
                    }
                  />
                  <Route
                    path="/reset-password/:token"
                    element={
                      <Layout>
                        <ResetPassword />
                      </Layout>
                    }
                  />
                  <Route
                    path="/resend-verification"
                    element={
                      <Layout>
                        <ResendVerification />
                      </Layout>
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <Layout>
                        <Terms />
                      </Layout>
                    }
                  />
                 
                  <Route
                    path="/admin/accept-invitation/:token"
                    element={<AcceptInvitation />}
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/input-results"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ResultsInput />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/recommendations"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <CareerRecommendations />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/career/:id"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <CareerDetails />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Profile />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/sessions"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <SessionManagement />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/careers"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Careers />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/trends"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Trends />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/guides"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Guides />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/institutions"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Institutions />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/institutions/:id"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <InstitutionDetails />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminLayout>
                          <AdminDashboard />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminRoute>
                        <AdminUsers />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/careers"
                    element={
                      <AdminRoute>
                        <AdminCareers />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <AdminRoute>
                        <AdminAnalytics />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/institutions"
                    element={
                      <AdminRoute>
                        <AdminInstitutions />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/activity"
                    element={
                      <AdminRoute>
                        <AdminActivity />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <AdminRoute>
                        <AdminSettings />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/backup"
                    element={
                      <AdminRoute>
                        <AdminBackup />
                      </AdminRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route
                    path="*"
                    element={
                      <Layout>
                        <NotFound />
                      </Layout>
                    }
                  />
                </Routes>
              </ErrorBoundary>
            </Router>
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemedConfigProvider>
    </ThemeProvider>
  );
}

export default App;
