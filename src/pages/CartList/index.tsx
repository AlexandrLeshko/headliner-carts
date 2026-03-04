import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCarts } from '../../hooks/useCarts';
import { usePaginationStore } from '../../store';
import { Button } from '@components/ui/Button';
import { DropDown } from '@components/ui/DropDown';
import { Input } from '@components/ui/Input';
import { Label } from '@components/ui/Label';
import { StatusState } from '@components/ui/StatusState';
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
  const { page, limit, userIdFilter, setPage, setLimit, setUserIdFilter, getSkip } =
    usePaginationStore();
  const [filterInput, setFilterInput] = useState(
    () => userIdFilter?.toString() ?? ''
  );
  const skip = getSkip();
  const scrollYRef = useRef(0);
  const { data, isLoading, isError, error, refetch } = useCarts(
    limit,
    skip,
    userIdFilter
  );

  const limitOptions = useMemo(
    () => [
      { value: 5, label: '5' },
      { value: 10, label: '10' },
      { value: 20, label: '20' },
      { value: 50, label: '50' },
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
    return <StatusState title="Loading..." />;
  }

  if (isError) {
    return (
      <StatusState
        icon={<CircleAlert size={50} />}
        title="Error"
        description={error instanceof Error ? error.message : String(error)}
        action={
          <Button type="button" onClick={() => refetch()}>
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
    <Wrapper>
      <Nav>
        <FormLabel>
          Filter by User ID:
          <Input
            type="number"
            min="1"
            placeholder="User ID"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
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
          icon={<SearchAlert size={50} />}
          title="No carts found"
          description="Try different filters"
        />
      ) : (
        <>
          <CartList>
            {data!.carts.map((cart) => (
              <li key={cart.id}>
                <CartLink to={`/carts/${cart.id}`}>
                  <article>
                    <p><Label>ID:</Label> {cart.id}</p>
                    <p><Label>User ID:</Label> {cart.userId}</p>
                    <p><Label>Items:</Label> {cart.totalQuantity}</p>
                    <p><Label>Total:</Label> ${(cart.discountedTotal ?? 0).toFixed(2)}</p>
                  </article>
                  <ArrowUpRight size={24} />
                </CartLink>
              </li>
            ))}
          </CartList>
          {totalPages > 1 && (
            <Pagination>
              <Button
                type="button"
                disabled={!hasPrev}
                onClick={() => handlePageChange(page - 1)}
              >
                <ArrowLeft size={24} />
                <span>Prev</span>
              </Button>
              <PageInfo>
                Page <PageInfoStrong>{page}</PageInfoStrong> of {totalPages}
              </PageInfo>
              <Button
                type="button"
                disabled={!hasNext}
                onClick={() => handlePageChange(page + 1)}
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
