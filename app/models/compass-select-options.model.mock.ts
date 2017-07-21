import * as Chance from 'chance';
import { CompassSelectOption } from './compass-select-component.model';

const chance = new Chance();

export function selectOptionsMockStandard(): Array<CompassSelectOption> {
  return [{
    display: chance.string(),
    value: chance.string()
  }, {
    display: chance.string(),
    value: chance.string()
  }, {
    display: chance.string(),
    value: chance.string()
  }];
}

export function selectOptionsMockStrings(): Array<CompassSelectOption> {
  return [{
    display: chance.string(),
    subDisplay: chance.string(),
    value: chance.string()
  }, {
    display: chance.string(),
    subDisplay: chance.string(),
    value: chance.string()
  }, {
    display: chance.string(),
    subDisplay: chance.string(),
    value: chance.string()
  }];
}

export function selectOptionsMockNumbers(): Array<CompassSelectOption> {
  return [{
    display: chance.string(),
    subDisplay: chance.string(),
    value: chance.integer()
  }, {
    display: chance.string(),
    subDisplay: chance.string(),
    value: chance.integer()
  }, {
    display: chance.string(),
    subDisplay: chance.string(),
    value: chance.integer()
  }];
}
