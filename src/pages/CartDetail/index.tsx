import { useParams } from 'react-router-dom';

export const CartDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  return <div>Cart {id} — coming soon</div>;
};
