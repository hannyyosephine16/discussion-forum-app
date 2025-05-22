import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from './components/common/Navigation';
import LoadingBar from './components/common/LoadingBar';
import ProtectedRoute from './components/common/ProtectedRoute';
import { fetchUsers } from './store/usersSlice';
import { fetchThreads } from './store/threadsSlice';
import { setLoading } from './store/uiSlice';
import './styles/App.css';

// Lazy load komponen
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ThreadDetailPage = lazy(() => import('./pages/ThreadDetailPage'));
const CreateThreadPage = lazy(() => import('./pages/CreateThreadPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));

const LazyLoadingFallback = ({ message = "Loading page..." }) => (
  <div className="lazy-loading-fallback">
    <div className="loading-spinner" aria-hidden="true"></div>
    <p>{message}</p>
    <span className="sr-only">Page is loading, please wait...</span>
  </div>
);

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
  const { users } = useSelector((state) => state.users);
  const { threads } = useSelector((state) => state.threads);

  useEffect(() => {
    // OPTIMASI: Parallel loading untuk data yang tidak saling bergantung
    const loadInitialData = async () => {
      dispatch(setLoading({ loading: true, message: 'Loading application data...' }));
      
      try {
        // Load users dan threads secara parallel
        await Promise.all([
          users.length === 0 ? dispatch(fetchUsers()) : Promise.resolve(),
          threads.length === 0 ? dispatch(fetchThreads()) : Promise.resolve()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };

    // Hanya load jika belum ada data (caching)
    if (users.length === 0 || threads.length === 0) {
      loadInitialData();
    }
  }, [dispatch, users.length, threads.length]);

  return (
    <div className="App">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <Navigation />
      {isLoading && <LoadingBar />}
      
      <main id="main-content" className="main-content">
        <LazyLoadErrorBoundary>
          <Suspense fallback={<LazyLoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/thread/:id" element={<ThreadDetailPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route 
                path="/create-thread" 
                element={
                  <ProtectedRoute>
                    <CreateThreadPage />
                  </ProtectedRoute>
                } 
              />
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