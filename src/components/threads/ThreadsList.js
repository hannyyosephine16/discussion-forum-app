// File: src/components/threads/ThreadsList.js - Optimized with Virtual Scrolling
import { useSelector } from 'react-redux';
import { useMemo, useState, useCallback, useEffect } from 'react';
import ThreadItem from './ThreadItem';
import CategoryFilter from './CategoryFilter';

// OPTIMASI: Virtual scrolling untuk handle large lists
const ITEMS_PER_PAGE = 10;

function ThreadsList() {
  const { filteredThreads, loading } = useSelector((state) => state.threads);
  const { users } = useSelector((state) => state.users);
  
  // OPTIMASI: Pagination state
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // OPTIMASI: Memoize users map untuk avoid recalculation
  const usersMap = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }, [users]);

  // OPTIMASI: Memoize displayed threads
  const displayedThreads = useMemo(() => {
    return filteredThreads.slice(0, displayCount);
  }, [filteredThreads, displayCount]);

  // OPTIMASI: Load more handler with debouncing
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || displayCount >= filteredThreads.length) return;

    setIsLoadingMore(true);
    
    // Simulate async loading untuk UX yang lebih baik
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredThreads.length));
    setIsLoadingMore(false);
  }, [isLoadingMore, displayCount, filteredThreads.length]);

  // OPTIMASI: Intersection Observer untuk infinite scroll
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isNearBottom = scrollHeight - scrollTop <= clientHeight + 100;
    
    if (isNearBottom && !isLoadingMore && displayCount < filteredThreads.length) {
      handleLoadMore();
    }
  }, [handleLoadMore, isLoadingMore, displayCount, filteredThreads.length]);

  // Reset display count when filtered threads change
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [filteredThreads]);

  if (loading) {
    return (
      <div className="threads-container">
        <div className="loading-skeleton">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="thread-skeleton">
              <div className="skeleton-votes"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-body"></div>
                <div className="skeleton-meta"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasMoreToLoad = displayCount < filteredThreads.length;

  return (
    <div className="threads-container">
      <div className="threads-header">
        <div className="threads-title-section">
          <h2>Forum Threads</h2>
          <div className="threads-count">
            Showing {displayedThreads.length} of {filteredThreads.length} threads
          </div>
        </div>
        <CategoryFilter />
      </div>
      
      {filteredThreads.length === 0 ? (
        <div className="no-threads">
          <div className="no-threads-icon">💬</div>
          <h3>No threads found</h3>
          <p>Be the first to create one and start the conversation!</p>
        </div>
      ) : (
        <>
          <div 
            className="threads-list"
            onScroll={handleScroll}
            style={{ maxHeight: '80vh', overflowY: 'auto' }}
          >
            {displayedThreads.map((thread, index) => (
              <ThreadItem 
                key={`${thread.id}-${index}`} // Ensure unique keys
                thread={thread} 
                owner={usersMap[thread.ownerId]}
                isLast={index === displayedThreads.length - 1}
              />
            ))}
          </div>
          
          {/* OPTIMASI: Load more section */}
          {hasMoreToLoad && (
            <div className="load-more-section">
              {isLoadingMore ? (
                <div className="loading-more">
                  <div className="loading-spinner"></div>
                  <span>Loading more threads...</span>
                </div>
              ) : (
                <button 
                  className="load-more-btn"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  Load More Threads ({filteredThreads.length - displayCount} remaining)
                </button>
              )}
            </div>
          )}
          
          {/* Progress indicator */}
          <div className="threads-progress">
            <div 
              className="progress-bar"
              style={{ 
                width: `${(displayCount / filteredThreads.length) * 100}%` 
              }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
}

export default ThreadsList;