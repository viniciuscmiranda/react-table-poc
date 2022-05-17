import { Modal } from 'components/Modal';
import { debounce, merge } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useTableFilter } from '../index';
import { ColumnsArray, Filter, FilterContext, FilterObject, FilterTypes } from '../types';
import {
  Button,
  FilterButton,
  FiltersContainer,
  HeaderContainer,
  Input,
  Select,
} from './styles';

export type FilterProps<Data extends ObjectShape = {}> = {
  columns?: ColumnsArray<Data>;
  initial?: FilterObject<Data>;
  actions?: React.ReactNode;
  search?: boolean;
  onFilter?: (filters: FilterContext<Data>) => void | Promise<void>;
};

export const Filters = <Data extends ObjectShape>({
  columns = [],
  initial,
  actions,
  search,
  onFilter,
}: FilterProps<Data>) => {
  const { filters = columns, setFilters, setGlobalSearch } = useTableFilter() || {};

  // dispatch filter value
  const handleFilter = useCallback(
    (key: string, value: any, operator?: FilterTypes) => {
      if (!key) return;
      setFilters((prevFilters) => {
        const nextFilters = prevFilters.map((column) => {
          if (column.key === key)
            return merge(column, {
              filter: { value, type: operator || column.filter.type },
            });
          return column;
        });

        onFilter?.(nextFilters as FilterContext<Data>);
        return nextFilters;
      });
    },
    [onFilter, setFilters],
  );

  const clearFilters = useCallback(() => {
    setFilters((prevFilters) => {
      const nextFilters = prevFilters.map((column) => {
        delete column.filter.value;
        return column;
      });

      onFilter?.(nextFilters as FilterContext<Data>);
      return nextFilters;
    });
  }, [onFilter, setFilters]);

  // set initial filters
  useEffect(() => {
    if (!initial) return;

    setFilters((prevFilters) =>
      prevFilters.map((column) => {
        if (column.key && column.key in initial) {
          const value = initial[column.key];
          return merge(column, { filter: { value } });
        }

        return column;
      }),
    );
  }, [initial]);

  return (
    <>
      {/* Filters */}
      <div>
        <p>
          {JSON.stringify(
            filters
              .map((col: any) => col.filter?.value && { [col.key]: col.filter.value })
              .filter(Boolean),
          )}
        </p>
        <br />
      </div>

      <HeaderContainer>
        <Modal trigger={<FilterButton>Filters</FilterButton>}>
          <strong>Filters</strong>

          <FiltersContainer>
            {filters.map((column) => {
              const key = column.key as string;
              const filter = column.filter as Filter;

              switch (filter.type) {
                default:
                case 'text':
                case 'text-exact':
                  return (
                    <TextFilter
                      {...(column as any)}
                      onFilter={(value, type) => handleFilter(key, value, type)}
                    />
                  );

                case 'select':
                  return (
                    <SelectFilter
                      {...(column as any)}
                      onFilter={(value) => handleFilter(key, value)}
                    />
                  );

                case 'number':
                case 'number-between':
                case 'number-greater':
                case 'number-lower':
                  return (
                    <NumberFilter
                      {...(column as any)}
                      onFilter={(value, type) => handleFilter(key, value, type)}
                    />
                  );
              }
            })}

            <Button onClick={() => clearFilters()}>Clear</Button>
          </FiltersContainer>
        </Modal>

        {search && (
          <Input
            placeholder="Search"
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;

              const value = (e.target as HTMLInputElement).value;
              setGlobalSearch(value || undefined);
            }}
          />
        )}

        {actions}
      </HeaderContainer>
    </>
  );
};

export type FilterFieldProps<DataType = any> = ColumnsArray[number] & {
  onFilter: (filter?: DataType, type?: FilterTypes) => void | Promise<void>;
  filter: FilterContext[number]['filter'];
};

const TextFilter: React.FC<FilterFieldProps<string>> = ({ label, filter, onFilter }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const options = useMemo(() => {
    const defaultOptions = ['text', 'text-exact'] as FilterTypes[];

    return defaultOptions.filter(
      (type) => filter.extends?.includes(type) || type == filter.type,
    );
  }, [filter]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = filter.value || '';
  }, [filter.value]);

  return (
    <div>
      {options?.length > 1 && (
        <Select
          defaultValue={filter?.type}
          onChange={(e) => {
            const value = e.target.value as FilterTypes;

            onFilter(inputRef.current?.value, value);
          }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      )}

      <Input
        type="text"
        placeholder={label}
        ref={inputRef}
        onKeyPress={(e) => {
          if (e.key !== 'Enter') return;
          onFilter((e.target as HTMLInputElement).value);
        }}
      />
    </div>
  );
};

const NumberFilter: React.FC<FilterFieldProps<number | number[] | ''>> = ({
  label,
  onFilter,
  filter,
}) => {
  const options = useMemo(() => {
    const defaultOptions = [
      'number',
      'number-greater',
      'number-lower',
      'number-between',
    ] as FilterTypes[];

    return defaultOptions.filter(
      (type) => filter.extends?.includes(type) || type == filter.type,
    );
  }, [filter]);

  const inputRef0 = useRef<HTMLInputElement>(null);
  const inputRef1 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef0.current) return;
    inputRef0.current.value = filter.value?.[0] || filter.value || '';

    if (!inputRef1.current) return;
    inputRef1.current.value = filter.value?.[1] || '';
  }, [filter.value]);

  function getValue(type = filter.type) {
    const value0 = inputRef0.current?.value;
    if (!value0) return '';

    const value1 = inputRef1.current?.value;
    if (!value1 && type === 'number-between') return '';

    const value =
      type === 'number-between' ? [Number(value0), Number(value1)] : Number(value0);

    return value;
  }

  function handleFilter(e: React.KeyboardEvent) {
    if (e.key !== 'Enter') return;
    onFilter(getValue());
  }

  return (
    <div>
      {options?.length > 1 && (
        <Select
          defaultValue={filter.type}
          onChange={(e) => {
            const value = e.target.value as FilterTypes;
            onFilter(getValue(value), value);
          }}
        >
          {options.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </Select>
      )}
      <Input
        type="number"
        ref={inputRef0}
        placeholder={label}
        onKeyPress={handleFilter}
      />
      {filter.type === 'number-between' && (
        <Input
          type="number"
          ref={inputRef1}
          placeholder={label}
          onKeyPress={handleFilter}
        />
      )}
    </div>
  );
};

const SelectFilter: React.FC<FilterFieldProps<string>> = ({
  label,
  filter,
  onFilter,
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(
    Array.isArray(filter.options) ? filter.options : [],
  );

  const onChangeInput = debounce(async (text) => {
    if (typeof filter.options !== 'function' || !filter.options) return setLoading(false);

    const res = await filter.options(text);
    setOptions(res || []);
    setLoading(false);
  }, 1000);

  useEffect(() => {
    if (!selectRef.current) return;
    selectRef.current.value = filter.value || '';
  }, [filter.value]);

  return (
    <div>
      {typeof filter.options === 'function' && (
        <Input
          onChange={(e) => {
            setLoading(true);
            onChangeInput(e.target.value);
          }}
          placeholder={label}
        />
      )}

      <Select
        main
        ref={selectRef}
        placeholder={label}
        onChange={(e) => onFilter(e.target.value)}
      >
        <option value="">
          Select {label}
          {loading ? '...' : ''}
        </option>

        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label ?? option.value}
          </option>
        ))}
      </Select>
    </div>
  );
};
