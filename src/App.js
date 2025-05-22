import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Navigation from './components/common/Navigation';
import LoadingBar from './components/common/LoadingBar';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import CreateThreadPage from './pages/CreateThreadPage';
import LeaderboardPage from './pages/LeaderboardPage';
import { fetchUsers } from './store/usersSlice';
import { setLoading } from './store/uiSlice';
import useAuth from './hooks/useAuth';
import './styles/App.css';

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.ui);
  // const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Fetch users on app initialization
    dispatch(setLoading({ loading: true, message: 'Loading users...' }));
    dispatch(fetchUsers()).finally(() => {
      dispatch(setLoading({ loading: false }));
    });
  }, [dispatch]);

  return (
    <div className="App">
      <Navigation />
      {isLoading && <LoadingBar />}
      <main className="main-content">
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
        </Routes>
      </main>
    </div>
  );
}

export default App;