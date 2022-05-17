/* eslint-disable react/jsx-key */
import { isEqual, merge, uniqueId } from 'lodash';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  TableOptions as ReactTableOptions,
  useFlexLayout,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';

import { Filters } from './Filters';
import { useCustomRowSelect } from './hooks';
import { useTableFilter } from './index';
import { Pagination, PaginationProps } from './Pagination';
import {
  CellContent,
  Container,
  Placeholder,
  TableBody,
  TableContainer,
  TableData,
  TableDataContent,
  TableElement,
  TableHead,
  TableHeader,
  TableHeaderContent,
  TableRow,
} from './styles';
import {
  ColumnsArray,
  TableActions,
  TableOptions,
  TableRef,
  TableRefProps,
} from './types';
import { buildColumns, buildFilters, buildParams, getQuery, setQuery } from './utils';

const DEFAULT_ROW_ID = 'id';
const DEFAULT_GLOBAL_SEARCH_KEY = 'q';

export type TableComponentProps<Data extends ObjectShape = {}> = {
  data?: Data[];
  columns?: ColumnsArray<Data>;
  total?: number;
  loading?: boolean;
  select?: keyof Data | boolean;
  onChange?: (params: QueryParams<Data>, action: TableActions) => void | Promise<void>;
  options?: TableOptions<Data>;
  children?: ChildrenAsFunction<[TableRefProps<Data>]>;
  query?: boolean;
  showTotal?: PaginationProps['showTotal'];
  search?: boolean | string;

  // components
  placeholder?: React.ReactNode;
  noDataComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
};

const TableComponentInner = <Data extends ObjectShape>(
  {
    data = [],
    columns: propsColumns,
    loading = false,
    select = false,
    query = true,
    total = 0,
    search = false,
    placeholder = '-',
    onChange,
    showTotal,
    children,
    options: propsOptions,

    noDataComponent = 'No data',
    loadingComponent = 'Loading...',
  }: TableComponentProps<Data>,
  ref?: TableRef<Data>,
) => {
  const { filters, globalSearch, filtersRef } = useTableFilter<Data>();

  const [selectedRows, setSelectedRows] = useState<Data[]>([]);
  const [size, setSize] = useState(1);
  const [action, setAction] = useState<TableActions>('init');

  const tableOptions = useMemo(() => {
    const defaultOptions = {
      page: 1,
      rows: [5, 10, 25],
    } as Required<TableOptions<Data>>;

    const queryOptions = query ? getQuery<Data>(propsColumns) : {};

    const opt = merge(defaultOptions, queryOptions, propsOptions);
    // setting default size to first row option
    opt.size = opt.size || opt.rows[0];

    return opt;
  }, [propsOptions]);

  // default options
  const options = useMemo(() => {
    const defaultOptions = {
      // building columns in to react-table format
      columns: buildColumns(propsColumns, placeholder),
      // calculates page count based on total items
      pageCount: Math.floor(total / size),
      // other settings
      data,
      manualPagination: true,
      manualSortBy: true,
      autoResetPage: true,
      autoResetSortBy: false,
      autoResetSelectedRows: false,
      disableMultiSort: true,
      disableSortBy: tableOptions.disableSort,
      defaultColumn: {
        // with flex layout this sets flex-grow to 50
        width: 50,
      },
      // tries to set "id" property as the default row identifier
      // this can be customized by setting select to a string (select="myId")
      getRowId: (row, rowIndex) => {
        if (typeof select === 'boolean') {
          if (DEFAULT_ROW_ID in row) return row[DEFAULT_ROW_ID];
          return rowIndex;
        }

        if (select in row) return row[select];
        return rowIndex;
      },
      // default options
      initialState: {
        pageIndex: tableOptions.page - 1,
        pageSize: tableOptions.size,
        selectedRowIds:
          // parses [ 1, 2 ] to { 1: true, 2: true }
          tableOptions.selected?.reduce(
            (acc, curr) => ({ ...acc, [curr]: true }),
            {} as any,
          ) || {},
        hiddenColumns: tableOptions.hidden || [],
        sortBy: tableOptions.sort
          ? [
              {
                id: tableOptions.sort,
                desc: tableOptions.desc,
              },
            ]
          : [],
      },
    } as ReactTableOptions<Data>;

    return merge(defaultOptions, {});
  }, [data, propsColumns, placeholder, select, total, tableOptions]);

  // table constructor and hooks
  const state = useTable<Data>(
    options,
    useSortBy,
    usePagination,
    useFlexLayout,
    useRowSelect,
    (hooks) => useCustomRowSelect(hooks, tableOptions),
  );

  // destructuring state
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    selectedFlatRows,
    state: { pageSize, pageIndex, sortBy },
  } = state;

  // build table ref data
  const tableRef = useMemo<TableRefProps<Data>>(
    () => ({
      data,
      columns: propsColumns || [],
      selected: selectedRows,
      refresh: () => setAction('refresh'),
      page: pageIndex + 1,
      size: pageSize,
      desc: sortBy[0]?.desc,
      sort: sortBy[0]?.id,
      filters:
        filters?.reduce((acc, curr) => {
          const key = curr.key as string;
          const value = curr.filter.value;
          if (!value || !key) return acc;
          acc[key] = value;
          return acc;
        }, {} as any) || [],
    }),
    [data, propsColumns, selectedRows, pageIndex, pageSize, sortBy],
  );

  // setting ref as state
  useImperativeHandle<TableRefProps<Data>, TableRefProps<Data>>(ref, () => tableRef, [
    tableRef,
  ]);

  // tracking page size for total pages calculation
  useEffect(() => setSize(pageSize), [pageSize]);

  // building filters
  const filterParams = useMemo(() => buildFilters(filters), [filters]);

  // building global search
  const searchField = useMemo(() => {
    const key = typeof search === 'string' ? search : DEFAULT_GLOBAL_SEARCH_KEY;
    return { [key]: globalSearch };
  }, [globalSearch]);

  // apply filters
  useEffect(() => {
    if (action !== 'init') setAction('filter');
    else setAction('init');
  }, [filterParams]);

  // tracking global search
  useEffect(() => {
    if (action !== 'init') setAction('search');
  }, [searchField]);

  // triggering on change event
  useEffect(() => {
    if (action == null) return;

    // the ref was created because of the event order in React
    // this will ensure that the query filter values will be available
    // as soon as the table initializes
    if (action === 'init') {
      if (!isEqual(buildFilters(filtersRef.current), filterParams)) {
        setAction(null);
        return;
      }
    }

    // storing values in query
    if (query) setQuery<Data>(state, filters, propsColumns);

    // dispatching params
    onChange?.(
      { ...buildParams<Data>(state, propsColumns), ...filterParams, ...searchField },
      action,
    );

    // resets action
    setAction(null);
  }, [action]);

  // store selected row in state
  useEffect(() => {
    if (!select) return;

    const idKey = typeof select === 'boolean' ? DEFAULT_ROW_ID : select;

    setSelectedRows((prevSelectedRows) => [
      // removes items from current page
      ...prevSelectedRows.filter((row) => !page.find((item) => item.id === row[idKey])),
      // adds current page selected items
      ...selectedFlatRows.map(({ original }) => original),
    ]);
  }, [selectedFlatRows]);

  // render table
  return (
    <Container>
      {/* filters */}
      {Boolean(filters?.length) && (
        <Filters
          search={Boolean(search)}
          actions={typeof children === 'function' ? children(tableRef) : children}
        />
      )}

      {/* table */}
      <TableContainer>
        {Boolean(!loading && data?.length) && (
          <TableElement {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup, headerGroupIndex) => {
                // rendering header groups (not supported)
                return (
                  <TableRow {...headerGroup.getHeaderGroupProps()} header>
                    {headerGroup.headers.map((column, columnIndex) => {
                      const checkbox = Boolean(
                        select &&
                          columnIndex === 0 &&
                          headerGroupIndex === headerGroups.length - 1,
                      );

                      // rendering columns
                      return (
                        <TableHeader
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          title=""
                          checkbox={checkbox}
                          disabled={!column.canSort}
                          onClick={(...args) => {
                            if (!column.canSort) return;

                            column.getSortByToggleProps().onClick?.(...args);
                            setAction('sort');
                          }}
                        >
                          <TableHeaderContent>
                            <CellContent>{column.render('Header')}</CellContent>

                            {column.isSorted && (
                              <span>{column.isSortedDesc ? ' 🔽' : ' 🔼'}</span>
                            )}
                          </TableHeaderContent>
                        </TableHeader>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableHead>

            <TableBody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);

                // rendering rows
                return (
                  <TableRow {...row.getRowProps()} selected={row.isSelected}>
                    {row.cells.map((cell, cellIndex) => {
                      const checkbox = Boolean(select && cellIndex === 0);

                      // rendering cells
                      return (
                        <React.Fragment key={uniqueId()}>
                          <TableData {...cell.getCellProps()} checkbox={checkbox}>
                            <TableDataContent>
                              <CellContent wrap={tableOptions.wrapCells}>
                                {cell.render('Cell')}
                              </CellContent>
                            </TableDataContent>
                          </TableData>
                        </React.Fragment>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </TableElement>
        )}

        <Placeholder enabled={loading || !data.length}>
          {loading ? loadingComponent : !data.length && noDataComponent}
        </Placeholder>
      </TableContainer>

      {/* pagination */}
      {tableOptions.controllers !== false && (
        <Pagination
          total={total}
          pageIndex={pageIndex}
          pageSize={pageSize}
          showTotal={showTotal}
          selected={selectedRows?.length}
          rows={tableOptions.rows}
          setPageSize={(pageSize) => {
            setPageSize(pageSize);
            setAction('size');
          }}
          setPage={(page) => {
            gotoPage(page);
            setAction('page');
          }}
        />
      )}
    </Container>
  );
};

export const TableComponent = forwardRef(TableComponentInner);
