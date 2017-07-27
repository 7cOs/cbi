import * as Chance from 'chance';
import { CompassRadioOption } from './compass-radio-component.model';

const chance = new Chance();

export function getCompassRadioOptionMock(): Array<CompassRadioOption> {
  return [
    { display: chance.string(), value: chance.integer() },
    { display: chance.string(), value: chance.integer() },
    { display: chance.string(), value: chance.integer() }
  ];
}
