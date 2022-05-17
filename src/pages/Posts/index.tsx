import { Table, TableRefProps } from 'components/Table';
import { usePosts } from 'models';
import React, { useRef } from 'react';
import { Post } from 'types/Posts';

export const Posts = () => {
  const tableRef = useRef<TableRefProps<Post>>(null);
  const [posts, getPosts, { isLoading, isFetching }] = usePosts();

  return (
    <main>
      <h1>Query Models POC</h1>
      <hr />

      <h2>Posts{isFetching && '...'}</h2>

      <Table
        ref={tableRef}
        total={100}
        data={posts}
        search
        select
        loading={isLoading}
        onChange={(params) => getPosts(params)}
        options={{
          disabledSelectIds: [1, 4],
        }}
        columns={{
          id: {
            label: 'Id',
            width: 5,
            filter: {
              type: 'number',
              extends: ['number-between', 'number-greater', 'number-lower'],
            },
          },
          userId: {
            label: 'User',
            canSort: false,
            width: 5,
            filter: {
              type: 'select',
              options: Array.from({ length: 20 }).map((_, n) => ({
                value: n + 1,
                label: String(n + 1),
              })),
            },
          },
          title: {
            label: 'Title',
            width: 10,
            filter: true,
          },
          body: 'Body',
        }}
      />
    </main>
  );
};
