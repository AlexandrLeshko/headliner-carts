import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@emotion/react';
import { ProductCardItem } from './ProductCardItem';
import { theme } from '../../theme';
import type { CartProduct } from '@api/types';

const product: CartProduct = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  quantity: 2,
  total: 59.98,
  discountPercentage: 10,
  discountedTotal: 53.98,
  thumbnail: 'https://example.com/img.jpg',
};

const renderCard = (props?: Partial<Parameters<typeof ProductCardItem>[0]>) =>
  render(
    <ThemeProvider theme={theme}>
      <ProductCardItem
        product={product}
        isPending={false}
        onQuantitySubmit={vi.fn()}
        onRemove={vi.fn()}
        {...props}
      />
    </ThemeProvider>,
  );

describe('ProductCardItem', () => {
  it('renders product title', () => {
    renderCard();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders price', () => {
    renderCard();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('renders discount when > 0', () => {
    renderCard();
    expect(screen.getByText('10.0%')).toBeInTheDocument();
  });

  it('renders image with lazy loading', () => {
    renderCard();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('alt', 'Photo of Test Product');
  });

  it('shows fallback when image fails to load', async () => {
    renderCard();
    const img = screen.getByRole('img');
    await act(() => {
      img.dispatchEvent(new Event('error'));
    });
    expect(screen.getByLabelText('Image unavailable')).toBeInTheDocument();
  });

  it('shows fallback when thumbnail is empty', () => {
    renderCard({ product: { ...product, thumbnail: '' } });
    expect(screen.getByLabelText('Image unavailable')).toBeInTheDocument();
  });

  it('disables buttons when isPending', () => {
    renderCard({ isPending: true });
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('calls onRemove when remove button clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    renderCard({ onRemove });
    await user.click(screen.getByLabelText('Remove Test Product from cart'));
    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('calls onQuantitySubmit when form submitted', async () => {
    const user = userEvent.setup();
    const onQuantitySubmit = vi.fn((_, e) => e.preventDefault());
    renderCard({ onQuantitySubmit });
    await user.click(screen.getByLabelText('Confirm quantity for Test Product'));
    expect(onQuantitySubmit).toHaveBeenCalledWith(1, expect.anything());
  });
});
