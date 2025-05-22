import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchThreads } from '../store/threadsSlice';
import { setLoading } from '../store/uiSlice';
import ThreadsList from '../components/threads/ThreadsList';
import useAuth from '../hooks/useAuth';

function HomePage() {
  const dispatch = useDispatch();
  const { threads } = useSelector((state) => state.threads);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (threads.length === 0) {
      dispatch(setLoading({ loading: true, message: 'Loading threads...' }));
      dispatch(fetchThreads()).finally(() => {
        dispatch(setLoading({ loading: false }));
      });
    }
  }, [dispatch, threads.length]);

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="welcome-section">
          <h1>Welcome to Forum Diskusi</h1>
          <p>Join the conversation and share your thoughts with the community</p>
        </div>
        
        {isAuthenticated && (
          <div className="quick-actions">
            <Link to="/create-thread" className="create-thread-btn">
              + Create New Thread
            </Link>
          </div>
        )}
      </div>
      
      <ThreadsList />
    </div>
  );
}

export default HomePage;