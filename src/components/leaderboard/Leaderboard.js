import { useSelector } from 'react-redux';
import LeaderboardItem from './LeaderboardItem';

function Leaderboard() {
  const { leaderboards, loading, error } = useSelector((state) => state.leaderboard);

  if (loading) {
    return <div className="loading">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="error">Error loading leaderboard: {error}</div>;
  }

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <p className="leaderboard-description">Top active users in the forum</p>
      
      {leaderboards.length === 0 ? (
        <div className="no-data">
          <p>No leaderboard data available.</p>
        </div>
      ) : (
        <div className="leaderboard-list">
          {leaderboards.map((entry, index) => (
            <LeaderboardItem 
              key={entry.user.id} 
              entry={entry} 
              rank={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;