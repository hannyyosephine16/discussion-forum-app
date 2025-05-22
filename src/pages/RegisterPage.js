import { Link, Navigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import useAuth from '../hooks/useAuth';

function RegisterPage() {
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <RegisterForm />
        <div className="auth-links">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;