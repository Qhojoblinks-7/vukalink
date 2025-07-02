// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice'; // Import logout action

export const useAuth = () => {
  const dispatch = useDispatch();
  // Destructure directly from the auth slice state
  const { user, isAuthenticated, status, role, error } = useSelector((state) => state.auth);

  const loading = status === 'loading';

  // The getCurrentUser dispatch is now primarily handled in App.jsx's useEffect
  // This hook focuses on providing the current auth state and actions.

  // Expose logout function directly from the hook for convenience
  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user: user, // This 'user' object now includes the 'profile' and thus 'profile.role'
    isAuthenticated,
    loading,
    error,
    role: role, // Explicitly return the role from the state
    handleLogout,
  };
};