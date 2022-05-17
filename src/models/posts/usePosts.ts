import { getPosts } from 'api/posts';
import { QUERIES } from 'constants';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { Post, PostsParams } from 'types/Posts';

export const usePosts: UseModelsHook<Post[], PostsParams> = (initialParams, options) => {
  const [params, setParams] = useState(initialParams);
  const [meta, setMeta] = useState<ModelMeta<Post[]>>();

  const query = useQuery<Post[]>(
    [QUERIES.post, params],
    async () => {
      const res = await getPosts(params);

      setMeta(res);
      return res.data;
    },
    {
      enabled: Boolean(params),
      ...options,
    },
  );

  const data = useMemo(() => query.data, [query]);

  return [
    data,
    setParams,
    {
      ...query,
      meta,
      params,
    },
  ];
};
