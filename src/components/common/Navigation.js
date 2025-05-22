import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import useAuth from '../../hooks/useAuth';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    
    // Announce logout to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'You have been logged out successfully';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const isCurrentPage = (path) => {
    return location.pathname === path;
  };

  const getLinkProps = (path, label) => {
    return {
      'aria-current': isCurrentPage(path) ? 'page' : undefined,
      'aria-label': isCurrentPage(path) ? `${label} (current page)` : label
    };
  };

  return (
    <nav 
      className="navigation" 
      role="navigation" 
      aria-label="Main navigation"
      id="main-navigation"
    >
      <div className="nav-container">
        <Link 
          to="/" 
          className="nav-brand" 
          aria-label="Forum Diskusi - Go to homepage"
          {...getLinkProps('/', 'Home')}
        >
          <h1>Forum Diskusi</h1>
        </Link>
        
        <ul className="nav-menu" role="menubar">
          <li role="none">
            <Link 
              to="/" 
              className="nav-link" 
              role="menuitem"
              {...getLinkProps('/', 'Home')}
            >
              Home
            </Link>
          </li>
          <li role="none">
            <Link 
              to="/leaderboard" 
              className="nav-link" 
              role="menuitem"
              {...getLinkProps('/leaderboard', 'Leaderboard')}
            >
              Leaderboard
            </Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li role="none">
                <Link 
                  to="/create-thread" 
                  className="nav-link" 
                  role="menuitem"
                  {...getLinkProps('/create-thread', 'Create Thread')}
                >
                  Buat Thread
                </Link>
              </li>
              <li className="nav-user" role="none">
                <div 
                  className="user-info" 
                  role="group" 
                  aria-label={`User information for ${user?.name}`}
                >
                  <img 
                    src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'} 
                    alt={`Avatar of ${user?.name}`}
                    className="user-avatar"
                    width="32"
                    height="32"
                  />
                  <span 
                    className="user-name" 
                    aria-label={`Logged in as ${user?.name}`}
                  >
                    {user?.name}
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={handleLogout} 
                  className="logout-btn"
                  role="menuitem"
                  aria-label={`Log out ${user?.name}`}
                  aria-describedby="logout-description"
                >
                  Logout
                  <span id="logout-description" className="sr-only">
                    This will log you out and redirect you to the home page
                  </span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li role="none">
                <Link 
                  to="/login" 
                  className="nav-link" 
                  role="menuitem"
                  {...getLinkProps('/login', 'Login')}
                >
                  Login
                </Link>
              </li>
              <li role="none">
                <Link 
                  to="/register" 
                  className="nav-link" 
                  role="menuitem"
                  {...getLinkProps('/register', 'Register')}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
        
        {/* Mobile menu toggle - untuk responsive */}
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label="Toggle mobile menu"
          aria-expanded="false"
          aria-controls="nav-menu"
          style={{ display: 'none' }} // Hidden by default, shown with CSS media query
        >
          <span className="hamburger-line" aria-hidden="true"></span>
          <span className="hamburger-line" aria-hidden="true"></span>
          <span className="hamburger-line" aria-hidden="true"></span>
        </button>
      </div>
    </nav>
  );
}

export default Navigation;