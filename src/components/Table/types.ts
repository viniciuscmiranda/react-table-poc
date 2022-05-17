import { CellProps } from 'react-table';

export type FilterObject<Data extends ObjectShape = {}, Values = any> = Partial<
  Record<keyof Data, Values>
>;

export type TableParams<Data extends ObjectShape = {}> = {
  filters?: FilterObject<Data>;
  sort?: LiteralUnion<keyof Data & string>;
  desc?: boolean;
  page: number;
  size: number;
};

export type TableRef<Data extends ObjectShape = {}> = React.Ref<TableRefProps<Data>>;
export type TableRefProps<Data extends ObjectShape = {}> = {
  data: Data[];
  selected: Data[];
  columns: ColumnsArray<Data>;
  refresh: () => void;
} & TableParams<Data>;

export type FilterOption = ObjectShape & {
  label?: string;
  value?: QueryValue;
};

export type FilterAsyncOptions = (value?: string) => Promise<Optional<FilterOption[]>>;

export type FilterTypes =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'date-between'
  | 'number-between'
  | 'number-lower'
  | 'number-greater'
  | 'text-exact';

export type Filter = {
  filterKey?: string;
  enabled?: boolean;
  options?: FilterOption[] | FilterAsyncOptions;
  type?: FilterTypes;
  extends?: FilterTypes[];
};

export type RenderCellProps<Data extends ObjectShape = {}, Value = never> = Pick<
  CellProps<Data>,
  'row' | 'column' | 'columns'
> & { value: Value; placeholder?: React.ReactNode };

export type ColumnData<Data extends ObjectShape = {}, Value = never> = {
  label?: string;
  canSort?: boolean;
  sortKey?: string;
  filter?: boolean | Filter;
  width?: number;
  render?: (props: RenderCellProps<Data, Value>) => React.ReactNode;
};

export type Column<Data extends ObjectShape = {}, Value = undefined> =
  | string
  | ColumnData<Data, Value>;

export type Columns<Data extends ObjectShape = {}> = {
  [K in LiteralUnion<keyof Data & string>]?: Column<
    Data,
    K extends keyof Data ? Data[K] : never
  >;
};

export type ColumnsArray<Data extends ObjectShape = {}> = Array<
  {
    key?: LiteralUnion<keyof Data & string>;
  } & ColumnData<Data, Data[string]>
>;

export type TableActions =
  | 'init'
  | 'sort'
  | 'page'
  | 'size'
  | 'filter'
  | 'search'
  | 'refresh'
  | null;

export type TableOptions<Data extends ObjectShape = {}> = {
  // state options
  page?: number;
  sort?: keyof Data;
  desc?: boolean;
  size?: number;
  filters?: FilterObject<Data>;
  selected?: Identifier[];
  hidden?: LiteralUnion<keyof Data & string>[];

  // other options
  wrapCells?: boolean;
  disableSort?: boolean;
  rows?: number[];
  controllers?: boolean;
  disabledSelectIds?: Identifier[];
};

export type FilterContext<Data extends ObjectShape = {}> = Array<
  ColumnData<Data> & {
    key?: LiteralUnion<keyof Data & string>;
    filter: Filter & { value?: any };
  }
>;
