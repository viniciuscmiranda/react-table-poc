import { pick } from 'lodash';
import { CellProps, Column, UseTableInstanceProps } from 'react-table';

import {
  ColumnsArray,
  FilterContext,
  FilterObject,
  FilterTypes,
  TableParams,
} from './types';

const FILTER_TYPE_KEY = '_type';

// build columns to react-table format
export function buildColumns<D extends ObjectShape>(
  prevColumns?: ColumnsArray<D>,
  placeholder?: React.ReactNode,
) {
  if (!prevColumns) return [];

  return prevColumns.map((column) => ({
    meta: column,
    Header: column.label,
    accessor: column.key,
    disableSortBy: !(column.canSort ?? true),
    Cell: (props: CellProps<D>) => {
      if (!column.render) {
        return props.value ?? (placeholder || null);
      }

      return column.render?.({
        ...pick(props, ['value', 'row', 'column', 'columns']),
        placeholder,
      });
    },

    // asserting to only assign value if exists
    // this will avoid bugs with the flex layout
    ...(!isNaN(column.width as number) && { width: column.width }),
  })) as Column<D>[];
}

// build params to json-placeholder api format
export function buildParams<D extends ObjectShape = {}>(
  { state }: UseTableInstanceProps<D>,
  columns?: ColumnsArray<D>,
) {
  // params
  const { pageSize, pageIndex, sortBy } = state;

  const [sort] = sortBy;

  let sortKey: string = sort?.id;

  if (sort) {
    const column = columns?.find((column) => column.key === sort.id);
    sortKey = column?.sortKey || sort?.id;
  }

  const params = {
    _limit: pageSize,
    // json-placeholder pages starts at 1
    // while react-table pages starts at 0
    _page: pageIndex + 1,
    _sort: sort ? sortKey : null,
    _order: sort ? (sort.desc ? 'desc' : 'asc') : null,
  } as QueryDefaultParams<D>;

  return params;
}

export function buildFilters<D extends ObjectShape = {}>(columns: FilterContext<D>) {
  return columns?.reduce((acc, curr) => {
    const filter = curr.filter;
    if (filter.value == null || filter.value === '') return acc;

    const key = filter.filterKey || curr.key;
    if (!key) return acc;

    if (!acc) acc = {};

    switch (filter.type) {
      case 'date':
      case 'number':
      case 'select':
      case 'text-exact':
        acc[key] = filter.value;
        break;

      case 'number-greater': {
        const operator: QueryOperators = '_gte';
        acc[`${key}${operator}`] = filter.value;
        break;
      }
      case 'number-lower': {
        const operator: QueryOperators = '_lte';
        acc[`${key}${operator}`] = filter.value;
        break;
      }

      case 'date-between':
      case 'number-between': {
        const operator0: QueryOperators = '_gte';
        const operator1: QueryOperators = '_lte';
        acc[`${key}${operator0}`] = filter.value[0];
        acc[`${key}${operator1}`] = filter.value[1];
        break;
      }

      default:
      case 'text': {
        const operator: QueryOperators = '_like';
        acc[`${key}${operator}`] = filter.value;
        break;
      }
    }

    return acc;
  }, null as any) as FilterObject | null;
}

export function getQuery<D extends ObjectShape = {}>(
  columns: ColumnsArray<D> = [],
): Partial<TableParams<D>> {
  const search = window.location.search;
  const queryParams = new URLSearchParams(search);
  const query: Record<string, string> = {};

  queryParams.forEach((value, key) => (query[key] = value));

  // sort
  let sort: string | undefined;
  if (query.sort) {
    const sortedColumn = columns.find((column) => column.key == query.sort);
    sort = sortedColumn?.sortKey || sortedColumn?.key;
  }

  // desc
  let desc: boolean | undefined;
  if (query.desc) {
    desc = query.desc === 'true';
  }

  return {
    ...query,
    sort,
    desc,
    page: query.page ? Number(query.page) : undefined,
    size: query.size ? Number(query.size) : undefined,
  };
}

export function getQueryFilters<D extends ObjectShape = {}>(columns: ColumnsArray<D>) {
  const search = window.location.search;
  const queryParams = new URLSearchParams(search);
  const filters: Record<string, { value: string; type: FilterTypes }> = {};

  const filtersByKey = columns.reduce((acc, { key, filter }) => {
    if (!key || !filter) return acc;

    acc[key] = (typeof filter === 'boolean' ? 'text' : filter.type) as FilterTypes;
    return acc;
  }, {} as Record<keyof D, FilterTypes>);

  queryParams.forEach((value, key) => {
    if (!(key in filtersByKey)) return;

    const type: FilterTypes =
      (queryParams.get(`${key}${FILTER_TYPE_KEY}`) as FilterTypes) || filtersByKey[key];

    filters[key] = {
      type,
      value: JSON.parse(value),
    };
  });

  return filters;
}

export function setQuery<D extends ObjectShape = {}>(
  { state }: UseTableInstanceProps<D>,
  columns: FilterContext<D>,
  originalColumns: ColumnsArray<D> = [],
) {
  const { pageSize, pageIndex, sortBy } = state;

  const params: Partial<TableParams<D>> = {
    size: pageSize ?? undefined,
    page: pageIndex + 1 ?? undefined,
    sort: sortBy[0]?.id ?? undefined,
    desc: sortBy[0]?.desc ?? undefined,
  };

  const filtersByKey = originalColumns?.reduce((acc, { key, filter }) => {
    if (!key || !filter) return acc;

    acc[key] = (typeof filter === 'boolean' ? 'text' : filter.type) as FilterTypes;
    return acc;
  }, {} as Record<keyof D, FilterTypes>);

  const filters: Record<string, string> = {};

  columns.map((column) => {
    const filter = column.filter;
    const value = filter.value;
    const key = column.key;

    if (!key || value == null || value == '') return;

    filters[key] = JSON.stringify(value);
    if (filter.type && filter.type !== filtersByKey[key]) {
      filters[`${key}${FILTER_TYPE_KEY}`] = filter.type;
    }
  });

  const query = new URLSearchParams(
    Object.entries({ ...params, ...filters }).reduce((acc, [key, value]) => {
      if (value === undefined) return acc;
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>),
  );

  window.history.pushState('', '', `?${query.toString()}`);
}
