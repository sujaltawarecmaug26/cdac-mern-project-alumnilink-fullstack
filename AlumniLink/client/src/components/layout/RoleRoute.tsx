import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export function RoleRoute({ roles = [], children }) {
  const { user, homePath } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <h1 className="font-display text-2xl text-primary">Unauthorised</h1>
        <p className="mt-2 text-muted">You do not have access to this page.</p>
        <a href={homePath} className="mt-4 inline-block text-primary underline">
          Go back
        </a>
      </div>
    );
  }
  return children;
}
