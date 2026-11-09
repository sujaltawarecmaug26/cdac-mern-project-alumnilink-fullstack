
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1152, mx: 'auto', p: 3 }}>
        <Skeleton variant="rectangular" width="33%" height={40} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={160}
          sx={{ mt: 2 }}
        />
      </Box>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
