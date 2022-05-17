import React from 'react';
import { TableToggleRowsSelectedProps } from 'react-table';

export const Checkbox: React.FC<TableToggleRowsSelectedProps & { disabled?: boolean }> =
  ({ indeterminate, checked, ...props }) => {
    return (
      <label style={{ cursor: props.disabled ? 'not-allowed' : 'pointer' }}>
        {props.disabled ? '⬛' : checked ? '✅' : '🔲'}
        <input {...props} checked={checked} type="checkbox" style={{ display: 'none' }} />
      </label>
    );
  };
