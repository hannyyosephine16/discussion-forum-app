import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchThreads } from '../store/threadsSlice';
import { setLoading } from '../store/uiSlice';
import ThreadsList from '../components/threads/ThreadsList';
import useAuth from '../hooks/useAuth';

function HomePage() {
  const dispatch = useDispatch();
  const { threads, loading: threadsLoading } = useSelector((state) => state.threads);
  const { isAuthenticated } = useAuth();

  // OPTIMASI: Memoize expensive calculations
  const threadStats = useMemo(() => {
    return {
      totalThreads: threads.length,
      totalComments: threads.reduce((sum, thread) => sum + (thread.totalComments || 0), 0),
      categories: [...new Set(threads.map(thread => thread.category))].length
    };
  }, [threads]);

  useEffect(() => {
    // OPTIMASI: Hanya fetch jika data belum ada dan tidak sedang loading
    if (threads.length === 0 && !threadsLoading) {
      dispatch(setLoading({ loading: true, message: 'Loading threads...' }));
      dispatch(fetchThreads()).finally(() => {
        dispatch(setLoading({ loading: false }));
      });
    }
  }, [dispatch, threads.length, threadsLoading]);

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="welcome-section">
          <h1>Welcome to Forum Diskusi</h1>
          <p>Join the conversation and share your thoughts with the community</p>
          
          {/* TAMBAHAN: Stats untuk user engagement */}
          <div className="forum-stats">
            <div className="stat-item">
              <span className="stat-number">{threadStats.totalThreads}</span>
              <span className="stat-label">Threads</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{threadStats.totalComments}</span>
              <span className="stat-label">Comments</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{threadStats.categories}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
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