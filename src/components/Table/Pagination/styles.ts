import { styled } from 'styles/theme';

export const PaginationContainer = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',

  '& > div': {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '$300',
  },
});

export const PageSizeSelect = styled('select', {
  height: '$inputHeight',
  borders: 'all',
  cursor: 'pointer',
  fontWeight: '$bold',
});

export const PageControl = styled('div', {
  height: '$inputHeight',
  centralize: 'align',
  borders: 'all',
});

export const PageButton = styled('button', {
  all: 'unset',
  padding: '0 $200',
  cursor: 'pointer',
  height: '100%',
  width: '1.25rem',
  centralize: 'all',

  '&:hover:not(:disabled)': {
    backgroundColor: '$accent',
  },

  '&:disabled': {
    color: '$textSecondary',
    cursor: 'not-allowed',
  },
});

export const PageLabel = styled('span', {
  fontWeight: '$bold',
  margin: '0 $300',
});
