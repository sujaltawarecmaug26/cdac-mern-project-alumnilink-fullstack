
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Box, Typography, Button, Paper } from '@mui/material';

export function RoleRoute({ roles = [], children }) {
  const { user, homePath } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            maxWidth: 450,
            width: '100%',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" color="error" sx={{ fontWeight: 'bold' }}>
            403
          </Typography>

          <Typography variant="h5" sx={{ mt: 1 }}>
            Unauthorized
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 2 }}>
            You do not have access to this page.
          </Typography>

          <Button
            variant="contained"
            href={homePath}
            sx={{ mt: 3 }}
          >
            Go Back
          </Button>
        </Paper>
      </Box>
    );
  }

  return children;
}
