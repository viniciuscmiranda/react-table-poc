export * from './types';

import { cloneDeep, merge } from 'lodash';
import React, {
  createContext,
  forwardRef,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type TableFilterContextProps<Data extends ObjectShape = {}> = {
  filters: FilterContext<Data>;
  setFilters: React.Dispatch<React.SetStateAction<FilterContext>>;
  globalSearch?: string;
  setGlobalSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  filtersRef: React.MutableRefObject<FilterContext>;
};

export const TableFilterContext = createContext({} as TableFilterContextProps);
export const useTableFilter = <D extends ObjectShape = {}>() =>
  useContext<TableFilterContextProps<D>>(TableFilterContext as any);

import { TableComponent as TableComponent, TableComponentProps } from './Table';
import {
  Columns,
  ColumnsArray,
  Filter,
  FilterContext,
  FilterTypes,
  TableRef,
} from './types';
import { getQueryFilters } from './utils';

export type TableProps<Data extends ObjectShape = {}> = Omit<
  TableComponentProps<Data>,
  'columns' | 'filters'
> & {
  columns?: Columns<Data>;
};

const TableInner = <Data extends ObjectShape>(
  { columns: propsColumns, data: propsData, ...props }: TableProps<Data>,
  ref?: TableRef<Data>,
) => {
  const [filters, setFilters] = useState<FilterContext>([]);
  const [globalSearch, setGlobalSearch] = useState<string>();
  const filtersRef = useRef([] as FilterContext);

  const data = useMemo(() => propsData || [], [propsData]);
  const columns = useMemo(
    () =>
      Object.entries(propsColumns || {}).map(([key, value]) => {
        if (typeof value === 'string') return { key, label: value };
        return { key, ...value };
      }) as ColumnsArray,
    [propsColumns],
  );

  useLayoutEffect(() => {
    if (filters?.length) return;

    const filterColumns = columns.filter(({ key, filter }) => Boolean(key && filter));

    const queryFilters = getQueryFilters(filterColumns);

    const nextFilters = filterColumns.map((column) => {
      const key = column.key as string;

      const queryFilter = queryFilters[key] || {};
      const value = props.options?.filters?.[key] ?? undefined;

      // filters can be also assigned as true
      // in this case the type will be set to "text"
      let type: FilterTypes = 'text';
      let ext: FilterTypes[] = [];

      if (column.filter && typeof column.filter !== 'boolean') {
        type = column.filter.type || type;
        ext = column.filter.extends || ext;
      }

      if (value !== undefined) {
        queryFilter.type = (column.filter as Filter).type || queryFilter.type;
      }

      return merge(cloneDeep(column), {
        filter: merge(queryFilter, { extends: [type, ...ext] }, { value }),
      });
    }) as FilterContext;

    filtersRef.current = nextFilters;
    setFilters(nextFilters);
  }, [columns]);

  return (
    <TableFilterContext.Provider
      value={{ filters, filtersRef, setFilters, globalSearch, setGlobalSearch }}
    >
      <TableComponent {...(props as any)} data={data} columns={columns} ref={ref} />
    </TableFilterContext.Provider>
  );
};

export const Table = forwardRef(TableInner);
