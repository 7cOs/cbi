import { AppVersion } from './app-version.model';
import * as Chance from 'chance';
let chance = new Chance();

export function appVersionMock(): AppVersion {
  return {
    env: chance.string(),
    hash: chance.string(),
    version: chance.string()
  };
};
