import { useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { StatusState } from '@components/ui/StatusState';
import { ArrowLeft, CircleAlert } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <StatusState
      fullPage
      icon={<CircleAlert size={50} />}
      title="404 – Not found"
      description="The page you are looking for does not exist"
      action={
        <Button type="button" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
          <span>Back to Carts</span>
        </Button>
      }
    />
  );
};
