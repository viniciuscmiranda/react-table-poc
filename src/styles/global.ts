import { globalCss } from './theme';

export const global = globalCss({
  '*': {
    boxSizing: 'border-box',
    fontFamily: 'Consolas',
    color: '$text',
  },

  p: {
    margin: 0,
    padding: 0,
  },
});
