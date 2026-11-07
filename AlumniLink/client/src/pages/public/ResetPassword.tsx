import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { authApi } from '../../api/auth.js';
import { useToast } from '../../context/ToastContext.tsx';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const token = params.get('token') || '';

  return (
    <PageContainer className="max-w-md">
      <h1 className="font-display text-3xl">Reset password</h1>
      <Card className="mt-6 p-5">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await authApi.reset({ token, newPassword: password });
              toast.success('Password updated');
              navigate('/login');
            } catch (err) {
              toast.error(err.response?.data?.message || 'Reset failed');
            }
          }}
        >
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            inputProps={{ minLength: 8 }}
          />
          <Button type="submit" className="w-full">
            Reset password
          </Button>
        </form>
      </Card>
      <Link to="/login" className="mt-4 inline-block text-sm text-primary underline">
        Back to login
      </Link>
    </PageContainer>
  );
}
