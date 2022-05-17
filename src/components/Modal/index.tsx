import React, { useState } from 'react';

import { Backdrop, Content, Trigger } from './styles';

export type ModalProps = {
  trigger: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ trigger, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Trigger onClick={() => setOpen(true)}>{trigger}</Trigger>

      {open && (
        <>
          <Content>{children}</Content>

          <Backdrop onClick={() => setOpen(false)} />
        </>
      )}
    </>
  );
};
