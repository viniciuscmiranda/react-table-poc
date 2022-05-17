import React from 'react';
import { ColumnInstance, Hooks } from 'react-table';

import { Checkbox } from './Checkbox';
import { TableDataContent, TableHeaderContent } from './styles';
import { TableOptions } from './types';

export const useCustomRowSelect = <D extends ObjectShape = {}>(
  hooks: Hooks<D>,
  options: TableOptions<D>,
) => {
  hooks.visibleColumns.push((columns) => [
    {
      id: 'select',
      width: 'max-content',
      Header: ({ toggleRowSelected, isAllRowsSelected, page }) => {
        const onChange = (event: React.ChangeEvent) => {
          page.forEach((row) => {
            //check each row if it is not disabled
            const disabled = options.disabledSelectIds?.includes(row.id);
            const checked = (event.target as HTMLInputElement).checked;

            if (!disabled) toggleRowSelected(row.id, checked);
          });
        };

        let selectableRows = 0;
        let selectedRows = 0;

        page.forEach((row) => {
          const disabled = options.disabledSelectIds?.includes(row.id);

          if (!disabled) selectableRows++;
          if (row.isSelected) selectedRows++;
        });

        const disabled = selectableRows === 0;
        const checked = selectedRows >= selectableRows;

        return (
          <TableHeaderContent>
            <Checkbox
              onChange={onChange}
              disabled={disabled}
              checked={(isAllRowsSelected || checked) && !disabled}
            />
          </TableHeaderContent>
        );
      },
      Cell: ({ row }) => {
        const disabled = options.disabledSelectIds?.includes(row.id);

        return (
          <TableDataContent>
            <Checkbox {...row.getToggleRowSelectedProps()} disabled={disabled} />
          </TableDataContent>
        );
      },
    } as ColumnInstance<D>,
    ...columns,
  ]);
};
