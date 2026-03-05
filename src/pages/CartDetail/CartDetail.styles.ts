import styled from '@emotion/styled';

export const Section = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 0;
`;

export const CartSummary = styled.article`
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.text};
`;

export const ProductList = styled.ul`
  flex: 1;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
  align-content: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ProductCard = styled.article`
  border: 2px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

export const ThumbnailWrap = styled.div`
  height: 15rem;
  padding: 0 0 0.5rem 0;
  border-bottom: 2px dashed ${({ theme }) => theme.colors.border};
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ThumbnailFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.border};
  opacity: 0.4;
`;

export const ProductContent = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const QuantityForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const QuantityLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
