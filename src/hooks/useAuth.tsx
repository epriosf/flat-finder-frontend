import { useContext } from 'react';
import AuthContext from '../contexts/authContext';

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
