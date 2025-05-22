import { useSelector } from 'react-redux';
import ThreadItem from './ThreadItem';
import CategoryFilter from './CategoryFilter';

function ThreadsList() {
  const { filteredThreads, loading } = useSelector((state) => state.threads);
  const { users } = useSelector((state) => state.users);

  // Create a map of users for quick lookup
  const usersMap = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  if (loading) {
    return <div className="loading">Loading threads...</div>;
  }

  return (
    <div className="threads-container">
      <div className="threads-header">
        <h2>Forum Threads</h2>
        <CategoryFilter />
      </div>
      
      {filteredThreads.length === 0 ? (
        <div className="no-threads">
          <p>No threads found. Be the first to create one!</p>
        </div>
      ) : (
        <div className="threads-list">
          {filteredThreads.map((thread) => (
            <ThreadItem 
              key={thread.id} 
              thread={thread} 
              owner={usersMap[thread.ownerId]} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ThreadsList;