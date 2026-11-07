import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { authApi } from '../../api/auth.js';
import { useToast } from '../../context/ToastContext.tsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const toast = useToast();

  return (
    <PageContainer className="max-w-md">
      <h1 className="font-display text-3xl">Forgot password</h1>
      <Card className="mt-6 space-y-3 p-5">
        <p className="text-sm text-muted">For this local demo, the reset link will appear in the backend terminal instead of being sent by email. It expires after 30 minutes.</p>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await authApi.forgot({ email: email.trim() });
              toast.success('If the account exists, copy the reset link from the server terminal.');
            } catch (err) {
              toast.error(err.response?.data?.message || 'Could not start password reset');
            }
          }}
        >
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      </Card>
      <Link to="/login" className="mt-4 inline-block text-sm text-primary underline">
        Back to login
      </Link>
    </PageContainer>
  );
}
