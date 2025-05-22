// File: src/App.js
import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from './components/common/Navigation';
import LoadingBar from './components/common/LoadingBar';
import ProtectedRoute from './components/common/ProtectedRoute';
import { fetchUsers } from './store/usersSlice';
import { setLoading } from './store/uiSlice';
import './styles/App.css';

// Lazy load komponen untuk code splitting dan performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ThreadDetailPage = lazy(() => import('./pages/ThreadDetailPage'));
const CreateThreadPage = lazy(() => import('./pages/CreateThreadPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));

// Custom loading fallback component
const LazyLoadingFallback = ({ message = "Loading page..." }) => (
  <div className="lazy-loading-fallback">
    <div className="loading-spinner" aria-hidden="true"></div>
    <p>{message}</p>
    <span className="sr-only">Page is loading, please wait...</span>
  </div>
);

// Error boundary untuk lazy loading
class LazyLoadErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong loading the page.</h2>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.ui);

  useEffect(() => {
    // Fetch users on app initialization
    dispatch(setLoading({ loading: true, message: 'Loading users...' }));
    dispatch(fetchUsers()).finally(() => {
      dispatch(setLoading({ loading: false }));
    });
  }, [dispatch]);

  return (
    <div className="App">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <Navigation />
      {isLoading && <LoadingBar />}
      
      <main id="main-content" className="main-content">
        <LazyLoadErrorBoundary>
          <Suspense fallback={<LazyLoadingFallback />}>
            <Routes>
              <Route 
                path="/" 
                element={<HomePage />} 
              />
              <Route 
                path="/login" 
                element={<LoginPage />} 
              />
              <Route 
                path="/register" 
                element={<RegisterPage />} 
              />
              <Route 
                path="/thread/:id" 
                element={<ThreadDetailPage />} 
              />
              <Route 
                path="/leaderboard" 
                element={<LeaderboardPage />} 
              />
              <Route 
                path="/create-thread" 
                element={
                  <ProtectedRoute>
                    <CreateThreadPage />
                  </ProtectedRoute>
                } 
              />
              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <div className="error-page">
                    <h2>Page Not Found</h2>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn btn-primary">Go Home</a>
                  </div>
                } 
              />
            </Routes>
          </Suspense>
        </LazyLoadErrorBoundary>
      </main>
    </div>
  );
}

export default App;