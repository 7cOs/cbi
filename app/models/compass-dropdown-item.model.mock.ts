import * as Chance from 'chance';
import { generateRandomSizedArray } from './util.model';

import { CompassDropdownItem } from './compass-dropdown-item.model';

const chance = new Chance();

export function getCompassDropdownItemMock(): CompassDropdownItem {
  return {
    display: chance.string(),
    value: chance.string()
  };
}

export function getCompassDropdownItemArrayMock(): CompassDropdownItem[] {
  return generateRandomSizedArray().map(() => getCompassDropdownItemMock());
}
