import { styled } from 'styles/theme';

export const FiltersContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '$300',
  marginBottom: '$600',
  marginTop: '$500',

  '& > div': {
    display: 'flex',
    gap: '$200',
  },
});

export const Input = styled('input', {
  padding: '$300',
  width: '100%',
});

export const Select = styled('select', {
  padding: '$300',
  width: '10rem',
  minWidth: '10rem',
  cursor: 'pointer',

  variants: {
    main: {
      true: {
        width: '100%',
      },
    },
  },
});

export const Button = styled('button', {
  padding: '$300',
  cursor: 'pointer',
});

export const HeaderContainer = styled('div', {
  centralize: 'align',
  gap: '$200',
  marginBottom: '$200',
});

export const FilterButton = styled(Button);
