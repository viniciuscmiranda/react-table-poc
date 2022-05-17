import { many } from 'utils';

import { Directions } from './types';

export function getDirectionsValues(directions: Many<Directions>, value: string) {
  directions = many(directions);
  let values: string[] = [];

  (['top', 'right', 'bottom', 'left'] as Directions[]).forEach((direction) => {
    if (directions.includes('all')) values.push(value);
    else if (directions.includes(direction)) values.push(value);
    else values.push('0');
  });

  return values.join(' ');
}
