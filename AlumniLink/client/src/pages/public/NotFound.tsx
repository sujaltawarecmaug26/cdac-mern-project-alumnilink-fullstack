import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Button } from '../../components/ui/Button.tsx';

export default function NotFound() {
  return (
    <PageContainer className="text-center">
      <h1 className="font-display text-4xl text-primary">404</h1>
      <p className="mt-2 text-muted">This page does not exist.</p>
      <Link to="/">
        <Button className="mt-4">Go home</Button>
      </Link>
    </PageContainer>
  );
}
