import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import useAuth from '../../hooks/useAuth';

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <h1>Forum Diskusi</h1>
        </Link>
        
        <ul className="nav-menu">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/leaderboard" className="nav-link">Leaderboard</Link></li>
          
          {isAuthenticated ? (
            <>
              <li><Link to="/create-thread" className="nav-link">Buat Thread</Link></li>
              <li className="nav-user">
                <div className="user-info">
                  <img 
                    src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'} 
                    alt={user?.name} 
                    className="user-avatar"
                  />
                  <span className="user-name">{user?.name}</span>
                </div>
                <button 
                  type="button" 
                  onClick={handleLogout} 
                  className="logout-btn"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-link">Login</Link></li>
              <li><Link to="/register" className="nav-link">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;