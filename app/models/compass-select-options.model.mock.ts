import * as Chance from 'chance';
import { CompassSelectOption } from './compass-select-component.model';

const chance = new Chance();

export function getSelectOptionsMockStandard(): Array<CompassSelectOption> {
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

export function getSelectOptionsMockStrings(): Array<CompassSelectOption> {
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

export function getSelectOptionsMockNumbers(): Array<CompassSelectOption> {
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
