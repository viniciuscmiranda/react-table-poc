import { createStitches, CSS } from '@stitches/react';

import { Directions } from './types';
import { getDirectionsValues } from './utils';

export const { styled, globalCss, theme } = createStitches({
  theme: {
    colors: {
      // basics
      background: 'lightgray',
      foreground: 'white',
      stroke: 'black',

      // colors
      accent: '#eee',
      darkAccent: '#ccc',
      tableHeader: 'rgba(255, 255, 255, .9)',

      // text
      text: 'black',
      textLight: 'white',
      textSecondary: 'gray',

      // overlays
      overlayLight: 'rgba(255, 255, 255, 0.6)',
      overlay: 'rgba(0, 0, 0, .7)',
    },

    space: {
      100: '.1rem',
      200: '.25rem',
      300: '.5rem',
      400: '1rem',
      500: '1.5rem',
      600: '2rem',
      700: '1rem',
      800: '3rem',
      900: '3.5rem',
      1000: '4rem',
    },

    borderWidths: {
      0: '1px',
    },

    sizes: {
      tableHeaderHeight: '2.5rem',
      inputHeight: '2rem',
    },

    fontWeights: {
      bold: '600',
    },

    zIndices: {
      modal: 100,
      overlay: 99,
    },
  },

  utils: {
    borders: (value: Many<Directions>) =>
      value && {
        borderColor: '$stroke',
        borderWidth: getDirectionsValues(value, '$0'),
        borderStyle: 'solid',
      },

    centralize: (value: 'all' | 'align' | 'justify') => {
      const styles = {
        display: 'flex',
      } as CSS;

      if (value === 'align' || value === 'all') {
        styles.alignItems = 'center';
      }

      if (value === 'justify' || value === 'all') {
        styles.justifyContent = 'center';
      }

      return styles;
    },
  },
});
