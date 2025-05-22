import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreadDetail, clearCurrentThread } from '../store/threadsSlice';
import { setLoading } from '../store/uiSlice';
import ThreadDetail from '../components/threads/ThreadDetail';

function ThreadDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentThread, error } = useSelector((state) => state.threads);

  useEffect(() => {
    dispatch(setLoading({ loading: true, message: 'Loading thread...' }));
    dispatch(fetchThreadDetail(id)).finally(() => {
      dispatch(setLoading({ loading: false }));
    });

    // Cleanup current thread when component unmounts
    return () => {
      dispatch(clearCurrentThread());
    };
  }, [dispatch, id]);

  if (error) {
    return (
      <div className="error-page">
        <h2>Error Loading Thread</h2>
        <p>{error}</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="thread-detail-page">
      <div className="page-header">
        <Link to="/" className="back-link">← Back to Threads</Link>
      </div>
      
      <ThreadDetail thread={currentThread} />
    </div>
  );
}

export default ThreadDetailPage;