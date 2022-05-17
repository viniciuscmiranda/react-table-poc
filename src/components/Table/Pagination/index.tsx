import React, { useMemo } from 'react';

import {
  PageButton,
  PageControl,
  PageLabel,
  PageSizeSelect,
  PaginationContainer,
} from './styles';

export type PaginationProps = {
  rows?: number[];
  total: number;
  selected?: number;
  setPage?: (nextPage: number) => void;
  setPageSize?: (pageSize: number) => void;
  pageSize: number;
  pageIndex: number;

  absoluteControllers?: boolean;
  showPageTotal?: boolean;
  showTotal?: (props: { total?: number; selected?: number }) => React.ReactNode;
};

export const Pagination: React.FC<PaginationProps> = ({
  rows = [5, 10, 20],
  total,
  selected,
  setPage,
  setPageSize,
  pageSize,
  pageIndex,
  absoluteControllers,
  showPageTotal,
  showTotal = (props) => <PaginationTotal {...props} />,
}) => {
  const pageTotal = useMemo(() => Math.floor(total / pageSize), [total, pageSize]);

  return (
    <PaginationContainer>
      <span>{showTotal({ total, selected })}</span>

      <div>
        <PageSizeSelect
          value={pageSize}
          onChange={(e) => {
            setPageSize?.(Number(e.target.value));
          }}
        >
          {rows.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </PageSizeSelect>

        {total > 0 && (
          <PageControl>
            {absoluteControllers && (
              <PageButton disabled={pageIndex <= 0} onClick={() => setPage?.(0)}>
                {'<<'}
              </PageButton>
            )}

            <PageButton
              disabled={pageIndex <= 0}
              onClick={() => setPage?.(pageIndex - 1)}
            >
              {'<'}
            </PageButton>
            <PageLabel>
              {pageIndex + 1} {showPageTotal && `of ${pageTotal}`}
            </PageLabel>
            <PageButton
              disabled={pageIndex >= pageTotal - 1}
              onClick={() => setPage?.(pageIndex + 1)}
            >
              {'>'}
            </PageButton>

            {absoluteControllers && (
              <PageButton
                disabled={pageIndex >= pageTotal - 1}
                onClick={() => setPage?.(pageTotal - 1)}
              >
                {'>>'}
              </PageButton>
            )}
          </PageControl>
        )}
      </div>
    </PaginationContainer>
  );
};

export type PaginationTotalProps = {
  total?: number;
  selected?: number;
  itemsLabel?: string;
  selectedLabel?: string;
};

export const PaginationTotal: React.FC<PaginationTotalProps> = ({
  total,
  selected,
  itemsLabel = 'items',
  selectedLabel = 'selected',
}) => {
  const selectedText = selected ? ` (${selected} ${selectedLabel})` : '';
  const totalText = total ? `${total} ${itemsLabel}` : '';

  return (
    <span>
      {totalText}
      <i>{selectedText}</i>
    </span>
  );
};
