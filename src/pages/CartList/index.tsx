import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCarts } from '@hooks/useCarts';
import { usePrefetchCart } from '@hooks/usePrefetchCart';
import { usePaginationStore, selectSkip } from '@store/paginationStore';
import { Button, DropDown, Input, Label, StatusState } from '@components/ui';
import {
  Wrapper,
  Nav,
  FormLabel,
  CartList,
  CartLink,
  Pagination,
  PageInfo,
  PageInfoStrong,
} from './CartList.styles';
import { ArrowLeft, ArrowRight, ArrowUpRight, CircleAlert, RotateCw, SearchAlert } from 'lucide-react';

export const CartListPage = () => {
  const { page, limit, userIdFilter, setPage, setLimit, setUserIdFilter } =
    usePaginationStore();
  const skip = usePaginationStore(selectSkip);
  const [filterInput, setFilterInput] = useState(
    () => userIdFilter?.toString() ?? ''
  );
  const scrollYRef = useRef(0);
  const { data, isLoading, isPlaceholderData, isError, error, refetch } = useCarts(
    limit,
    skip,
    userIdFilter
  );
  const prefetchCart = usePrefetchCart();

  const limitOptions = useMemo(
    () => [
      { value: 6, label: '6' },
      { value: 12, label: '12' },
      { value: 24, label: '24' },
      { value: 48, label: '48' },
    ],
    []
  );

  useEffect(() => {
    if (data?.carts) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollYRef.current, behavior: 'instant' });
      });
    }
  }, [page, data?.carts]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      scrollYRef.current = window.scrollY;
      setPage(newPage);
    },
    [setPage]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const val = filterInput.trim();
      if (val === '') {
        setUserIdFilter(null);
        return;
      }
      const num = Number(val);
      if (Number.isNaN(num) || num < 1) {
        setUserIdFilter(null);
        return;
      }
      setUserIdFilter(num);
    }, 500);
    return () => clearTimeout(timer);
  }, [filterInput, setUserIdFilter]);

  if (isLoading) {
    return (
      <StatusState
        title="Loading..."
        aria-live="polite"
        aria-busy
      />
    );
  }

  if (isError) {
    return (
      <StatusState
        icon={<CircleAlert size={24} />}
        title="Error"
        description={error instanceof Error ? error.message : String(error)}
        action={
          <Button type="button" onClick={() => refetch()} aria-label="Retry loading carts">
            <RotateCw size={24} />
            <span>Retry</span>
          </Button>
        }
      />
    );
  }

  const totalPages = Math.ceil((data?.total ?? 0) / limit);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const isEmpty = !data?.carts?.length;

  return (
    <Wrapper $faded={isPlaceholderData}>
      <Helmet>
        <title>
          {userIdFilter
            ? `Carts for User ${userIdFilter} — Page ${page}`
            : `Shopping Carts — Page ${page}`}
        </title>
      </Helmet>

      <h1 className="sr-only">Shopping Carts</h1>

      <Nav aria-label="Cart filters">
        <FormLabel>
          Filter by User ID:
          <Input
            type="number"
            min="1"
            placeholder="User ID"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            aria-label="Filter carts by user ID"
          />
        </FormLabel>
        <FormLabel>
          Per page:
          <DropDown
            value={limit}
            options={limitOptions}
            onChange={setLimit}
          />
        </FormLabel>
      </Nav>

      {isEmpty ? (
        <StatusState
          icon={<SearchAlert size={24} />}
          title="No carts found"
          description="Try different filters"
        />
      ) : (
        <>
          <CartList aria-label="Cart list">
            {data!.carts.map((cart) => (
              <li key={cart.id}>
                <CartLink
                  to={`/carts/${cart.id}`}
                  aria-label={`View cart ${cart.id}`}
                  onMouseEnter={() => prefetchCart(cart.id)}
                  onFocus={() => prefetchCart(cart.id)}
                >
                  <article>
                    <p><Label>ID:</Label> {cart.id}</p>
                    <p><Label>User ID:</Label> {cart.userId}</p>
                    <p><Label>Items:</Label> {cart.totalQuantity}</p>
                    <p><Label>Total:</Label> ${(cart.discountedTotal ?? 0).toFixed(2)}</p>
                  </article>
                  <ArrowUpRight size={24} aria-hidden="true" />
                </CartLink>
              </li>
            ))}
          </CartList>
          {totalPages > 1 && (
            <Pagination role="navigation" aria-label="Pagination">
              <Button
                type="button"
                disabled={!hasPrev}
                onClick={() => handlePageChange(page - 1)}
                aria-label="Previous page"
              >
                <ArrowLeft size={24} />
                <span>Prev</span>
              </Button>
              <PageInfo aria-live="polite" aria-atomic="true">
                Page <PageInfoStrong>{page}</PageInfoStrong> of {totalPages}
              </PageInfo>
              <Button
                type="button"
                disabled={!hasNext}
                onClick={() => handlePageChange(page + 1)}
                aria-label="Next page"
              >
                <span>Next</span>
                <ArrowRight size={24} />
              </Button>
            </Pagination>
          )}
        </>
      )}
    </Wrapper>
  );
};
