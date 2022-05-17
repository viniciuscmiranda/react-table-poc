import { styled } from 'styles/theme';

export const Trigger = styled('div', {
  display: 'contents',
  cursor: 'pointer',
});

export const Content = styled('div', {
  maxHeight: '80vh',
  width: '60vw',
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '$400',
  backgroundColor: '$foreground',
  borders: 'all',
  zIndex: '$modal',
});

export const Backdrop = styled('div', {
  position: 'fixed',
  inset: 0,
  backgroundColor: '$overlay',
  zIndex: '$overlay',
});
