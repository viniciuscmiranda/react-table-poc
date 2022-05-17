import { ColumnsArray } from 'components/Table/types';

export {};

declare module 'react-table' {
  export interface TableOptions<D extends object = {}>
    extends UsePaginationOptions<D>,
      UseSortByOptions<D>,
      UseRowSelectOptions<D>,
      Record<string, any> {}
  //  UseFiltersOptions<D>
  //  UseRowStateOptions<D>
  //  UseExpandedOptions<D>
  //  UseGlobalFiltersOptions<D>
  //  UseGroupByOptions<D>
  //  UseResizeColumnsOptions<D>

  export interface Hooks<D extends object = {}>
    extends UseSortByHooks<D>,
      UseRowSelectHooks<D> {}
  //  UseExpandedHooks<D>
  //  UseGroupByHooks<D>

  export interface TableInstance<D extends object = {}>
    extends UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseSortByInstanceProps<D> {}
  //  UseFiltersInstanceProps<D>
  //  UseColumnOrderInstanceProps<D>
  //  UseExpandedInstanceProps<D>
  //  UseGlobalFiltersInstanceProps<D>
  //  UseGroupByInstanceProps<D>
  //  UseRowStateInstanceProps<D>

  export interface TableState<D extends object = {}>
    extends UsePaginationState<D>,
      UseRowSelectState<D>,
      UseSortByState<D> {}
  //  UseFiltersState<D>
  //  UseColumnOrderState<D>
  //  UseExpandedState<D>
  //  UseGlobalFiltersState<D>
  //  UseGroupByState<D>
  //  UseResizeColumnsState<D>
  //  UseRowStateState<D>

  export interface ColumnInterface<D extends object = {}>
    extends UseSortByColumnOptions<D> {}
  //  UseFiltersColumnOptions<D>
  //  UseGlobalFiltersColumnOptions<D>
  //  UseGroupByColumnOptions<D>
  //  UseResizeColumnsColumnOptions<D>

  export interface ColumnInstance<D extends object = {}>
    extends UseSortByColumnProps<D> {}
  //  UseFiltersColumnProps<D>
  //  UseGroupByColumnProps<D>
  //  UseResizeColumnsColumnProps<D>

  export interface Cell<D extends object = {}, V = any> {}
  //  UseGroupByCellProps<D>
  //  UseRowStateCellProps<D>

  export interface Row<D extends object = {}> extends UseRowSelectRowProps<D> {}
  //  UseExpandedRowProps<D>
  //  UseGroupByRowProps<D>
  //  UseRowStateRowProps<D>
}
