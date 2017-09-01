import { AppVersion } from './app-version.model';
import * as Chance from 'chance';

let chance = new Chance();

export function getAppVersionMock(): AppVersion {
  return {
    hash: chance.string(),
    version: chance.string()
  };
}
