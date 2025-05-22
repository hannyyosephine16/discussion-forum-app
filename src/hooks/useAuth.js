import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getOwnProfile } from '../store/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // If we have a token but no user data, try to get the profile
    if (token && !user && !loading) {
      dispatch(getOwnProfile());
    }
  }, [dispatch, token, user, loading]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
  };
};

export default useAuth;