import { AxiosError, AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { UseQueryOptions, UseQueryResult } from 'react-query';

export {};

declare global {
  // data types
  type Identifier = string | number;
  type ApiError<T = any> = AxiosError<T>;

  // utilities
  type CreateModelData<Model> = Omit<Model, 'id'>;
  type UpdateModelData<Model> = Partial<CreateModelData<Model>>;

  type Nullable<T> = { [K in keyof T]?: Nullable<T[K]> | null };
  type Optional<T = undefined> = T | undefined;
  type ObjectShape<T = any> = Record<string, T>;
  type LiteralUnion<T extends U, U = string> = T | (U & {});
  type Many<T> = T | T[];
  type ChildrenAsFunction<T extends any[]> =
    | React.ReactNode
    | ((...args: T) => React.ReactNode);

  // queries
  type QueryValue = string | number;

  type QueryDefaultParams<Model = never> = Partial<{
    q: string;
    _page: number;
    _limit: number;
    _sort: Model extends never ? string : keyof Model;
    _order: 'asc' | 'desc';
  }>;

  type QueryOperators = '_like' | '_lte' | '_gte' | '_ne';

  type QueryParams<Model> = Nullable<
    QueryDefaultParams<Model> &
      Record<keyof Model, QueryValue> &
      ModelQueryOperators<Model>
  >;

  type QueryOptions<Model> = Omit<UseQueryOptions<Model>, 'queryKey' | 'queryFn'>;

  // models
  type ModelQueryOperators<
    Model,
    Operators extends QueryOperators = QueryOperators,
  > = Record<`${string & keyof Model}${Operators}`, QueryValue>;

  type ModelMeta<Model> = AxiosResponse<Model>;

  type ModelHelpers<Model, Params> = UseQueryResult<Model> & {
    meta?: ModelMeta<Model>;
    params?: Params;
  };

  type UseModelsHook<Model, Params = {}> = (
    params?: Params,
    options?: QueryOptions<Model>,
  ) => [
    Optional<Model>,
    Dispatch<SetStateAction<Optional<Params>>>,
    ModelHelpers<Model, Params>,
  ];

  // model
  type ModelCallbacks<Model> = {
    onSuccess?: (data: ModelMeta<Model>) => void;
    onError?: (data: ApiError) => void;
  };

  type GetModel<Model, ModelId = Identifier, Callbacks = ModelCallbacks<Model>> = (
    id?: ModelId,
    callbacks?: Callbacks,
  ) => Optional<Promise<Optional<Model>>>;

  type CreateModel<
    Model,
    CreateData = CreateModelData<Model>,
    Callbacks = ModelCallbacks<Model>,
  > = (data: CreateData, callbacks?: Callbacks) => Optional<Promise<Optional<Model>>>;

  type UpdateModel<
    Model,
    UpdateData = UpdateModelData<Model>,
    ModelId = Identifier,
    Callbacks = ModelCallbacks<Model>,
  > = (
    data: UpdateData,
    id?: ModelId,
    callbacks?: Callbacks,
  ) => Optional<Promise<Optional<Model>>>;

  type DeleteModel<ModelId = Identifier, Callbacks = ModelCallbacks<void>> = (
    id?: ModelId,
    callbacks?: Callbacks,
  ) => Optional<Promise<void>>;

  type UseModelHook<Model, ModelId = Identifier, ModelMethods = undefined> = (
    id?: ModelId,
    options?: QueryOptions<Model>,
  ) => [Optional<Model>, UseQueryResult<Model>, ModelMethods];
}
