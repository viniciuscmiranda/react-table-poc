import { posts } from 'api';
import { QUERIES } from 'constants';
import { useCallback, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import {
  CreatePost,
  DeletePost,
  GetPost,
  Post,
  PostId,
  PostMethods,
  UpdatePost,
} from 'types/Posts';

export const usePost: UseModelHook<Post, PostId, PostMethods> = (
  postId?: PostId,
  options?: QueryOptions<Post>,
) => {
  const queryClient = useQueryClient();
  const query = useQuery<Post>(
    [QUERIES.post, postId],
    async () => {
      const res = await posts.getPost(postId as PostId);

      return res.data;
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      ...options,
    },
  );

  const getPost = useCallback<GetPost>(
    async (id = postId as PostId, callbacks) => {
      if (!postId) return;

      try {
        const res = await posts.getPost(id);
        queryClient.setQueryData([QUERIES.post, id], res.data);

        callbacks?.onSuccess?.(res);
        return res.data;
      } catch (err) {
        callbacks?.onError?.(err as ApiError);
      }
    },
    [postId],
  );

  const createPost = useCallback<CreatePost>(async (data, callbacks) => {
    try {
      const res = await posts.createPost(data);
      queryClient.invalidateQueries(QUERIES.posts);

      callbacks?.onSuccess?.(res);
      return res.data;
    } catch (err) {
      callbacks?.onError?.(err as ApiError);
    }
  }, []);

  const updatePost = useCallback<UpdatePost>(
    async (data, id = postId as PostId, callbacks) => {
      if (!postId) return;

      try {
        const res = await posts.updatePost(data, id);
        queryClient.setQueryData([QUERIES.post, id], res.data);
        queryClient.setQueriesData<Post[]>(QUERIES.posts, (data = []) => {
          return data.map((post) => {
            if (post.id === id) return res.data;
            return post;
          });
        });

        callbacks?.onSuccess?.(res);
        return res.data;
      } catch (err) {
        callbacks?.onError?.(err as ApiError);
      }
    },
    [postId],
  );

  const deletePost = useCallback<DeletePost>(
    async (id = postId as PostId, callbacks) => {
      if (!postId) return;

      try {
        const res = await posts.deletePost(id);
        queryClient.removeQueries([QUERIES.post, id]);
        queryClient.invalidateQueries(QUERIES.posts);

        callbacks?.onSuccess?.(res);
      } catch (err) {
        callbacks?.onError?.(err as ApiError);
      }
    },
    [postId],
  );

  useEffect(() => {
    if (postId) getPost(postId);
  }, []);

  const data = useMemo(() => query.data, [query]);

  return [
    data,
    query,
    {
      getPost,
      createPost,
      updatePost,
      deletePost,
    },
  ];
};
