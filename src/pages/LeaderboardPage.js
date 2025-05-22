import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchLeaderboards } from '../store/leaderboardSlice';
import { setLoading } from '../store/uiSlice';
import Leaderboard from '../components/leaderboard/Leaderboard';

function LeaderboardPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading({ loading: true, message: 'Loading leaderboard...' }));
    dispatch(fetchLeaderboards()).finally(() => {
      dispatch(setLoading({ loading: false }));
    });
  }, [dispatch]);

  return (
    <div className="leaderboard-page">
      <Leaderboard />
    </div>
  );
}

export default LeaderboardPage;