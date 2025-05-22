function LeaderboardItem({ entry, rank }) {
  const getRankIcon = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${position}`;
    }
  };

  const getRankClass = (position) => {
    if (position <= 3) return `rank-${position}`;
    return 'rank-other';
  };

  return (
    <div className={`leaderboard-item ${getRankClass(rank)}`}>
      <div className="rank-badge">
        <span className="rank-icon">{getRankIcon(rank)}</span>
      </div>
      
      <div className="user-info">
        <img 
          src={entry.user.avatar || 'https://ui-avatars.com/api/?name=User&background=random'} 
          alt={entry.user.name}
          className="user-avatar"
        />
        <div className="user-details">
          <h3 className="user-name">{entry.user.name}</h3>
          <p className="user-email">{entry.user.email}</p>
        </div>
      </div>
      
      <div className="score">
        <span className="score-value">{entry.score}</span>
        <span className="score-label">points</span>
      </div>
    </div>
  );
}

export default LeaderboardItem;