import { CSS } from '@stitches/react';
import { styled } from 'styles/theme';

export const Container = styled('div');

export const TableContainer = styled('div', {
  height: '55vh',
  position: 'relative',
  overflowY: 'auto',
  marginBottom: '1rem',
  backgroundColor: '$background',
  borders: 'all',
});

export const TableElement = styled('table', {
  borderSpacing: 0,
  width: '100%',
  textAlign: 'left',
  backgroundColor: '$foreground',
  borders: 'bottom',
});

const cellStyles = {
  margin: 0,
  padding: '$300',
  borders: ['bottom', 'right'],

  '&:last-child': {
    borderRight: 'none',
  },
} as CSS;

export const TableHead = styled('thead', {
  top: 0,
  position: 'sticky',
});

export const TableHeader = styled('th', {
  ...cellStyles,
  backgroundColor: '$tableHeader',
  height: '$tableHeaderHeight',

  variants: {
    disabled: {
      false: {
        '&:hover': {
          backgroundColor: '$accent',
        },
      },
    },

    checkbox: {
      true: {
        borderRight: 'none',
      },
    },
  },
});

export const TableData = styled('td', {
  ...cellStyles,

  variants: {
    checkbox: {
      true: {
        borderRight: 'none',
      },
    },
  },
});

export const CellContent = styled('div', {
  overflow: 'hidden',

  variants: {
    wrap: {
      false: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },
    },
  },

  defaultVariants: {
    wrap: false,
  },
});

export const TableHeaderContent = styled('div', {
  color: 'inherit',
  centralize: 'align',
  height: '100%',
  gap: '$200',
});

export const TableBody = styled('tbody');

export const TableDataContent = styled('div', {
  centralize: 'align',
  height: '100%',
});

export const TableRow = styled('tr', {
  [`&:last-child > ${TableData}`]: {
    borderBottom: 'none',
  },

  '&:hover': {
    backgroundColor: '$accent',
  },

  variants: {
    header: {
      true: {
        // custom styles for header
      },
    },

    selected: {
      true: {
        backgroundColor: '$accent',

        '&:hover': {
          backgroundColor: '$darkAccent',
        },
      },
    },
  },
});

export const Placeholder = styled('div', {
  position: 'absolute',
  inset: 0,
  paddingTop: '$sizes$tableHeaderHeight',
  centralize: 'all',
  backgroundColor: '$overlayLight',
  visibility: 'hidden',

  variants: {
    enabled: {
      true: {
        visibility: 'visible',
      },
    },
  },
});
