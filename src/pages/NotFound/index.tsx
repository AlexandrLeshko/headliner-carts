import { Wrapper } from './NotFound.styles';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <Wrapper>
    <h1>404 — Page not found</h1>
    <Link to="/">Back to Carts</Link>
  </Wrapper>
);
