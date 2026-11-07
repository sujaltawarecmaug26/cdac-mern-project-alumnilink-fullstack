import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../context/ToastContext.tsx';
import { ROLES } from '../../utils/constants.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(email, password);
      toast.success('Welcome back');
      if (user.role === ROLES.ADMIN) navigate('/admin');
      else if (user.role === ROLES.ALUMNUS) navigate('/alumni');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer className="max-w-md">
      <h1 className="font-display text-3xl">Login</h1>
      <p className="mt-1 text-muted">Sign in to AlumniLink</p>
      <Card className="mt-6 p-5">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </Button>
        </form>
      </Card>
      <p className="mt-4 text-sm text-muted">
        <Link to="/forgot-password" className="text-primary underline">
          Forgot password?
        </Link>
        {' · '}
        <Link to="/register" className="text-primary underline">
          Create account
        </Link>
      </p>
    </PageContainer>
  );
}
