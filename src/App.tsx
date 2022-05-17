import { QueryProvider } from 'contexts/query';
import { Posts } from 'pages/Posts';
import React from 'react';
// import { ReactQueryDevtools } from 'react-query/devtools';
import { global } from 'styles/global';

export const App: React.FC = () => {
  global();

  return (
    <QueryProvider>
      <Posts />

      {/* <ReactQueryDevtools  /> */}
    </QueryProvider>
  );
};
