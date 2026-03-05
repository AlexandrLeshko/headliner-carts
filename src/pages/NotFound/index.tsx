import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button, StatusState } from '@components/ui';
import { ArrowLeft, CircleAlert } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet><title>404 — Page not found</title></Helmet>
      <StatusState
        fullPage
        icon={<CircleAlert size={24} />}
        title="404 – Not found"
        description="The page you are looking for does not exist"
        action={
          <Button type="button" onClick={() => navigate('/')} aria-label="Go back to carts list">
            <ArrowLeft size={24} />
            <span>Back to Carts</span>
          </Button>
        }
      />
    </>
  );
};
